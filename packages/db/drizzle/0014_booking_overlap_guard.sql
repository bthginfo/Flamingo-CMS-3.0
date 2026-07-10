-- Serialize confirmed bookings per tenant/resource and enforce capacity inside
-- the INSERT/UPDATE transaction. This closes the check-then-insert race while
-- preserving resources and availability rules whose capacity is greater than 1.
CREATE OR REPLACE FUNCTION enforce_booking_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  booking_capacity integer := 1;
  overlap_count integer := 0;
  booking_timezone text := 'Europe/Berlin';
BEGIN
  IF NEW.status <> 'confirmed' THEN
    RETURN NEW;
  END IF;

  -- A resource-wide lock is intentionally coarse: bookings for distinct times
  -- serialize briefly, but arbitrary overlapping ranges cannot bypass the lock.
  PERFORM pg_advisory_xact_lock(hashtextextended(
    NEW.tenant_id::text || ':' || COALESCE(NEW.resource_id::text, 'none') || ':' || NEW.time_model::text,
    0
  ));

  IF NEW.resource_id IS NOT NULL THEN
    SELECT GREATEST(COALESCE(capacity, 1), 1)
      INTO booking_capacity
      FROM booking_resources
      WHERE id = NEW.resource_id AND tenant_id = NEW.tenant_id;
  ELSE
    SELECT GREATEST(COALESCE(MAX(capacity), 0), 1)
      INTO booking_capacity
      FROM booking_calendar_blocks
      WHERE tenant_id = NEW.tenant_id
        AND active = true
        AND type = 'available'
        AND starts_at <= NEW.starts_at
        AND ends_at >= NEW.ends_at
        AND (service_id IS NULL OR service_id = NEW.service_id)
        AND resource_id IS NULL;

    IF booking_capacity = 1 THEN
      SELECT COALESCE(timezone, 'Europe/Berlin')
        INTO booking_timezone
        FROM booking_settings
        WHERE tenant_id = NEW.tenant_id;

      SELECT GREATEST(COALESCE(MAX(capacity), 0), 1)
        INTO booking_capacity
        FROM booking_availability_rules
        WHERE tenant_id = NEW.tenant_id
          AND active = true
          AND weekday = EXTRACT(DOW FROM NEW.starts_at AT TIME ZONE booking_timezone)::integer
          AND (service_id IS NULL OR service_id = NEW.service_id)
          AND resource_id IS NULL;
    END IF;
  END IF;

  SELECT COUNT(*)
    INTO overlap_count
    FROM booking_requests existing
    WHERE existing.tenant_id = NEW.tenant_id
      AND existing.status = 'confirmed'
      AND existing.id <> NEW.id
      AND (
        (NEW.resource_id IS NOT NULL AND existing.resource_id = NEW.resource_id)
        OR
        (NEW.resource_id IS NULL AND existing.resource_id IS NULL AND existing.time_model = NEW.time_model)
      )
      AND existing.starts_at - make_interval(mins => existing.buffer_before_minutes)
            < NEW.ends_at + make_interval(mins => NEW.buffer_after_minutes)
      AND existing.ends_at + make_interval(mins => existing.buffer_after_minutes)
            > NEW.starts_at - make_interval(mins => NEW.buffer_before_minutes);

  IF overlap_count >= booking_capacity THEN
    RAISE EXCEPTION 'BOOKING_CONFLICT: capacity % already reached', booking_capacity
      USING ERRCODE = '23P01';
  END IF;

  RETURN NEW;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS booking_requests_capacity_guard ON booking_requests;
--> statement-breakpoint
CREATE TRIGGER booking_requests_capacity_guard
BEFORE INSERT OR UPDATE OF status, resource_id, time_model, starts_at, ends_at, buffer_before_minutes, buffer_after_minutes
ON booking_requests
FOR EACH ROW
EXECUTE FUNCTION enforce_booking_capacity();
