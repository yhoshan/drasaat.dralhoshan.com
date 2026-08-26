/*
 * Home — مكنز الدراسات العليا
 * مبدأ البيانات: تحميل الإحصاءات الصغيرة مستقلاً كي تظهر العدادات فوراً،
 * ثم تحميل قاعدة المواد الكبيرة للبحث والتصفية والبطاقات.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedDegree, setSelectedDegree] = useState("الكل");
  const [selectedSource, setSelectedSource] = useState("الكل");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hasDownloadOnly, setHasDownloadOnly] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        // قيمة صغيرة تُجلب بعنوان جديد لتفادي بقاء إحصاءات قديمة في الكاش.
        const response = await fetch(`/stats.json?updated=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`تعذر تحميل الإحصاءات (${response.status})`);
        const data = (await response.json()) as Stats;
        if (!cancelled) setStats(data);
      } catch (error) {
        console.error("خطأ في تحميل الإحصاءات:", error);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    const loadItems = async () => {
      try {
        const response = await fetch("/items.json");
        if (!response.ok) throw new Error(`تعذر تحميل المواد (${response.status})`);
        const data = (await response.json()) as ThesisItem[];
        if (!cancelled) setAllItems(data);
      } catch (error) {
        console.error("خطأ في تحميل المواد:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadStats();
    void loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...allItems];
    const query = normalizeArabic(searchQuery);

    if (query.length > 1) {
      result = result.filter((item) =>
        normalizeArabic(item.title).includes(query) ||
        normalizeArabic(item.category).includes(query) ||
        normalizeArabic(item.author).includes(query) ||
        normalizeArabic(item.degree).includes(query)
      );
    }

    if (selectedCategory !== "الكل") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (selectedDegree !== "الكل") {
      result = result.filter((item) => item.degree === selectedDegree);
    }

    if (selectedSource !== "الكل") {
      result = result.filter((item) =>
        item.source === selectedSource ||
        item.source.split(" • ").includes(selectedSource) ||
        item.external_links?.some((link) => (link.source_name || link.source) === selectedSource)
      );
    }

    if (hasDownloadOnly) {
      result = result.filter((item) => item.download_links_count > 0);
    }

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
        result.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        break;
    }

    return result;
  }, [allItems, searchQuery, selectedCategory, selectedDegree, selectedSource, sortBy, hasDownloadOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDegree, selectedSource, sortBy, hasDownloadOnly]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const categories = useMemo(() => ["الكل", ...Object.keys(stats?.categories || {})], [stats]);
  const degrees = useMemo(() => ["الكل", ...Object.keys(stats?.degrees || {})], [stats]);

  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    allItems.forEach((item) => {
      const itemSources = [
        ...item.source.split(" • "),
        ...(item.external_links?.map((link) => link.source_name || link.source || "") || []),
      ].filter(Boolean);
      Array.from(new Set(itemSources)).forEach((source) => {
        counts.set(source, (counts.get(source) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ar"))
      .map(([source]) => source);
  }, [allItems]);

  const activeFiltersCount = [
    selectedCategory !== "الكل",
    selectedDegree !== "الكل",
    selectedSource !== "الكل",
    hasDownloadOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCategory("الكل");
    setSelectedDegree("الكل");
    setSelectedSource("الكل");
    setHasDownloadOnly(false);
    setSortBy("default");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <HeroSection
        stats={stats}
        loading={statsLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white dark:bg-card border-b border-border sticky top-16 z-30 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 12).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-indigo-700 text-white shadow-sm"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                }`}
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8" ref={resultsRef}>
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterBar
              degrees={degrees}
              sources={sources}
              selectedDegree={selectedDegree}
              selectedSource={selectedSource}
              sortBy={sortBy}
              hasDownloadOnly={hasDownloadOnly}
              onDegreeChange={setSelectedDegree}
              onSourceChange={setSelectedSource}
              onSortChange={setSortBy}
              onDownloadOnlyChange={setHasDownloadOnly}
              onReset={resetFilters}
              activeFiltersCount={activeFiltersCount}
              totalFiltered={filteredItems.length}
            />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-indigo-700 dark:text-indigo-300 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {loading ? "جاري التحميل..." : `${filteredItems.length.toLocaleString()} مادة`}
                </span>
                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 underline">
                    مسح الفلاتر ({activeFiltersCount})
                  </button>
                )}
              </div>

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

      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        degrees={degrees}
        sources={sources}
        selectedDegree={selectedDegree}
        selectedSource={selectedSource}
        sortBy={sortBy}
        hasDownloadOnly={hasDownloadOnly}
        onDegreeChange={setSelectedDegree}
        onSourceChange={setSelectedSource}
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
