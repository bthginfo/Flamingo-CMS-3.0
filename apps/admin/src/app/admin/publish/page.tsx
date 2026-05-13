import { getPublishHistoryAction, getActiveSnapshotAction } from './actions';
import { PublishPanel } from './publish-panel';

export default async function PublishPage() {
  const [active, history] = await Promise.all([
    getActiveSnapshotAction(),
    getPublishHistoryAction(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Veröffentlichen</h1>
      <PublishPanel activeSnapshot={active} history={history} />
    </div>
  );
}
