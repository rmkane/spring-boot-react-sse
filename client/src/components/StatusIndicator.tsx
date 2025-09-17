interface StatusIndicatorProps {
  isConnected: boolean
  lastUpdate?: string
}

export function StatusIndicator({ isConnected, lastUpdate }: StatusIndicatorProps) {
  return (
    <div className="mb-6 flex flex-col items-center space-y-2">
      <div
        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
          isConnected
            ? 'border border-green-200 bg-green-100 text-green-800'
            : 'border border-red-200 bg-red-100 text-red-800'
        }`}
      >
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      {lastUpdate && <div className="text-xs text-gray-500">Last updated: {lastUpdate}</div>}
    </div>
  )
}
