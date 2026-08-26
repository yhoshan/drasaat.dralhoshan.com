/*
 * HeroSection — مكنز الدراسات العليا
 * مربعات الإحصاءات: إجمالي المواد، الرسائل العلمية، البحوث، المداخل
 * مبدأ التصميم: إبراز طبقات المحتوى الأكاديمي بوضوح فوق شريط البحث
 */
import { Search } from "lucide-react";
import type { Stats } from "@/pages/Home";

interface HeroSectionProps {
  stats: Stats | null;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function HeroSection({ stats, loading, searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#34BAC6" }}
    >
      <div className="relative z-10 w-full container py-12 flex flex-col items-center text-center">



        {/* العنوان — خط ثمانية المرجعي مثل مكنز القضاء والأنظمة */}
        <h1
          className="font-bold leading-tight mb-3 drop-shadow-2xl"
          style={{ fontFamily: "Thmanyah Serif Display, serif", textShadow: "0 2px 20px rgba(0,0,0,0.18)" }}
        >
          <span className="block text-2xl sm:text-3xl text-white">مكنز</span>
          <span className="block text-2xl sm:text-3xl md:text-5xl text-white">الرسائل العلمية والبحوث الأكاديمية</span>
          <span className="mt-2 block text-2xl sm:text-3xl md:text-4xl text-white">وكتب مداخل العلوم</span>
        </h1>

        {/* ═══ بطاقات الإحصاءات — فوق البحث — لون موحّد ═══ */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl mb-8" dir="rtl">
          {/* ترتيب عربي ظاهر: إجمالي المواد ← الرسائل ← البحوث ← المداخل */}
          <StatCard
            label="إجمالي المواد"
            value={loading ? "..." : (stats?.total_materials ?? stats?.total_items ?? 0).toLocaleString()}
          />
          <StatCard
            label="الرسائل العلمية"
            value={loading ? "..." : (stats?.total_theses ?? ((stats?.total_items || 0) - (stats?.total_research ?? stats?.total_buhooth ?? 0) - (stats?.total_entries || 0))).toLocaleString()}
          />
          <StatCard
            label="البحوث"
            value={loading ? "..." : (stats?.total_research ?? stats?.total_buhooth ?? 0).toLocaleString()}
          />
          <StatCard
            label="المداخل"
            value={loading ? "..." : (stats?.total_entries || 0).toLocaleString()}
          />
        </div>

        {/* ═══ محرك البحث — تحت المربعات ═══ */}
        <div className="w-full max-w-2xl relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث في عناوين الرسائل والتخصصات..."
              className="w-full py-4 pr-5 pl-14 rounded-xl text-gray-800 text-base shadow-2xl focus:outline-none border-2 border-white/40 focus:border-white transition-all"
              style={{
                fontFamily: "Cairo, sans-serif",
                direction: "rtl",
                background: "rgba(255,255,255,0.97)",
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#168590] w-6 h-6" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}

/* بطاقة إحصاء — لون موحّد شفاف داكن (مثل الصورة المرجعية) */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      dir="rtl"
      className="min-w-[148px] rounded-xl px-4 py-3 text-center transition-all hover:scale-105"
      style={{
        background: "rgba(10, 78, 87, 0.72)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="text-white text-2xl font-bold"
        style={{ fontFamily: "Tajawal, sans-serif" }}
      >
        {value}
      </div>
      <div
        className="text-cyan-50 text-sm mt-1 font-semibold"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}
