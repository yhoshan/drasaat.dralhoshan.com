/*
 * MobileFilterDrawer — درج الفلتر السفلي للجوال
 */
import { X } from "lucide-react";
import FilterBar from "./FilterBar";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
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

export default function MobileFilterDrawer({
  open, onClose, ...filterProps
}: MobileFilterDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" dir="rtl">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* الدرج */}
      <div className="absolute bottom-0 right-0 left-0 bg-background rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* الرأس */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <h3
            className="text-indigo-700 dark:text-indigo-300 font-semibold"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            الفلاتر
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* محتوى الفلتر */}
        <div className="p-4">
          <FilterBar {...filterProps} />
        </div>

        {/* زر التطبيق */}
        <div className="p-4 border-t border-border sticky bottom-0 bg-background">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            عرض {filterProps.totalFiltered.toLocaleString()} رسالة
          </button>
        </div>
      </div>
    </div>
  );
}
