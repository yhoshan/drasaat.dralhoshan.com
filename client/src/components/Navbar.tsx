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
            href="https://dralhoshan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center opacity-90 hover:opacity-100 transition-opacity"
            title="د. يوسف بن حمود الحوشان"
          >
            <img
              src="/manus-storage/signature-hoshan-new_f6792fd1.png"
              alt="توقيع د. يوسف الحوشان"
              className="h-10 w-auto object-contain"
              style={{ filter: "invert(1) brightness(2)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </a>

          {/* فراغ مركزي */}
          <div />

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
