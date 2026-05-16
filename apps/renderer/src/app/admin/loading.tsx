export default function AdminLoading() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-4 w-96 bg-gray-100 rounded" />
      <div className="mt-8 space-y-3">
        <div className="h-20 bg-gray-100 rounded-lg" />
        <div className="h-20 bg-gray-100 rounded-lg" />
        <div className="h-20 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}
