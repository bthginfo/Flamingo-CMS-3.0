import { getMediaAssets } from '../media-actions';
import { MediaLibrary } from './media-library';

export default async function MediaPage() {
  const assets = await getMediaAssets();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mediathek</h1>
      <p className="text-zinc-500 text-sm mb-8">Bilder hochladen und verwalten. Klicken Sie auf ein Bild, um die URL zu kopieren.</p>
      <MediaLibrary initialAssets={assets} />
    </div>
  );
}
