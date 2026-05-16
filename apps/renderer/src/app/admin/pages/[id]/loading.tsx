export default function PageEditorLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 bg-gray-200 rounded" />
        <div className="h-7 w-64 bg-gray-200 rounded" />
      </div>
      <div className="space-y-3 mt-6">
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="h-24 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}
