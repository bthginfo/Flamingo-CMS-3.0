import type { IgMedia } from './graph';

export type ExistingInstagramPost = {
  igMediaId: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  caption: string | null;
  timestamp: Date | string;
  position: number;
};

export type InstagramPostWrite = {
  igMediaId: string;
  mediaType: IgMedia['media_type'];
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
  caption: string | null;
  timestamp: Date;
  position: number;
};

export function diffInstagramPosts(existing: ExistingInstagramPost[], incoming: IgMedia[]) {
  const existingByMediaId = new Map(existing.map(post => [post.igMediaId, post]));
  const incomingIds = new Set<string>();
  const upserts: InstagramPostWrite[] = [];

  for (const [position, media] of incoming.entries()) {
    if (incomingIds.has(media.id)) throw new Error(`Instagram returned duplicate media ID: ${media.id}`);
    incomingIds.add(media.id);

    const next: InstagramPostWrite = {
      igMediaId: media.id,
      mediaType: media.media_type,
      mediaUrl: media.media_url,
      thumbnailUrl: media.thumbnail_url ?? null,
      permalink: media.permalink,
      caption: media.caption ?? null,
      timestamp: new Date(media.timestamp),
      position,
    };
    if (!Number.isFinite(next.timestamp.getTime())) throw new Error(`Instagram returned an invalid timestamp for media ${media.id}`);

    const current = existingByMediaId.get(media.id);
    if (!current || !sameInstagramPost(current, next)) upserts.push(next);
  }

  return {
    upserts,
    removedMediaIds: existing.filter(post => !incomingIds.has(post.igMediaId)).map(post => post.igMediaId),
  };
}

function sameInstagramPost(current: ExistingInstagramPost, next: InstagramPostWrite) {
  return current.mediaType === next.mediaType
    && current.mediaUrl === next.mediaUrl
    && current.thumbnailUrl === next.thumbnailUrl
    && current.permalink === next.permalink
    && current.caption === next.caption
    && new Date(current.timestamp).getTime() === next.timestamp.getTime()
    && current.position === next.position;
}
