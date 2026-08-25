/*
 * مكنز الدراسات العليا — الصفحة الرئيسية
 * الألوان: نيلي فاتح (Indigo) على خلفيات بيضاء/كريمية
 * الخطوط: Amiri للعناوين، Cairo للنصوص، Tajawal للتفاصيل
 */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import ItemsGrid from "@/components/ItemsGrid";
import Footer from "@/components/Footer";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";

export interface ThesisItem {
  id: string;
  title: string;
  author: string;
  investigator: string;
  publisher: string;
  year: string;
  degree: string;
  link_telegram: string;
  link_drive: string;
  link_direct: string;
  source: string;
  category: string;
  material_type: string;
  file_type: string;
  file_size: string;
  pages_count: string;
  is_featured: boolean;
  download_links_count: number;
  date: string;
  content_group?: "thesis" | "research" | "entry";
  external_links?: Array<{
    url: string;
    source?: string;
    source_name?: string;
    source_type?: string;
    message_id?: number;
  }>;
}

export interface Stats {
  total_items: number;
  total_materials?: number;
  total_size_gb: number;
  total_size_mb: number;
  total_buhooth: number;
  total_research?: number;
  total_theses?: number;
  total_entries?: number;
  total_masters: number;
  total_phd: number;
  degrees: Record<string, number>;
  categories: Record<string, number>;
  file_types: Record<string, number>;
  featured_count: number;
  with_download_links: number;
}

// تطبيع الهمزات للبحث
function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const PAGE_SIZE = 24;

export default function Home() {
  const [allItems, setAllItems] = useState<ThesisItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedDegree, setSelectedDegree] = useState("الكل");
  const [selectedFileType, setSelectedFileType] = useState("الكل");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hasDownloadOnly, setHasDownloadOnly] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // تحميل البيانات
  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          fetch("/items.json"),
          fetch("/stats.json"),
        ]);
        const items = await itemsRes.json();
        const statsData = await statsRes.json();
        setAllItems(items);
        setStats(statsData);
      } catch (err) {
        console.error("خطأ في تحميل البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // التصفية والبحث
  const filteredItems = useMemo(() => {
    let result = [...allItems];
    const q = normalizeArabic(searchQuery);

    if (q.length > 1) {
      result = result.filter((item) =>
        normalizeArabic(item.title).includes(q) ||
        normalizeArabic(item.category).includes(q) ||
        normalizeArabic(item.author).includes(q) ||
        normalizeArabic(item.degree).includes(q)
      );
    }

    if (selectedCategory !== "الكل") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (selectedDegree !== "الكل") {
      result = result.filter((item) => item.degree === selectedDegree);
    }

    if (selectedFileType !== "الكل") {
      result = result.filter((item) => item.file_type === selectedFileType);
    }

    if (hasDownloadOnly) {
      result = result.filter((item) => item.download_links_count > 0);
    }

    // الترتيب
    switch (sortBy) {
      case "alpha":
        result.sort((a, b) => a.title.localeCompare(b.title, "ar"));
        break;
      case "newest":
        result.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        break;
      case "oldest":
        result.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category, "ar"));
        break;
      case "featured":
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [allItems, searchQuery, selectedCategory, selectedDegree, selectedFileType, sortBy, hasDownloadOnly]);

  // إعادة ضبط الصفحة عند تغيير الفلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDegree, selectedFileType, sortBy, hasDownloadOnly]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // الأقسام والدرجات للفلتر
  const categories = useMemo(() => {
    const cats = Object.keys(stats?.categories || {});
    return ["الكل", ...cats];
  }, [stats]);

  const degrees = useMemo(() => {
    const degs = Object.keys(stats?.degrees || {});
    return ["الكل", ...degs];
  }, [stats]);

  const fileTypes = useMemo(() => {
    const fts = Object.keys(stats?.file_types || {});
    return ["الكل", ...fts];
  }, [stats]);

  const activeFiltersCount = [
    selectedCategory !== "الكل",
    selectedDegree !== "الكل",
    selectedFileType !== "الكل",
    hasDownloadOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCategory("الكل");
    setSelectedDegree("الكل");
    setSelectedFileType("الكل");
    setHasDownloadOnly(false);
    setSortBy("default");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <HeroSection
        stats={stats}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* شريط التصفية السريعة للأقسام */}
      <div className="bg-white dark:bg-card border-b border-border sticky top-16 z-30 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 12).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-indigo-700 text-white shadow-sm"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                }`}
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container py-8" ref={resultsRef}>
        <div className="flex gap-6">
          {/* شريط الفلتر الجانبي — شاشات كبيرة */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterBar
              categories={categories}
              degrees={degrees}
              fileTypes={fileTypes}
              selectedCategory={selectedCategory}
              selectedDegree={selectedDegree}
              selectedFileType={selectedFileType}
              sortBy={sortBy}
              hasDownloadOnly={hasDownloadOnly}
              onCategoryChange={setSelectedCategory}
              onDegreeChange={setSelectedDegree}
              onFileTypeChange={setSelectedFileType}
              onSortChange={setSortBy}
              onDownloadOnlyChange={setHasDownloadOnly}
              onReset={resetFilters}
              activeFiltersCount={activeFiltersCount}
              totalFiltered={filteredItems.length}
            />
          </aside>

          {/* شبكة النتائج */}
          <main className="flex-1 min-w-0">
            {/* رأس النتائج */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-indigo-700 dark:text-indigo-300 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {loading ? "جاري التحميل..." : `${filteredItems.length.toLocaleString()} مادة`}
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    مسح الفلاتر ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* زر الفلتر على الجوال */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                فلتر {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            <ItemsGrid
              items={paginatedItems}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              onPageChange={handlePageChange}
              pageSize={PAGE_SIZE}
            />
          </main>
        </div>
      </div>

      {/* درج الفلتر على الجوال */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        categories={categories}
        degrees={degrees}
        fileTypes={fileTypes}
        selectedCategory={selectedCategory}
        selectedDegree={selectedDegree}
        selectedFileType={selectedFileType}
        sortBy={sortBy}
        hasDownloadOnly={hasDownloadOnly}
        onCategoryChange={setSelectedCategory}
        onDegreeChange={setSelectedDegree}
        onFileTypeChange={setSelectedFileType}
        onSortChange={setSortBy}
        onDownloadOnlyChange={setHasDownloadOnly}
        onReset={resetFilters}
        activeFiltersCount={activeFiltersCount}
        totalFiltered={filteredItems.length}
      />

      <Footer />
    </div>
  );
}
