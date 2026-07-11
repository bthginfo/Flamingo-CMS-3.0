ALTER TABLE "form_submissions"
ADD COLUMN IF NOT EXISTS "payload" jsonb DEFAULT '{"version":1,"fields":[]}'::jsonb NOT NULL;

UPDATE "form_submissions"
SET "payload" = jsonb_build_object(
  'version', 1,
  'fields', jsonb_build_array(
    jsonb_build_object('name', 'name', 'label', 'Name', 'type', 'text', 'value', "name"),
    jsonb_build_object('name', 'email', 'label', 'E-Mail', 'type', 'email', 'value', "email")
  )
  || CASE WHEN NULLIF("phone", '') IS NOT NULL
    THEN jsonb_build_array(jsonb_build_object('name', 'phone', 'label', 'Telefon', 'type', 'tel', 'value', "phone"))
    ELSE '[]'::jsonb END
  || CASE WHEN NULLIF("message", '') IS NOT NULL
    THEN jsonb_build_array(jsonb_build_object('name', 'message', 'label', 'Nachricht', 'type', 'textarea', 'value', "message"))
    ELSE '[]'::jsonb END
)
WHERE "payload" = '{"version":1,"fields":[]}'::jsonb;
