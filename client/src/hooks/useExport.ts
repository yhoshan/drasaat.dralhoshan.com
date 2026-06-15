/*
 * useExport — تصدير نتائج البحث كـ Excel أو PDF
 * مكنز الدراسات العليا
 */
import { useCallback } from "react";
import type { ThesisItem } from "@/pages/Home";

export function useExport() {
  const exportToExcel = useCallback(async (items: ThesisItem[], filename = "مكنز-الدراسات-العليا") => {
    try {
      const XLSX = await import("xlsx");
      
      const rows = items.map((item, idx) => ({
        "#": idx + 1,
        "العنوان": item.title,
        "الدرجة العلمية": item.degree || "",
        "التخصص": item.category || "",
        "نوع الملف": item.file_type || "",
        "حجم الملف": item.file_size || "",
        "المؤلف / الباحث": item.author || "",
        "المصدر": item.source || "",
        "رابط تيليجرام": item.link_telegram || "",
        "رابط تحميل": item.link_direct || "",
      }));

      const ws = XLSX.utils.json_to_sheet(rows, { header: ["#", "العنوان", "الدرجة العلمية", "التخصص", "نوع الملف", "حجم الملف", "المؤلف / الباحث", "المصدر", "رابط تيليجرام", "رابط تحميل"] });
      
      // ضبط عرض الأعمدة
      ws["!cols"] = [
        { wch: 5 },   // #
        { wch: 60 },  // العنوان
        { wch: 15 },  // الدرجة
        { wch: 25 },  // التخصص
        { wch: 10 },  // نوع الملف
        { wch: 12 },  // الحجم
        { wch: 30 },  // المؤلف
        { wch: 30 },  // المصدر
        { wch: 40 },  // رابط تيليجرام
        { wch: 40 },  // رابط تحميل
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "الفهرس");
      
      // إضافة ورقة إحصاءات
      const statsRows = [
        { "البيان": "إجمالي النتائج", "القيمة": items.length },
        { "البيان": "رسائل دكتوراه", "القيمة": items.filter(i => i.degree === "دكتوراه").length },
        { "البيان": "رسائل ماجستير", "القيمة": items.filter(i => i.degree === "ماجستير").length },
        { "البيان": "بحوث محكمة", "القيمة": items.filter(i => i.degree === "بحث محكم").length },
        { "البيان": "تاريخ التصدير", "القيمة": new Date().toLocaleDateString("ar-SA") },
        { "البيان": "المصدر", "القيمة": "مكنز الدراسات العليا — د. يوسف بن حمود الحوشان" },
      ];
      const wsStats = XLSX.utils.json_to_sheet(statsRows);
      wsStats["!cols"] = [{ wch: 20 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, wsStats, "إحصاءات");

      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error("خطأ في تصدير Excel:", error);
      alert("حدث خطأ أثناء تصدير الملف");
    }
  }, []);

  const exportToPDF = useCallback((items: ThesisItem[], filename = "مكنز-الدراسات-العليا") => {
    try {
      // إنشاء نافذة طباعة مع تنسيق جميل
      const printWindow = window.open("", "_blank", "width=1000,height=700");
      if (!printWindow) {
        alert("يرجى السماح بفتح النوافذ المنبثقة");
        return;
      }

      const rows = items.map((item, idx) => `
        <tr>
          <td style="text-align:center;color:#6366f1;font-family:monospace">${idx + 1}</td>
          <td style="font-family:'Amiri',serif;font-size:13px;line-height:1.6">${item.title}</td>
          <td style="text-align:center">${item.degree || ""}</td>
          <td style="text-align:center;font-size:11px">${item.category || ""}</td>
          <td style="text-align:center;color:#dc2626;font-weight:bold">${item.file_type || ""}</td>
          <td style="text-align:center;font-size:11px">${item.author || ""}</td>
        </tr>
      `).join("");

      const html = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>مكنز الدراسات العليا — فهرس الرسائل العلمية</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Cairo', sans-serif; direction: rtl; background: #fff; color: #1e1b4b; }
            .header { background: linear-gradient(135deg, #1e1b4b, #3730a3); color: white; padding: 24px 32px; margin-bottom: 20px; }
            .header h1 { font-family: 'Amiri', serif; font-size: 28px; margin-bottom: 6px; }
            .header p { font-size: 13px; opacity: 0.8; }
            .stats { display: flex; gap: 16px; padding: 12px 32px; background: #f0f0ff; margin-bottom: 16px; }
            .stat { text-align: center; }
            .stat-val { font-size: 20px; font-weight: bold; color: #3730a3; }
            .stat-lbl { font-size: 11px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #1e1b4b; color: white; padding: 8px 10px; font-family: 'Cairo', sans-serif; font-size: 12px; }
            td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
            tr:nth-child(even) { background: #f8f8ff; }
            .footer { margin-top: 20px; padding: 12px 32px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
            @media print {
              .no-print { display: none; }
              body { font-size: 11px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>مكنز الدراسات العليا</h1>
            <p>فهرس الرسائل العلمية والبحوث — د. يوسف بن حمود الحوشان</p>
          </div>
          <div class="stats">
            <div class="stat"><div class="stat-val">${items.length.toLocaleString()}</div><div class="stat-lbl">إجمالي النتائج</div></div>
            <div class="stat"><div class="stat-val">${items.filter(i => i.degree === "دكتوراه").length.toLocaleString()}</div><div class="stat-lbl">دكتوراه</div></div>
            <div class="stat"><div class="stat-val">${items.filter(i => i.degree === "ماجستير").length.toLocaleString()}</div><div class="stat-lbl">ماجستير</div></div>
            <div class="stat"><div class="stat-val">${items.filter(i => i.degree === "بحث محكم").length.toLocaleString()}</div><div class="stat-lbl">بحوث محكمة</div></div>
          </div>
          <div style="padding: 0 16px;">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>العنوان</th>
                  <th>الدرجة</th>
                  <th>التخصص</th>
                  <th>الملف</th>
                  <th>المؤلف</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          <div class="footer">
            تم التصدير بتاريخ ${new Date().toLocaleDateString("ar-SA")} — مكنز الدراسات العليا
          </div>
          <div class="no-print" style="text-align:center;padding:16px">
            <button onclick="window.print()" style="background:#3730a3;color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:'Cairo',sans-serif;font-size:14px">
              طباعة / حفظ PDF
            </button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      console.error("خطأ في تصدير PDF:", error);
    }
  }, []);

  return { exportToExcel, exportToPDF };
}
