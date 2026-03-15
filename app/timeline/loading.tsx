// 항목 고정 높이 — TimelineClient와 동일
const ITEM_H = 108;

export default function TimelineLoading() {
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 헤더 스켈레톤 */}
      <header className="flex-none px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="w-16 h-4 rounded bg-gray-200 animate-pulse" />
        <div className="w-32 h-3 rounded bg-gray-200 animate-pulse" />
        <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
      </header>

      {/* 목록 스켈레톤 */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full relative">
          {/* 수직 연결선 — padding(32) + year(64) + gap(24) + dot중심(5) = 125px */}
          <div
            className="absolute top-0 bottom-0 w-px pointer-events-none"
            style={{ left: 125, backgroundColor: "rgba(0,0,0,0.08)" }}
          />

          {Array.from({ length: 7 }).map((_, i) => {
            const isCenter = i === 3;
            return (
              <div
                key={i}
                className="flex items-center gap-6 px-8 animate-pulse"
                style={{ height: ITEM_H, opacity: Math.max(0.15, 1 - Math.abs(i - 3) * 0.22) }}
              >
                {/* 연도 */}
                <div className="w-16 flex justify-end shrink-0">
                  <div className={`rounded bg-gray-200 ${isCenter ? "w-12 h-5" : "w-10 h-4"}`} />
                </div>

                {/* 점 */}
                <div
                  className="rounded-full bg-gray-300 shrink-0"
                  style={{ width: isCenter ? 12 : 8, height: isCenter ? 12 : 8 }}
                />

                {/* 스와치 + 정보 */}
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-2xl bg-gray-200 shrink-0"
                    style={{ width: isCenter ? 68 : 44, height: isCenter ? 68 : 44 }}
                  />
                  <div className="space-y-2">
                    <div className="w-16 h-2.5 rounded bg-gray-200" />
                    <div className={`rounded bg-gray-200 ${isCenter ? "w-36 h-5" : "w-28 h-4"}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
