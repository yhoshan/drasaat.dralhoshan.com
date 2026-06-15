/*
 * Navbar — مكنز الدراسات العليا
 * صورة التوقيع يميناً، زر إخلاء المسؤولية + زر الوضع الليلي يساراً
 */
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, ShieldAlert, X } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
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

            {/* الأزرار — يسار */}
            <div className="flex items-center gap-2">
              {/* أيقونة إخلاء المسؤولية */}
              <button
                onClick={() => setShowDisclaimer(true)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all hover:scale-105 group"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
                title="إخلاء المسؤولية"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300 group-hover:text-amber-200 transition-colors" />
                <span
                  className="text-amber-200 group-hover:text-white transition-colors leading-none"
                  style={{ fontFamily: "Cairo, sans-serif", fontSize: "9px", whiteSpace: "nowrap" }}
                >
                  إخلاء المسؤولية
                </span>
              </button>

              {/* زر الوضع الليلي */}
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
        </div>
      </nav>

      {/* نافذة إخلاء المسؤولية */}
      {showDisclaimer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDisclaimer(false); }}
          dir="rtl"
        >
          <div
            className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1e1b4b 0%, #2d2a6e 100%)",
              border: "1px solid rgba(167,139,250,0.35)",
            }}
          >
            {/* شريط ذهبي علوي */}
            <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 opacity-80" />

            {/* رأس النافذة */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
                >
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                </div>
                <h2
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  إخلاء المسؤولية
                </h2>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* فاصل */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

            {/* نص إخلاء المسؤولية */}
            <div className="px-6 py-5">
              <p
                className="leading-relaxed text-indigo-100"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  fontSize: "14.5px",
                  lineHeight: "2",
                  textAlign: "justify",
                }}
              >
                هذا المكنز فهرسٌ تجميعيٌّ للروابط والإحالات إلى مواد منشورة في مصادر خارجية، أُعدّ لتيسير الوصول وخدمة الباحثين، ولا يدّعي ملكية المواد ولا يضمن محتواها أو دقتها أو بقاء روابطها. تبقى الحقوق لأصحابها، ويتحمل المستخدم مسؤولية التحقق من المادة وحقوق استخدامها، ومن له حق أو ملاحظة فليستخدم حقل الإبلاغ المخصص للحذف أو التعديل.
              </p>
            </div>

            {/* تذييل النافذة */}
            <div
              className="px-6 py-4 flex justify-end"
              style={{ background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(167,139,250,0.15)" }}
            >
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
