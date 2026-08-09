export function restoreOrderByIds<T extends { id: string }>(current: T[], confirmedIds: string[]): T[] {
  const byId = new Map(current.map(item => [item.id, item]));
  const restored = confirmedIds.flatMap(id => {
    const item = byId.get(id);
    if (!item) return [];
    byId.delete(id);
    return [item];
  });
  return [...restored, ...byId.values()];
}

export function restoreItemAtIndex<T extends { id: string }>(current: T[], item: T, index: number): T[] {
  if (current.some(candidate => candidate.id === item.id)) return current;
  const next = [...current];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, item);
  return next;
}
