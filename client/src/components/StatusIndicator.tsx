interface StatusIndicatorProps {
  isConnected: boolean;
  lastUpdate?: string;
}

export function StatusIndicator({ isConnected, lastUpdate }: StatusIndicatorProps) {
  return (
    <div className="flex flex-col items-center space-y-2 mb-6">
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
        isConnected
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      {lastUpdate && (
        <div className="text-xs text-gray-500">
          Last updated: {lastUpdate}
        </div>
      )}
    </div>
  );
}
