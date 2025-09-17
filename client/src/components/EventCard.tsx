import type { SystemEvent } from '@/types/SystemEvent';

interface EventCardProps {
  event: SystemEvent;
}

export function EventCard({ event }: EventCardProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '🚨';
      case 'WARNING': return '⚠️';
      case 'INFO': return 'ℹ️';
      default: return '📋';
    }
  };

  const isRecentlyUpdated = () => {
    const updatedTime = new Date(event.updatedAt);
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    return updatedTime > thirtySecondsAgo;
  };

  return (
    <div className={`p-4 border rounded-lg ${
      isRecentlyUpdated()
        ? 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200'
        : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getSeverityIcon(event.severity)}</span>
          <h3 className="font-semibold text-gray-900">{event.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
            event.severity === 'CRITICAL' ? 'bg-red-500' :
            event.severity === 'WARNING' ? 'bg-yellow-500' : 'bg-green-500'
          }`}>
            {event.severity}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {event.active ? 'Active' : 'Inactive'}
          </span>
          {isRecentlyUpdated() && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white animate-pulse">
              NEW
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(event.updatedAt).toLocaleString()}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">
        {event.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="font-medium text-blue-600">Count: {event.count}</span>
          <span>Created: {new Date(event.createdAt).toLocaleString()}</span>
        </div>

        <div className="mt-2 text-xs text-gray-400 font-mono">
          ID: {event.id}
        </div>
      </div>
    </div>
  );
}
