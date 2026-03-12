"use client";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  year: number | null;
  onYearChange: (year: number | null) => void;
  years: number[];
};

export default function SearchBar({
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">
      {/* 텍스트 검색 입력 */}
      <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="색상 이름, 코드, HEX 검색..."
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        {/* 검색어 초기화 버튼 */}
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
            aria-label="검색어 초기화"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 연도 필터 드롭다운 */}
      <div className="relative shrink-0">
        <select
          value={year ?? ""}
          onChange={(e) =>
            onYearChange(e.target.value ? Number(e.target.value) : null)
          }
          className={[
            "appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer",
            year !== null
              ? "bg-indigo-500 text-white"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100",
          ].join(" ")}
        >
          <option value="">연도 전체</option>
          {/* 최신 연도부터 내림차순 */}
          {[...years].reverse().map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        {/* 드롭다운 화살표 아이콘 */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={[
            "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none",
            year !== null ? "text-white" : "text-gray-400",
          ].join(" ")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
