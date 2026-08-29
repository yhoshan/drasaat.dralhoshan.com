/*
 * ItemsGrid — شبكة بطاقات الرسائل العلمية
 * طابع أرشيفي أكاديمي: نيلي فاتح، شارات الدرجات، حدود نيلية علوية
 */
import { useState } from "react";
import type { ThesisItem } from "@/pages/Home";
import { ExternalLink, Download, Copy, Check } from "lucide-react";

interface ItemsGridProps {
  items: ThesisItem[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number | null;
  onPageChange: (page: number) => void;
  pageSize: number;
}

export default function ItemsGrid({
  items, loading, currentPage, totalPages, totalItems, onPageChange, pageSize,
}: ItemsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl h-52" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4 opacity-40">🔍</div>
        <p className="text-gray-500 text-lg" style={{ fontFamily: "Cairo, sans-serif" }}>
          لا توجد نتائج مطابقة لبحثك
        </p>
        <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          جرّب تغيير كلمات البحث أو الفلاتر
        </p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {items.map((item, idx) => (
          <ThesisCard
            key={item.id}
            item={item}
            index={startIndex + idx + 1}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          pageItemCount={items.length}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

// ==============================
// بطاقة رسالة علمية — طابع أرشيفي
// ==============================
function ThesisCard({ item, index }: { item: ThesisItem; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.link_telegram || item.link_direct || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ألوان شارات الدرجات
  const degreeConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
    "دكتوراه": {
      bg: "rgba(180,83,9,0.1)",
      text: "#92400e",
      border: "rgba(180,83,9,0.3)",
      label: "دكتوراه",
    },
    "ماجستير": {
      bg: "rgba(52,186,198,0.12)",
      text: "#0e7d88",
      border: "rgba(52,186,198,0.32)",
      label: "ماجستير",
    },
    "بكالوريوس": {
      bg: "rgba(5,150,105,0.08)",
      text: "#065f46",
      border: "rgba(5,150,105,0.25)",
      label: "بكالوريوس",
    },
    "رسالة علمية": {
      bg: "rgba(52,186,198,0.10)",
      text: "#0d6772",
      border: "rgba(52,186,198,0.28)",
      label: "رسالة",
    },
    "بحث محكم": {
      bg: "rgba(14,116,144,0.08)",
      text: "#0e7490",
      border: "rgba(14,116,144,0.25)",
      label: "بحث محكم",
    },
  };

  const deg = degreeConfig[item.degree] || degreeConfig["رسالة علمية"];

  // لون نوع الملف
  const fileTypeColors: Record<string, string> = {
    "PDF": "#dc2626",
    "RAR": "#d97706",
    "ZIP": "#d97706",
    "Word": "#2563eb",
    "PowerPoint": "#ea580c",
  };
  const ftColor = fileTypeColors[item.file_type] || "#6b7280";

  // لون الحد العلوي حسب الدرجة
  const topBorderColor = {
    "دكتوراه": "#b45309",
    "ماجستير": "#0e97a4",
    "بكالوريوس": "#059669",
    "رسالة علمية": "#34bac6",
    "بحث محكم": "#0e7490",
  }[item.degree] || "#34bac6";

  return (
    <div
      className="bg-white dark:bg-card rounded-xl shadow-sm border border-teal-100 dark:border-border p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1"
      style={{
        borderTop: `3px solid ${topBorderColor}`,
        boxShadow: "0 1px 4px rgba(14,125,136,0.10)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(14,125,136,0.18)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 1px 4px rgba(14,125,136,0.10)`;
      }}
    >
      {/* الرأس: رقم + شارات */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs text-teal-400 dark:text-teal-300 font-mono"
          style={{ fontFamily: "Tajawal, sans-serif" }}
        >
          #{index.toLocaleString()}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* شارة الدرجة */}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: deg.bg,
              color: deg.text,
              border: `1px solid ${deg.border}`,
              fontFamily: "Cairo, sans-serif",
            }}
          >
            {deg.label}
          </span>
          {/* نوع الملف */}
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              color: ftColor,
              background: `${ftColor}14`,
              fontFamily: "Tajawal, sans-serif",
            }}
          >
            {item.file_type}
          </span>
        </div>
      </div>

      {/* عنوان الرسالة */}
      <h3
        className="text-gray-800 dark:text-gray-100 font-semibold leading-relaxed line-clamp-3 flex-1"
        style={{ fontFamily: "Amiri, serif", fontSize: "1.05rem" }}
      >
        {item.title}
      </h3>

      {/* بيانات فهرسية */}
      <div className="space-y-1 text-xs" style={{ fontFamily: "Cairo, sans-serif" }}>
        {item.category && item.category !== "دراسات متنوعة" && (
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
            <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0" />
            {item.category}
          </div>
        )}
        {item.file_size && (
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
            <span style={{ fontFamily: "Tajawal, sans-serif" }}>{item.file_size}</span>
          </div>
        )}
      </div>

      {/* أزرار الإجراءات */}
      <div
        className="flex items-center gap-2 pt-2"
        style={{ borderTop: "1px solid rgba(52,186,198,0.24)" }}
      >
        {item.link_telegram && (
          <a
            href={item.link_telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex-1 justify-center"
            style={{
              background: "linear-gradient(135deg, #168590, #34BAC6)",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            تيليجرام
          </a>
        )}
        {item.link_direct && (
          <a
            href={item.link_direct}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-white px-2.5 py-1.5 rounded-lg transition-all hover:scale-105"
            style={{ background: "#059669" }}
            title="تحميل مباشر"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-700 px-2 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors"
          title="نسخ الرابط"
        >
          {copied
            ? <Check className="w-3.5 h-3.5 text-green-500" />
            : <Copy className="w-3.5 h-3.5" />
          }
        </button>
      </div>
    </div>
  );
}

// ==============================
// ترقيم الصفحات
// ==============================
function Pagination({ currentPage, totalPages, totalItems, pageSize, pageItemCount, onPageChange }: {
  currentPage: number;
  totalPages: number;
  totalItems: number | null;
  pageSize: number;
  pageItemCount: number;
  onPageChange: (page: number) => void;
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = totalItems === null
    ? start + Math.max(pageItemCount - 1, 0)
    : Math.min(currentPage * pageSize, totalItems);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 border-t border-teal-100 dark:border-border mt-4">
      <p
        className="text-sm text-gray-500"
        style={{ fontFamily: "Tajawal, sans-serif" }}
      >
        {totalItems === null
          ? `عرض ${start.toLocaleString()} – ${end.toLocaleString()} من النتائج المتاحة`
          : `عرض ${start.toLocaleString()} – ${end.toLocaleString()} من ${totalItems.toLocaleString()} رسالة`}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-teal-200 text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors text-sm"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          ‹ السابق
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`e-${idx}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? "text-white shadow-sm scale-110"
                  : "border border-teal-200 text-teal-700 hover:bg-teal-50"
              }`}
              style={{
                fontFamily: "Tajawal, sans-serif",
                background: currentPage === page
                  ? "linear-gradient(135deg, #168590, #34BAC6)"
                  : undefined,
              }}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-teal-200 text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors text-sm"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          التالي ›
        </button>
      </div>
    </div>
  );
}
