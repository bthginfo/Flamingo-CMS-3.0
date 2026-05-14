import { getPublishHistoryAction, getActiveSnapshotAction } from './actions';
import { PublishPanel } from './publish-panel';
import { Rocket } from 'lucide-react';

export default async function PublishPage() {
  const [active, history] = await Promise.all([
    getActiveSnapshotAction(),
    getPublishHistoryAction(),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Rocket size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Veröffentlichen</h1>
          <p className="text-sm text-zinc-500">Alle Änderungen als neue Version live schalten</p>
        </div>
      </div>
      <PublishPanel activeSnapshot={active} history={history} />
    </div>
  );
}
