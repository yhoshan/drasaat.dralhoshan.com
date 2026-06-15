/*
 * Navbar — مكنز الدراسات العليا
 * صورة التوقيع يميناً (بدل النص)، العنوان وسطاً، زر الوضع الليلي يساراً
 */
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #1e1b4b 100%)",
        borderBottom: "1px solid rgba(167,139,250,0.2)",
      }}
      dir="rtl"
    >
      {/* خط ذهبي علوي */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50 absolute top-0 left-0 right-0" />

      <div className="container">
        <div className="flex items-center justify-between h-16">

          {/* التوقيع — يمين */}
          <a
            href="https://nsooos.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center opacity-90 hover:opacity-100 transition-opacity"
            title="د. يوسف بن حمود الحوشان"
          >
            <img
              src="/manus-storage/signature-hoshan-v3_499af48a.webp"
              alt="توقيع د. يوسف الحوشان"
              className="h-10 w-auto object-contain"
              style={{ filter: "invert(1) brightness(2)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </a>

          {/* العنوان المركزي */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400/60 text-xs">◆</span>
              <h1
                className="text-white font-bold text-lg leading-none"
                style={{ fontFamily: "Amiri, serif" }}
              >
                مكنز الدراسات العليا
              </h1>
              <span className="text-amber-400/60 text-xs">◆</span>
            </div>
            <span
              className="text-indigo-300 text-xs tracking-wide"
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              جامعة الرسائل العلمية
            </span>
          </div>

          {/* زر الوضع الليلي — يسار */}
          <button
            onClick={() => toggleTheme?.()}
            className="p-2 rounded-full transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
          >
            {isDark
              ? <Sun className="w-5 h-5 text-amber-300" />
              : <Moon className="w-5 h-5 text-indigo-200" />
            }
          </button>
        </div>
      </div>
    </nav>
  );
}
