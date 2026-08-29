/*
 * Home — مكنز الدراسات العليا
 * مبدأ البيانات: تحميل الإحصاءات ومعاينة الصفحة الأولى فوراً،
 * ثم تحميل قاعدة المواد الكبيرة في الخلفية. يعرض البحث النتائج الأولى
 * على دفعات قبل استكمال الفحص، دون تغيير قواعد البحث أو الهوية البصرية.
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

function normalizeArabic(text?: string | null): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/ـ/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u2000-\u206F!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~،؛؟«»…]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasSunnahKeyword(title: string): boolean {
  return normalizeArabic(title).includes("السنه");
}

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 180;
const SEARCH_FRAME_BUDGET_MS = 8;

interface ProgressiveSearchState {
  signature: string;
  matches: ThesisItem[];
  isComplete: boolean;
  isScanning: boolean;
}

interface ProgressiveSearchCache {
  signature: string;
  sourceItems: ThesisItem[];
  scanIndex: number;
  matches: ThesisItem[];
  isComplete: boolean;
}

interface TitleSearchIndexItem {
  id: string;
  title: string;
  normalized_title: string;
  category?: string;
  degree?: string;
  file_type?: string;
  file_size?: string;
  link_telegram?: string;
  link_direct?: string;
}

interface NormalizedSearchFields {
  title: string;
  category: string;
  author: string;
  degree: string;
}

function matchesSearchQuery(
  item: ThesisItem,
  query: string,
  normalizedFields?: NormalizedSearchFields
): boolean {
  const fields = normalizedFields || {
    title: normalizeArabic(item.title),
    category: normalizeArabic(item.category),
    author: normalizeArabic(item.author),
    degree: normalizeArabic(item.degree),
  };
  return (
    fields.title.includes(query) ||
    fields.category.includes(query) ||
    fields.author.includes(query) ||
    fields.degree.includes(query)
  );
}

export default function Home() {
  const [allItems, setAllItems] = useState<ThesisItem[]>([]);
  const [previewItems, setPreviewItems] = useState<ThesisItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [titleSearchIndex, setTitleSearchIndex] = useState<TitleSearchIndexItem[]>([]);
  const [titleSearchIndexLoaded, setTitleSearchIndexLoaded] = useState(false);
  const [fullSearchIndexReady, setFullSearchIndexReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedDegree, setSelectedDegree] = useState("الكل");
  const [selectedSource, setSelectedSource] = useState("الكل");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hasDownloadOnly, setHasDownloadOnly] = useState(false);
  const [searchResultLimit, setSearchResultLimit] = useState(PAGE_SIZE);
  const [progressiveSearch, setProgressiveSearch] = useState<ProgressiveSearchState>({
    signature: "",
    matches: [],
    isComplete: true,
    isScanning: false,
  });
  const resultsRef = useRef<HTMLDivElement>(null);
  const progressiveSearchCacheRef = useRef<ProgressiveSearchCache | null>(null);
  const searchRunRef = useRef(0);
  const normalizedFieldsRef = useRef<Map<string, NormalizedSearchFields>>(new Map());

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

    const loadPreview = async () => {
      try {
        const response = await fetch("/home-preview.json");
        if (!response.ok) throw new Error(`تعذر تحميل معاينة المواد (${response.status})`);
        const data = (await response.json()) as ThesisItem[];
        if (!cancelled) setPreviewItems(data);
      } catch (error) {
        console.error("خطأ في تحميل معاينة المواد:", error);
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    const loadItems = async () => {
      try {
        const response = await fetch("/items.json");
        if (!response.ok) throw new Error(`تعذر تحميل المواد (${response.status})`);
        const data = (await response.json()) as ThesisItem[];
        if (!cancelled) {
          setAllItems(data);
          setItemsLoaded(true);
        }
      } catch (error) {
        console.error("خطأ في تحميل المواد:", error);
      }
    };

    const loadTitleSearchIndex = async () => {
      try {
        const response = await fetch("/search-title-index.json");
        if (!response.ok) throw new Error(`تعذر تحميل فهرس البحث (${response.status})`);
        const data = (await response.json()) as TitleSearchIndexItem[];
        if (!cancelled) {
          setTitleSearchIndex(data);
          setTitleSearchIndexLoaded(true);
        }
      } catch (error) {
        console.error("خطأ في تحميل فهرس البحث:", error);
      }
    };

    void loadStats();
    void loadPreview();

    // تأخير طلب القاعدة الكبيرة حتى تُرسم الصفحة الأولى والمعاينة في إطار مستقل.
    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        void loadTitleSearchIndex().finally(() => {
          if (!cancelled) void loadItems();
        });
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
    };
  }, []);

  useEffect(() => {
    searchRunRef.current += 1;
    const timer = window.setTimeout(
      () => setDebouncedSearchQuery(searchQuery),
      normalizeArabic(searchQuery).length > 1 ? SEARCH_DEBOUNCE_MS : 0
    );
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!itemsLoaded) {
      normalizedFieldsRef.current = new Map();
      setFullSearchIndexReady(false);
      return;
    }

    let cancelled = false;
    let animationFrame = 0;
    let nextIndex = 0;
    const nextFields = new Map<string, NormalizedSearchFields>();
    setFullSearchIndexReady(false);

    const prepareFrame = () => {
      const frameDeadline = performance.now() + SEARCH_FRAME_BUDGET_MS;
      while (nextIndex < allItems.length && performance.now() < frameDeadline) {
        const item = allItems[nextIndex];
        nextIndex += 1;
        nextFields.set(item.id, {
          title: normalizeArabic(item.title),
          category: normalizeArabic(item.category),
          author: normalizeArabic(item.author),
          degree: normalizeArabic(item.degree),
        });
      }

      if (cancelled) return;
      if (nextIndex >= allItems.length) {
        normalizedFieldsRef.current = nextFields;
        setFullSearchIndexReady(true);
        return;
      }
      animationFrame = window.requestAnimationFrame(prepareFrame);
    };

    animationFrame = window.requestAnimationFrame(prepareFrame);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [allItems, itemsLoaded]);

  const normalizedSearchQuery = useMemo(
    () => normalizeArabic(debouncedSearchQuery),
    [debouncedSearchQuery]
  );
  const hasActiveSearch = normalizedSearchQuery.length > 1;
  const hasNonSearchFilters =
    selectedCategory !== "الكل" ||
    selectedDegree !== "الكل" ||
    selectedSource !== "الكل" ||
    sortBy !== "default" ||
    hasDownloadOnly;
  const canUseTitleSearchIndex =
    hasActiveSearch &&
    !hasNonSearchFilters &&
    titleSearchIndexLoaded &&
    !fullSearchIndexReady;

  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (selectedCategory !== "الكل") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (selectedDegree !== "الكل") {
      result = result.filter((item) => item.degree === selectedDegree);
    }

    if (selectedSource !== "الكل") {
      result = result.filter((item) =>
        item.source === selectedSource ||
        (item.source || "").split(" • ").includes(selectedSource) ||
        item.external_links?.some((link) => (link.source_name || link.source) === selectedSource)
      );
    }

    if (hasDownloadOnly) {
      result = result.filter((item) => item.download_links_count > 0);
    }

    const isDefaultLandingView =
      !hasActiveSearch &&
      selectedCategory === "الكل" &&
      selectedDegree === "الكل" &&
      selectedSource === "الكل" &&
      sortBy === "default" &&
      !hasDownloadOnly;

    if (isDefaultLandingView) {
      result.sort((a, b) => Number(hasSunnahKeyword(b.title)) - Number(hasSunnahKeyword(a.title)));
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
  }, [allItems, hasActiveSearch, selectedCategory, selectedDegree, selectedSource, sortBy, hasDownloadOnly]);

  const searchSignature = useMemo(
    () => [
      normalizedSearchQuery,
      selectedCategory,
      selectedDegree,
      selectedSource,
      sortBy,
      hasDownloadOnly ? "downloads" : "all",
    ].join("\u001f"),
    [normalizedSearchQuery, selectedCategory, selectedDegree, selectedSource, sortBy, hasDownloadOnly]
  );

  useEffect(() => {
    if (!hasActiveSearch || (!itemsLoaded && !canUseTitleSearchIndex)) {
      progressiveSearchCacheRef.current = null;
      setProgressiveSearch({ signature: "", matches: [], isComplete: true, isScanning: false });
      return;
    }

    const searchSourceItems = canUseTitleSearchIndex
      ? titleSearchIndex as unknown as ThesisItem[]
      : filteredItems;
    const previousCache = progressiveSearchCacheRef.current;
    const canResume = previousCache?.signature === searchSignature && previousCache.sourceItems === searchSourceItems;
    const cache: ProgressiveSearchCache = canResume
      ? previousCache
      : {
          signature: searchSignature,
          sourceItems: searchSourceItems,
          scanIndex: 0,
          matches: [],
          isComplete: false,
        };
    progressiveSearchCacheRef.current = cache;

    if (cache.isComplete || cache.matches.length >= searchResultLimit) {
      setProgressiveSearch({ signature: searchSignature, matches: [...cache.matches], isComplete: cache.isComplete, isScanning: false });
      return;
    }

    const runId = ++searchRunRef.current;
    let animationFrame = 0;
    let cancelled = false;
    const publish = (isScanning: boolean) => {
      setProgressiveSearch({ signature: searchSignature, matches: [...cache.matches], isComplete: cache.isComplete, isScanning });
    };
    const scanFrame = () => {
      if (cancelled || searchRunRef.current !== runId) return;
      const frameDeadline = performance.now() + SEARCH_FRAME_BUDGET_MS;
      while (cache.scanIndex < cache.sourceItems.length && performance.now() < frameDeadline) {
        const item = cache.sourceItems[cache.scanIndex];
        cache.scanIndex += 1;
        const isMatch = canUseTitleSearchIndex
          ? (item as unknown as TitleSearchIndexItem).normalized_title.includes(normalizedSearchQuery)
          : matchesSearchQuery(item, normalizedSearchQuery, normalizedFieldsRef.current.get(item.id));
        if (isMatch) cache.matches.push(item);
      }
      if (cache.scanIndex >= cache.sourceItems.length) {
        cache.isComplete = true;
        publish(false);
        return;
      }
      if (cache.matches.length >= searchResultLimit) {
        publish(false);
        return;
      }
      if (cache.matches.length > 0) publish(true);
      animationFrame = window.requestAnimationFrame(scanFrame);
    };

    publish(true);
    animationFrame = window.requestAnimationFrame(scanFrame);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [itemsLoaded, hasActiveSearch, canUseTitleSearchIndex, searchSignature, filteredItems, titleSearchIndex, searchResultLimit, normalizedSearchQuery, fullSearchIndexReady]);

  useEffect(() => {
    setCurrentPage(1);
    setSearchResultLimit(PAGE_SIZE);
  }, [searchQuery, selectedCategory, selectedDegree, selectedSource, sortBy, hasDownloadOnly]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = useCallback((page: number) => {
    if (hasActiveSearch && (itemsLoaded || canUseTitleSearchIndex)) {
      setSearchResultLimit((currentLimit) => Math.max(currentLimit, page * PAGE_SIZE));
    }
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hasActiveSearch, itemsLoaded, canUseTitleSearchIndex]);

  const categories = useMemo(() => ["الكل", ...Object.keys(stats?.categories || {})], [stats]);
  const degrees = useMemo(() => ["الكل", ...Object.keys(stats?.degrees || {})], [stats]);

  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    allItems.forEach((item) => {
      const itemSources = [
        ...(item.source || "").split(" • "),
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

  const requiresFullData =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "الكل" ||
    selectedDegree !== "الكل" ||
    selectedSource !== "الكل" ||
    sortBy !== "default" ||
    hasDownloadOnly;

  const isSearchDebouncing =
    normalizeArabic(searchQuery).length > 1 && normalizeArabic(searchQuery) !== normalizedSearchQuery;
  const progressiveMatches = progressiveSearch.signature === searchSignature ? progressiveSearch.matches : [];
  const progressivePageItems = progressiveMatches.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const progressivePagePending =
    hasActiveSearch &&
    (itemsLoaded || canUseTitleSearchIndex) &&
    !progressiveSearch.isComplete &&
    progressivePageItems.length === 0;
  const titleOnlyResultsArePartial = hasActiveSearch && canUseTitleSearchIndex;
  const showingPreview = !itemsLoaded && !requiresFullData;
  const displayItems = showingPreview
    ? previewItems
    : hasActiveSearch && (itemsLoaded || canUseTitleSearchIndex) && !isSearchDebouncing
      ? progressivePageItems
      : paginatedItems;
  const displayLoading =
    (!itemsLoaded && (previewLoading || requiresFullData)) ||
    isSearchDebouncing ||
    progressivePagePending;
  const displayTotalItems: number | null = showingPreview
    ? previewItems.length
    : isSearchDebouncing ||
        titleOnlyResultsArePartial ||
        (hasActiveSearch && (itemsLoaded || canUseTitleSearchIndex) && !progressiveSearch.isComplete)
      ? null
      : hasActiveSearch && (itemsLoaded || canUseTitleSearchIndex)
        ? progressiveMatches.length
        : filteredItems.length;
  const displayTotalPages = showingPreview
    ? 1
    : isSearchDebouncing
      ? 1
      : hasActiveSearch && (itemsLoaded || canUseTitleSearchIndex)
        ? (titleOnlyResultsArePartial
            ? Math.max(currentPage + 1, 2)
            : progressiveSearch.isComplete
            ? Math.ceil(progressiveMatches.length / PAGE_SIZE)
            : Math.max(currentPage + 1, 2))
        : totalPages;
  const displayCurrentPage = showingPreview ? 1 : currentPage;

  const handleSearchChange = useCallback((nextQuery: string) => {
    searchRunRef.current += 1;
    setSearchQuery(nextQuery);
  }, []);

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
        onSearchChange={handleSearchChange}
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
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
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
              totalFiltered={displayTotalItems}
            />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-teal-700 dark:text-teal-300 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {displayLoading
                    ? "جاري التحميل..."
                    : displayTotalItems === null
                      ? "نتائج أولية..."
                      : `${displayTotalItems.toLocaleString()} مادة`}
                </span>
                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 underline">
                    مسح الفلاتر ({activeFiltersCount})
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                فلتر {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            <ItemsGrid
              items={displayItems}
              loading={displayLoading}
              currentPage={displayCurrentPage}
              totalPages={displayTotalPages}
              totalItems={displayTotalItems}
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
        totalFiltered={displayTotalItems}
      />

      <Footer />
    </div>
  );
}
