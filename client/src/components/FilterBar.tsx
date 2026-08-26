/*
 * FilterBar — شريط الفلتر الجانبي لمكنز الدراسات العليا
 * نيلي فاتح، RTL
 */
import { RotateCcw, Filter } from "lucide-react";

interface FilterBarProps {
  degrees: string[];
  sources: string[];
  selectedDegree: string;
  selectedSource: string;
  sortBy: string;
  hasDownloadOnly: boolean;
  onDegreeChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onSortChange: (v: string) => void;
  onDownloadOnlyChange: (v: boolean) => void;
  onReset: () => void;
  activeFiltersCount: number;
  totalFiltered: number;
}

const SORT_OPTIONS = [
  { value: "default", label: "الترتيب الافتراضي" },
  { value: "newest", label: "الأحدث أولاً" },
  { value: "oldest", label: "الأقدم أولاً" },
  { value: "alpha", label: "أبجدي" },
  { value: "category", label: "حسب التخصص" },
  { value: "featured", label: "الدكتوراه أولاً" },
];

export default function FilterBar({
  degrees, sources, selectedDegree, selectedSource,
  sortBy, hasDownloadOnly,
  onDegreeChange, onSourceChange,
  onSortChange, onDownloadOnlyChange,
  onReset, activeFiltersCount, totalFiltered,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-card rounded-xl border border-teal-100 dark:border-border shadow-sm p-4 sticky top-32 space-y-5">
      {/* رأس الفلتر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
          <Filter className="w-4 h-4" />
          <span>الفلاتر</span>
          {activeFiltersCount > 0 && (
            <span className="bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            مسح
          </button>
        )}
      </div>

      {/* عدد النتائج */}
      <div className="text-center py-2 bg-teal-50 dark:bg-teal-950 rounded-lg">
        <span className="text-teal-700 dark:text-teal-300 font-bold text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>
          {totalFiltered.toLocaleString()}
        </span>
        <span className="text-gray-500 text-xs mr-1" style={{ fontFamily: "Cairo, sans-serif" }}>رسالة</span>
      </div>

      {/* الترتيب */}
      <FilterSection title="الترتيب">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-sm border border-teal-200 dark:border-border rounded-lg px-3 py-2 bg-white dark:bg-background text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FilterSection>

      {/* المصدر — في الموضع المرجعي أسفل الترتيب */}
      <FilterSection title="المصدر">
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full text-sm border border-teal-200 dark:border-border rounded-lg px-3 py-2 bg-white dark:bg-background text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          <option value="الكل">المصدر: الكل</option>
          {sources.slice(0, 20).map((source) => (
            <option key={source} value={source}>
              {source.length > 42 ? `${source.slice(0, 42)}…` : source}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* الدرجة العلمية */}
      <FilterSection title="الدرجة العلمية">
        <div className="space-y-1">
          {degrees.map((deg) => (
            <button
              key={deg}
              onClick={() => onDegreeChange(deg)}
              className={`w-full text-right text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedDegree === deg
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-950"
              }`}
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {deg}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* لها روابط تحميل فقط */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hasDownloadOnly}
          onChange={(e) => onDownloadOnlyChange(e.target.checked)}
          className="rounded border-teal-300 text-teal-600 focus:ring-teal-500"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300" style={{ fontFamily: "Cairo, sans-serif" }}>
          لها روابط تحميل فقط
        </span>
      </label>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide mb-2"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
