export type LivePreviewPayload = Record<string, unknown>;

type PreviewMessageTarget = {
  postMessage: (message: unknown, targetOrigin: string) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Live preview updates are intentionally partial. Keep field-level objects
 * that are commonly edited piecemeal while replacing arrays and complete
 * document payloads (sections, navigation items, collections) as a unit.
 */
export function mergeLivePreviewPayload(
  current: LivePreviewPayload,
  incoming: LivePreviewPayload,
): LivePreviewPayload {
  const merged = { ...current, ...incoming };

  for (const key of ['cssVars', 'brand', 'contact', 'socialLinks']) {
    const previousValue = current[key];
    const nextValue = incoming[key];
    if (isRecord(previousValue) && isRecord(nextValue)) {
      merged[key] = { ...previousValue, ...nextValue };
    }
  }

  return merged;
}

export function createLivePreviewRelay() {
  let latestPayload: LivePreviewPayload = {};

  function post(
    target: PreviewMessageTarget | null | undefined,
    targetOrigin: string,
  ) {
    if (!target || Object.keys(latestPayload).length === 0) return false;
    target.postMessage(
      { type: 'flamingo-live-preview', payload: latestPayload },
      targetOrigin,
    );
    return true;
  }

  return {
    send(
      payload: LivePreviewPayload,
      target: PreviewMessageTarget | null | undefined,
      targetOrigin: string,
    ) {
      latestPayload = mergeLivePreviewPayload(latestPayload, payload);
      return post(target, targetOrigin);
    },
    replay(
      target: PreviewMessageTarget | null | undefined,
      targetOrigin: string,
    ) {
      return post(target, targetOrigin);
    },
    getLatestPayload() {
      return latestPayload;
    },
  };
}
