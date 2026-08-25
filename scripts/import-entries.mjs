/**
 * استيراد كتب المداخل العلمية إلى مكنز الدراسات العليا.
 * فلسفة البيانات: كل مادة تصنّف ضمن رسالة علمية أو بحث أو مدخل؛
 * ثم يعاد بناء items.json وstats.json من مصدر واحد متّسق.
 *
 * الاستخدام:
 *   pnpm import:entries /path/to/entries.xlsx
 *   pnpm import:entries /path/to/entries.json
 *   pnpm import:entries /path/to/entries.csv
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as XLSX from "xlsx";

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "client", "public");
const itemsPath = path.join(publicDir, "items.json");
const statsPath = path.join(publicDir, "stats.json");
const inputPath = process.argv[2];

if (!inputPath) {
  console.error("الاستخدام: pnpm import:entries /المسار/إلى/ملف-المداخل.xlsx");
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`لم يُعثر على الملف: ${inputPath}`);
  process.exit(1);
}

const normalizeArabic = (value = "") => String(value)
  .replace(/[أإآا]/g, "ا")
  .replace(/ة/g, "ه")
  .replace(/ى/g, "ي")
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();

const clean = (value) => value === null || value === undefined ? "" : String(value).trim();
const asBoolean = (value) => [true, 1, "1", "true", "نعم", "yes"].includes(value);

/** يقبل أسماء الأعمدة العربية والإنجليزية الشائعة. */
function field(row, aliases) {
  for (const alias of aliases) {
    const foundKey = Object.keys(row).find((key) => normalizeArabic(key) === normalizeArabic(alias));
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && row[foundKey] !== "") {
      return clean(row[foundKey]);
    }
  }
  return "";
}

function readRows(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".json") {
    const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.books)) {
      return payload.books.map((book) => ({
        title: book.title,
        links: Array.isArray(book.links) ? book.links : [],
        source: "ملف كتب المداخل",
      }));
    }
    return payload.items || payload.data || [];
  }

  const workbook = XLSX.readFile(filePath, { raw: false });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
}

function classify(item) {
  const haystack = normalizeArabic([
    item.degree,
    item.material_type,
    item.category,
    item.title,
  ].join(" "));

  // لا يكفي ورود كلمة «مدخل» في العنوان؛ إذ قد تكون جزءاً من عنوان رسالة أو بحث.
  // تُعد المادة مدخلاً فقط إذا حملت حقلاً معيارياً صريحاً خاصاً بالمداخل.
  if (
    normalizeArabic(item.degree) === "مدخل علمي" ||
    normalizeArabic(item.material_type) === "مدخل" ||
    normalizeArabic(item.category) === "المداخل العلميه"
  ) return "entry";
  if (item.content_group === "research" || /بحث محكم|بحث ترقي|بحث للترقي|ورقه علمي|مقال علمي|دراسه محكم/.test(haystack)) return "research";
  return "thesis";
}

function makeEntry(row, index) {
  const title = field(row, ["العنوان", "عنوان", "title", "اسم الكتاب", "الكتاب"]);
  if (!title) return null;

  const externalLinks = Array.isArray(row.links)
    ? row.links.filter((link) => link && clean(link.url)).map((link) => ({
      url: clean(link.url),
      source: clean(link.source),
      source_name: clean(link.source_name),
      source_type: clean(link.source_type),
      message_id: Number(link.message_id) || undefined,
    }))
    : [];
  const linkTelegram = field(row, ["رابط تيليجرام", "رابط التليجرام", "telegram", "link_telegram"]) || externalLinks[0]?.url || "";
  const linkDrive = field(row, ["رابط جوجل درايف", "رابط درايف", "drive", "link_drive"]);
  const linkDirect = field(row, ["رابط مباشر", "رابط التحميل", "direct", "link_direct", "الرابط"]);
  const sources = [...new Set(externalLinks.map((link) => link.source_name || link.source).filter(Boolean))];

  return {
    id: `entry_${Date.now()}_${index + 1}`,
    title,
    author: field(row, ["المؤلف", "المؤلف / المحقق", "author", "اسم المؤلف"]),
    investigator: field(row, ["المحقق", "investigator"]),
    publisher: field(row, ["الناشر", "publisher"]),
    year: field(row, ["السنة", "سنة النشر", "year"]),
    degree: "مدخل علمي",
    link_telegram: linkTelegram,
    link_drive: linkDrive,
    link_direct: linkDirect,
    source: sources.join(" • ") || field(row, ["المصدر", "source"]) || "ملف المداخل العلمية",
    category: field(row, ["التصنيف", "القسم", "category"]) || "المداخل العلمية",
    material_type: "مدخل",
    file_type: field(row, ["نوع الملف", "file_type"]) || "PDF",
    file_size: field(row, ["حجم الملف", "file_size"]),
    pages_count: field(row, ["عدد الصفحات", "pages_count", "الصفحات"]),
    is_featured: asBoolean(field(row, ["مميز", "is_featured"])),
    download_links_count: externalLinks.length || [linkTelegram, linkDrive, linkDirect].filter(Boolean).length,
    date: field(row, ["التاريخ", "date"]) || new Date().toISOString().slice(0, 10),
    content_group: "entry",
    external_links: externalLinks,
  };
}

function countBy(items, selector) {
  return items.reduce((accumulator, item) => {
    const key = selector(item) || "غير مصنّف";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

function rebuildStats(items) {
  const classified = items.map((item) => ({ ...item, content_group: classify(item) }));
  const theses = classified.filter((item) => item.content_group === "thesis");
  const research = classified.filter((item) => item.content_group === "research");
  const entries = classified.filter((item) => item.content_group === "entry");
  const sumSizes = classified.reduce((sum, item) => {
    const match = clean(item.file_size).match(/([\d.]+)\s*(gb|mb|kb)/i);
    if (!match) return sum;
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    return sum + (unit === "gb" ? amount * 1024 : unit === "mb" ? amount : amount / 1024);
  }, 0);

  return {
    total_items: classified.length,
    total_materials: classified.length,
    total_theses: theses.length,
    total_research: research.length,
    total_entries: entries.length,
    total_phd: classified.filter((item) => normalizeArabic(item.degree) === "دكتوراه").length,
    total_masters: classified.filter((item) => normalizeArabic(item.degree) === "ماجستير").length,
    total_buhooth: research.length,
    total_other: theses.length,
    total_size_mb: Math.round(sumSizes * 10) / 10,
    total_size_gb: Math.round((sumSizes / 1024) * 100) / 100,
    categories: countBy(classified, (item) => item.category),
    degrees: countBy(classified, (item) => item.degree),
    file_types: countBy(classified, (item) => item.file_type),
    featured_count: classified.filter((item) => item.is_featured).length,
    with_download_links: classified.filter((item) => Number(item.download_links_count) > 0).length,
    last_updated: new Date().toISOString().slice(0, 10),
  };
}

const existingItems = JSON.parse(fs.readFileSync(itemsPath, "utf8"));
const incomingRows = readRows(inputPath);
const incomingEntries = incomingRows.map(makeEntry).filter(Boolean);
const seen = new Set(existingItems.map((item) => `${normalizeArabic(item.title)}|${item.link_direct || item.link_drive || item.link_telegram || ""}`));
const freshEntries = incomingEntries.filter((item) => {
  const fingerprint = `${normalizeArabic(item.title)}|${item.link_direct || item.link_drive || item.link_telegram || ""}`;
  if (seen.has(fingerprint)) return false;
  seen.add(fingerprint);
  return true;
});

const mergedItems = [...existingItems, ...freshEntries].map((item) => ({ ...item, content_group: classify(item) }));
const rebuiltStats = rebuildStats(mergedItems);

// يظل ملف البيانات الكبير مضغوطاً لتقليل حجم النشر وسجل التغييرات.
fs.writeFileSync(itemsPath, JSON.stringify(mergedItems));
fs.writeFileSync(statsPath, `${JSON.stringify(rebuiltStats, null, 2)}\n`);

console.log(`تم استيراد ${freshEntries.length.toLocaleString("en-US")} مدخل جديد من أصل ${incomingRows.length.toLocaleString("en-US")} صف.`);
console.log(`الإجمالي: ${rebuiltStats.total_materials.toLocaleString("en-US")} مادة | ${rebuiltStats.total_theses.toLocaleString("en-US")} رسالة | ${rebuiltStats.total_research.toLocaleString("en-US")} بحث | ${rebuiltStats.total_entries.toLocaleString("en-US")} مدخل.`);
