export default function TimelineLoading() {
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* 헤더 스켈레톤 */}
      <header className="flex-none px-6 py-4 flex items-center justify-between border-b border-white/8">
        <div className="w-16 h-4 rounded bg-white/10 animate-pulse" />
        <div className="w-32 h-3 rounded bg-white/10 animate-pulse" />
        <div className="w-10 h-3 rounded bg-white/10 animate-pulse" />
      </header>

      {/* 목록 스켈레톤 */}
      <div className="flex-1 flex flex-col justify-center gap-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-8 animate-pulse"
            style={{ height: 108, opacity: Math.max(0.15, 1 - Math.abs(i - 3) * 0.22) }}
          >
            <div className="w-16 h-5 rounded bg-white/10 ml-auto" />
            <div className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
            <div className="flex items-center gap-4">
              <div
                className="rounded-2xl bg-white/10 shrink-0"
                style={{ width: i === 3 ? 68 : 44, height: i === 3 ? 68 : 44 }}
              />
              <div className="space-y-2">
                <div className="w-16 h-2.5 rounded bg-white/10" />
                <div className="w-32 h-4 rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
