/*
 * FilterBar — شريط الفلتر الجانبي لمكنز الدراسات العليا
 * نيلي فاتح، RTL
 */
import { RotateCcw, Filter } from "lucide-react";

interface FilterBarProps {
  categories: string[];
  degrees: string[];
  fileTypes: string[];
  selectedCategory: string;
  selectedDegree: string;
  selectedFileType: string;
  sortBy: string;
  hasDownloadOnly: boolean;
  onCategoryChange: (v: string) => void;
  onDegreeChange: (v: string) => void;
  onFileTypeChange: (v: string) => void;
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
  categories, degrees, fileTypes,
  selectedCategory, selectedDegree, selectedFileType,
  sortBy, hasDownloadOnly,
  onCategoryChange, onDegreeChange, onFileTypeChange,
  onSortChange, onDownloadOnlyChange,
  onReset, activeFiltersCount, totalFiltered,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-card rounded-xl border border-indigo-100 dark:border-border shadow-sm p-4 sticky top-32 space-y-5">
      {/* رأس الفلتر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
          <Filter className="w-4 h-4" />
          <span>الفلاتر</span>
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
      <div className="text-center py-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
        <span className="text-indigo-700 dark:text-indigo-300 font-bold text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>
          {totalFiltered.toLocaleString()}
        </span>
        <span className="text-gray-500 text-xs mr-1" style={{ fontFamily: "Cairo, sans-serif" }}>رسالة</span>
      </div>

      {/* الترتيب */}
      <FilterSection title="الترتيب">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-sm border border-indigo-200 dark:border-border rounded-lg px-3 py-2 bg-white dark:bg-background text-gray-700 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              }`}
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {deg}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* نوع الملف */}
      <FilterSection title="نوع الملف">
        <div className="flex flex-wrap gap-2">
          {fileTypes.map((ft) => (
            <button
              key={ft}
              onClick={() => onFileTypeChange(ft)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedFileType === ft
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-indigo-200 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              }`}
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              {ft}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* التخصص */}
      <FilterSection title="التخصص">
        <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full text-right text-xs px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              }`}
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {cat}
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
          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
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
        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
