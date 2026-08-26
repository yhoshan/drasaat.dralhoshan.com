import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const itemsPath = path.join(projectRoot, "client", "public", "items.json");
const reportPath = "/home/ubuntu/title-cleanup-report.json";
const shouldApply = process.argv.includes("--apply");
const inspectTerm = process.argv.find((arg) => arg.startsWith("--inspect="))?.split("=")[1];

function cleanItem(item) {
  const originalItem = item;
  const original = String(item.title || "").trim();
  let title = original;
  let author = String(item.author || "").trim();
  let publisher = String(item.publisher || "").trim();
  const changes = [];

  const authorMatch = title.match(/(?:^|\n)\s*(?:(?:اسم\s+)?(?:الباحث|الطالب)(?:ة)?|المؤلف)\s*:\s*([^\n]+)/u);
  if (!author && authorMatch?.[1]?.trim()) {
    author = authorMatch[1].trim().replace(/[.،؛\s]+$/u, "");
    changes.push("نقل اسم الباحث إلى الحقل المخصص");
  }

  const publisherMatch = title.match(/(?:^|\n)\s*الناشر\s*:\s*([^\n]+)/u);
  if ((!publisher || publisher === "جامعة الرسائل العلمية") && publisherMatch?.[1]?.trim()) {
    publisher = publisherMatch[1].trim().replace(/[.،؛\s]+$/u, "");
    changes.push("نقل اسم الناشر إلى الحقل المخصص");
  }

  const metadataStart = title.search(/\n\s*(?:(?:اسم\s+)?(?:الباحث|الطالب)(?:ة)?|المشرف|تاريخ\s+(?:المناقشة|النشر)|الناشر|الجامعة|المؤلف|السنة(?:\s+الجامعية)?)\s*:|\s+(?:الباحث|الطالب)(?:ة)?\s*:/u);
  if (metadataStart > -1) {
    title = title.slice(0, metadataStart);
    changes.push("فصل الحقول الببليوغرافية الملحقة");
  }

  const replaceOnce = (pattern, replacement, reason) => {
    const next = title.replace(pattern, replacement);
    if (next !== title) {
      title = next;
      changes.push(reason);
    }
  };

  replaceOnce(/^\s*(?:عنوان\s+الرسالة|اسم\s+الكتاب|العنوان)\s*:\s*/u, "", "بادئة حقل العنوان");
  replaceOnce(/^\s*noor\s*book\s*\.?\s*com\b\s*[-–—|:]*\s*/i, "", "بادئة Noor Book com");
  replaceOnce(/^\s*book\s+(?=[\u0600-\u06FF])/i, "", "بادئة Book الإنجليزية");
  replaceOnce(/\s*\[\d{5,}\]\s*(?:---|—)\s*.*?(?:\(مؤلف\))?\s*$/u, "", "معرّف منصة وملحق المؤلف");
  replaceOnce(/\s+(?:ktaab\.com|noor[\s-]*book(?:\.com)?)\s*$/i, "", "نطاق موقع في نهاية العنوان");
  if (changes.includes("فصل الحقول الببليوغرافية الملحقة")) {
    replaceOnce(/[\s,،؛.\-–—]+(?:ماجستير|دكتوراه)\s*[.،؛\-–—]*\s*$/u, "", "درجة علمية ملحقة");
  }

  if (changes.length > 0) {
    title = title.replace(/\s+/g, " ").trim().replace(/[\s,،؛]+$/u, "");
  }

  return {
    original,
    title,
    changes,
    item: { ...originalItem, title: title || original, author, publisher },
  };
}

/*
 * نسخة احتياطية مبسطة من المنظف الأول؛ أبقيت هنا فقط لتوثيق قواعده الأساسية.
 */
function legacyCleanTitle(value) {
  const original = String(value || "").trim();
  let title = original;
  const changes = [];

  const replaceOnce = (pattern, replacement, reason) => {
    const next = title.replace(pattern, replacement);
    if (next !== title) {
      title = next;
      changes.push(reason);
    }
  };

  // أسماء مواقع واضحة في بداية العنوان، لا تمس الكلمات الدالة داخل عنوان أكاديمي.
  replaceOnce(/^\s*noor\s*book\s*\.?\s*com\b\s*[-–—|:]*\s*/i, "", "بادئة Noor Book com");
  replaceOnce(/^\s*book\s+(?=[\u0600-\u06FF])/i, "", "بادئة Book الإنجليزية");

  // معرّفات المنصة وعبارة المؤلف الملحقة باسم الملف.
  replaceOnce(/\s*\[\d{5,}\]\s*(?:---|—)\s*.*?(?:\(مؤلف\))?\s*$/u, "", "معرّف منصة وملحق المؤلف");

  // نطاقات مواقع ظاهرة في نهاية الاسم، دون حذف نطاق وارد داخل عنوان بحثي.
  replaceOnce(/\s+(?:ktaab\.com|noor[\s-]*book(?:\.com)?)\s*$/i, "", "نطاق موقع في نهاية العنوان");

  // لا تُسوّى المسافات أو علامات الترقيم في العناوين السليمة؛
  // يقتصر التنظيف على الحالات التي طابقت ضجيجاً معروفاً أعلاه.
  if (changes.length > 0) {
    title = title.replace(/\s+/g, " ").trim();
  }
  return { original, title, changes };
}

const items = JSON.parse(fs.readFileSync(itemsPath, "utf8"));

if (inspectTerm) {
  const normalized = inspectTerm.toLowerCase();
  const matches = items.filter((item) => String(item.title || "").toLowerCase().includes(normalized));
  console.log(JSON.stringify(matches.slice(0, 10), null, 2));
  process.exit(0);
}

const changed = [];
const cleanedItems = items.map((item) => {
  const result = cleanItem(item);
  if (result.title && result.title !== result.original) {
    changed.push({ id: item.id, before: result.original, after: result.title, rules: result.changes, author: result.item.author, source: item.source });
    return result.item;
  }
  return item;
});

const summary = {
  analyzed_at: new Date().toISOString(),
  total_items: items.length,
  changed_count: changed.length,
  sample: changed.slice(0, 50),
};

fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));

if (shouldApply) {
  fs.writeFileSync(itemsPath, JSON.stringify(cleanedItems));
}

console.log(JSON.stringify({ ...summary, applied: shouldApply, report: reportPath }, null, 2));
