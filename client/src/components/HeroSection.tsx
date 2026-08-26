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

const HERO_BG = "https://zadwarod.dralhoshan.com/manus-storage/hero-bg_dae2a477.jpg";

const ISLAMIC_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.12'%3E%3Cpolygon points='40,5 52,20 68,20 57,32 62,48 40,40 18,48 23,32 12,20 28,20'/%3E%3Cpolygon points='40,15 49,26 62,26 53,35 57,48 40,42 23,48 27,35 18,26 31,26'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`;

export default function HeroSection({ stats, loading, searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Overlay نيلي عميق */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(30,27,75,0.88) 0%, rgba(55,48,163,0.78) 50%, rgba(30,27,75,0.90) 100%)",
        }}
      />

      {/* نمط هندسي إسلامي */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: ISLAMIC_PATTERN, backgroundSize: "80px 80px" }}
      />

      {/* خط ذهبي علوي */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />

      <div className="relative z-10 w-full container py-12 flex flex-col items-center text-center">



        {/* العنوان — خط ثمانية المرجعي مثل مكنز القضاء والأنظمة */}
        <h1
          className="font-bold leading-tight mb-3 drop-shadow-2xl"
          style={{ fontFamily: "Thmanyah Serif Display, serif", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          <span className="block text-2xl sm:text-3xl md:text-5xl text-white">فهرس الرسائل العلمية والبحوث الأكاديمية</span>
          <span className="mt-2 block text-2xl sm:text-3xl md:text-4xl text-white">وكتب المداخل العلمية</span>
        </h1>

        {/* ═══ بطاقات الإحصاءات — فوق البحث — لون موحّد ═══ */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl mb-8" dir="rtl">
          {/* ترتيب عربي ظاهر: إجمالي المواد ← الرسائل ← البحوث ← المداخل */}
          <StatCard
            label="إجمالي المواد"
            value={loading ? "..." : (stats?.total_materials ?? stats?.total_items ?? 0).toLocaleString()}
            sublabel="إجمالي مواد المكنز"
          />
          <StatCard
            label="الرسائل العلمية"
            value={loading ? "..." : (stats?.total_theses ?? ((stats?.total_items || 0) - (stats?.total_research ?? stats?.total_buhooth ?? 0) - (stats?.total_entries || 0))).toLocaleString()}
            sublabel="تتضمن الماجستير والدكتوراه"
            detail={loading ? "" : `ماجستير ${(stats?.total_masters || 0).toLocaleString()} · دكتوراه ${(stats?.total_phd || 0).toLocaleString()}`}
          />
          <StatCard
            label="البحوث"
            value={loading ? "..." : (stats?.total_research ?? stats?.total_buhooth ?? 0).toLocaleString()}
            sublabel="بحوث ترقية وأوراق علمية"
          />
          <StatCard
            label="المداخل"
            value={loading ? "..." : (stats?.total_entries || 0).toLocaleString()}
            sublabel="كتب المداخل العلمية"
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
              className="w-full py-4 pr-5 pl-14 rounded-xl text-gray-800 text-base shadow-2xl focus:outline-none border-2 border-indigo-300/30 focus:border-amber-400/60 transition-all"
              style={{
                fontFamily: "Cairo, sans-serif",
                direction: "rtl",
                background: "rgba(255,255,255,0.97)",
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-6 h-6" />
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

      {/* خط ذهبي سفلي */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
    </section>
  );
}

/* بطاقة إحصاء — لون موحّد شفاف داكن (مثل الصورة المرجعية) */
function StatCard({ label, value, sublabel, detail }: { label: string; value: string; sublabel: string; detail?: string }) {
  return (
    <div
      dir="rtl"
      className="min-w-[148px] rounded-xl px-4 py-3 text-center transition-all hover:scale-105"
      style={{
        background: "rgba(15, 12, 60, 0.55)",
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
        className="text-indigo-100 text-sm mt-1 font-semibold"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        {label}
      </div>
      <div
        className="text-indigo-300/80 text-[11px] mt-0.5 whitespace-nowrap"
        style={{ fontFamily: "Tajawal, sans-serif" }}
      >
        {detail || sublabel}
      </div>
    </div>
  );
}
