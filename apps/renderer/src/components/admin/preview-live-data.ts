export type LivePreviewPayload = Record<string, unknown>;
export type CssVarPatch = Record<string, string | null>;
export type CssVarLayers = Record<string, Record<string, string>>;
export type CssVarLayerPatches = Record<string, CssVarPatch>;

type PreviewMessageTarget = {
  postMessage: (message: unknown, targetOrigin: string) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * CSS variable updates are patches. A null value explicitly removes a
 * previously previewed override so reset buttons cannot leave stale values in
 * the iframe or in the replay buffer.
 */
export function applyCssVarPatch(
  current: Record<string, string>,
  patch: CssVarPatch,
): Record<string, string> {
  const next = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    if (typeof value === 'string' && value.trim()) next[key] = value;
    else delete next[key];
  }
  return next;
}

export function buildCssVarPatch(
  previous: Record<string, string>,
  current: Record<string, string>,
): CssVarPatch {
  const patch: CssVarPatch = { ...current };
  for (const key of Object.keys(previous)) {
    if (!(key in current)) patch[key] = null;
  }
  return patch;
}

export function applyCssVarLayerPatches(
  current: CssVarLayers,
  patches: CssVarLayerPatches,
): CssVarLayers {
  const next = { ...current };
  for (const [layer, patch] of Object.entries(patches)) {
    next[layer] = applyCssVarPatch(next[layer] || {}, patch);
  }
  return next;
}

/**
 * Brand provides the normal style-derived fallback palette. Design is an
 * explicit override layer and therefore always wins, independent of which
 * form happened to emit its preview update first.
 */
export function composeCssVarLayers(
  base: Record<string, string>,
  layers: CssVarLayers,
): Record<string, string> {
  const result = { ...base };
  const orderedLayers = ['brand', 'design'];
  for (const layer of orderedLayers) Object.assign(result, layers[layer] || {});
  for (const [layer, values] of Object.entries(layers)) {
    if (!orderedLayers.includes(layer)) Object.assign(result, values);
  }
  return result;
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

  if (isRecord(current.cssVarLayers) && isRecord(incoming.cssVarLayers)) {
    const layers = { ...current.cssVarLayers };
    for (const [layer, patch] of Object.entries(incoming.cssVarLayers)) {
      const previousLayer = layers[layer];
      layers[layer] = isRecord(previousLayer) && isRecord(patch)
        ? { ...previousLayer, ...patch }
        : patch;
    }
    merged.cssVarLayers = layers;
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
