/*
 * Footer — مكنز الدراسات العليا
 * شريط المشاركة + التذييل الكامل مع جميع النصوص الإلزامية
 */
import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";

const SITE_URL = "https://drasaat.dralhoshan.com";
const CHANNEL_URL = "https://t.me/Arsail2020";
const EMAIL = "yhoshan@gmail.com";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      label: "واتساب",
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent("مكنز الدراسات العليا — أكبر فهرس لرسائل الدكتوراه والماجستير\n" + SITE_URL)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: "تيليجرام",
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent("مكنز الدراسات العليا — أكبر فهرس لرسائل الدكتوراه والماجستير")}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      label: "تويتر",
      color: "bg-gray-900 hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent("مكنز الدراسات العليا — أكبر فهرس لرسائل الدكتوراه والماجستير\n" + SITE_URL)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "فيسبوك",
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="mt-16" dir="rtl">
      {/* شريط المشاركة */}
      <div className="bg-indigo-50 dark:bg-indigo-950 border-t border-indigo-100 dark:border-indigo-900 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="text-indigo-700 dark:text-indigo-300 text-sm font-medium text-center md:text-right"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              ساهم في نشر المكنز{" "}
              <span className="text-gray-500 font-normal">(الدال على الخير كفاعله)</span>
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* نسخ الرابط */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "تم النسخ!" : "نسخ الرابط"}
              </button>
              {/* أزرار المشاركة */}
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 text-xs text-white px-3 py-2 rounded-full transition-colors ${link.color}`}
                  title={link.label}
                >
                  {link.icon}
                  <span className="hidden sm:inline" style={{ fontFamily: "Cairo, sans-serif" }}>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* نموذج الإبلاغ عن الروابط المعطلة */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-t border-amber-100 dark:border-amber-900/30 py-4">
        <div className="container text-center">
          <a
            href={`mailto:${EMAIL}?subject=رابط معطل في مكنز الدراسات العليا&body=أخي الباحث، إذا واجهتك مشكلة في تحميل أي كتاب أو مادة، يرجى كتابة اسم المادة أو الرابط المعطل هنا وسنقوم بمراجعتها وتحديثها فوراً.`}
            className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 hover:text-amber-900 transition-colors"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            <Mail className="w-4 h-4" />
            الإبلاغ عن رابط معطل
          </a>
        </div>
      </div>

      {/* التذييل الرئيسي */}
      <div className="bg-indigo-800 dark:bg-indigo-950 text-white py-10">
        <div className="container">
          {/* الصف الأول: التوقيع + شعار المكانز + الروابط */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-indigo-700 dark:border-indigo-800">
            {/* التوقيع */}
            <a
              href="https://dralhoshan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img
                src="/manus-storage/signature-hoshan-new_f6792fd1.png"
                alt="توقيع د. يوسف الحوشان"
                className="h-12 w-auto object-contain"
                style={{ filter: "invert(1) brightness(2)" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </a>

            {/* شعار المكانز */}
            <a
              href="https://almakanaz.dralhoshan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity group"
              title="منصة المكانز العلمية"
            >
              <img
                src="https://almakanaz.dralhoshan.com/manus-storage/ref-makanez-logo_f06cee65.png"
                alt="شعار المكانز"
                className="h-11 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-xs text-indigo-300" style={{ fontFamily: "Tajawal, sans-serif" }}>
                منصة المكانز العلمية
              </span>
            </a>

            {/* روابط سريعة */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-200 hover:text-white transition-colors"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                📢 قناة المكنز على تيليجرام
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm text-indigo-200 hover:text-white transition-colors"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                ✉️ {EMAIL}
              </a>
              <a
                href="https://nsooos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-200 hover:text-white transition-colors"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                🌐 نصوص تراثية للباحثين
              </a>
            </div>
          </div>

          {/* النصوص الإلزامية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm text-indigo-200" style={{ fontFamily: "Cairo, sans-serif" }}>
            <p>حقوق المواد محفوظة لمؤلفيها وناشريها.</p>
            <p>في حال عدم رغبتكم بنشر ما يخصكم، آمل المراسلة على: {EMAIL}</p>
            <p className="md:col-span-2">
              تم تصنيف هذا الفهرس آلياً وتصحيحه يدوياً بناءً على أسماء الملفات والأوصاف المرفقة بها.
              إذا لم تجد رسالة في قسمها المتوقع، يرجى استخدام شريط البحث العام.
            </p>
            <p className="md:col-span-2">
              هل تبحث في السلاسل التراثية الأخرى؟{" "}
              <a href="https://nsooos.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white underline">
                انتقل لمنصة نصوص تراثية للباحثين
              </a>
            </p>
          </div>

          {/* حقوق النشر */}
          <div className="text-center text-indigo-300 text-sm border-t border-indigo-700 pt-6" style={{ fontFamily: "Tajawal, sans-serif" }}>
            جميع الحقوق محفوظة © 2026 — مكنز الدراسات العليا لخدمة الباحثين. د. يوسف بن حمود الحوشان.
          </div>
        </div>
      </div>
    </footer>
  );
}
