/*
 * Navbar — مكنز الدراسات العليا
 * زر "حول المكنز" يميناً، زر الوضع الليلي يساراً
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
          background: "#34BAC6",
          borderBottom: "1px solid rgba(255,255,255,0.32)",
        }}
        dir="rtl"
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* إخلاء المسؤولية — يمين (بدل التوقيع) */}
            <button
              onClick={() => setShowDisclaimer(true)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all hover:scale-105 group"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
              title="حول المكنز"
            >
              <ShieldAlert className="w-4 h-4 text-white transition-colors" />
              <span
                className="text-white transition-colors leading-none"
                style={{ fontFamily: "Cairo, sans-serif", fontSize: "9px", whiteSpace: "nowrap" }}
              >
                حول المكنز
              </span>
            </button>

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
                ? <Sun className="w-5 h-5 text-white" />
                : <Moon className="w-5 h-5 text-white" />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* نافذة حول المكنز */}
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
              background: "#0C5660",
              border: "1px solid rgba(52,186,198,0.62)",
            }}
          >
            <div className="h-1 bg-[#34BAC6]" />

            {/* رأس النافذة */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: "rgba(52,186,198,0.18)", border: "1px solid rgba(52,186,198,0.48)" }}
                >
                  <ShieldAlert className="w-5 h-5 text-[#A9F3F5]" />
                </div>
                <h2
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  حول المكنز
                </h2>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-1.5 rounded-lg text-cyan-100 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* فاصل */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />

            {/* نص إخلاء المسؤولية */}
            <div className="px-6 py-5">
              <p
                className="leading-relaxed text-cyan-50"
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
              style={{ background: "rgba(0,0,0,0.16)", borderTop: "1px solid rgba(52,186,198,0.28)" }}
            >
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "#34BAC6",
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
