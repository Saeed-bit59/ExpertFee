import {
  lazy,
  Suspense,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import type { ExpertCaseDraft } from "./records/ExpertCaseDraft";
import type { ShareResultInput } from "./share/ShareResult";

const Article11Page = lazy(() => import("./pages/Article11Page"));
const Article13Page = lazy(() => import("./pages/Article13Page"));
const Article14Page = lazy(() => import("./pages/Article14Page"));
const WaterEngineeringPage = lazy(() => import("./pages/WaterEngineeringPage"));
const MetalsAndMiningPage = lazy(() => import("./pages/MetalsAndMiningPage"));
const MovablePropertyPage = lazy(() => import("./pages/MovablePropertyPage"));
const FinancialAffairsPage = lazy(() => import("./pages/FinancialAffairsPage"));
const VehiclePage = lazy(() => import("./pages/VehiclePage"));
const RoadBuildingPage = lazy(() => import("./pages/RoadBuildingPage"));
const IndustryTechnologyPage = lazy(() => import("./pages/IndustryTechnologyPage"));
const AgricultureNaturalResourcesPage = lazy(
  () => import("./pages/AgricultureNaturalResourcesPage"),
);
const ExpertRecordsPage = lazy(() => import("./pages/ExpertRecordsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SharePage = lazy(() => import("./pages/SharePage"));

export type AppPage =
  | "HOME"
  | "ARTICLE_11"
  | "ARTICLE_13"
  | "ARTICLE_14"
  | "WATER_ENGINEERING"
  | "METALS_AND_MINING"
  | "MOVABLE_PROPERTY"
  | "FINANCIAL_AFFAIRS"
  | "VEHICLES"
  | "ROAD_BUILDING"
  | "INDUSTRY_TECHNOLOGY"
  | "AGRICULTURE_NATURAL_RESOURCES"
  | "EXPERT_RECORDS"
  | "ABOUT"
  | "SETTINGS"
  | "SHARE";

export const APP_PAGE_PATHS: Record<AppPage, string> = {
  HOME: "/",
  ARTICLE_11: "/article-11",
  ARTICLE_13: "/article-13",
  ARTICLE_14: "/article-14",
  WATER_ENGINEERING: "/water-engineering",
  METALS_AND_MINING: "/metals-and-mining",
  MOVABLE_PROPERTY: "/movable-property",
  FINANCIAL_AFFAIRS: "/financial-affairs",
  VEHICLES: "/vehicles",
  ROAD_BUILDING: "/road-building",
  INDUSTRY_TECHNOLOGY: "/industry-technology",
  AGRICULTURE_NATURAL_RESOURCES: "/agriculture-natural-resources",
  EXPERT_RECORDS: "/records",
  ABOUT: "/about",
  SETTINGS: "/settings",
  SHARE: "/share",
};

const PAGE_BY_PATH = new Map(
  Object.entries(APP_PAGE_PATHS).map(([page, path]) => [
    path,
    page as AppPage,
  ]),
);

export function resolveAppPage(pathname: string): AppPage {
  return PAGE_BY_PATH.get(pathname) ?? "HOME";
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = resolveAppPage(location.pathname);

  const [
    pendingExpertCaseDraft,
    setPendingExpertCaseDraft,
  ] = useState<ExpertCaseDraft | null>(null);
  const [shareDraft, setShareDraft] =
    useState<ShareResultInput | null>(null);

  function setCurrentPage(page: AppPage): void {
    navigate(APP_PAGE_PATHS[page]);
  }

  function goHome(): void {
    setCurrentPage("HOME");
  }

  function openArticle11(): void {
    setCurrentPage("ARTICLE_11");
  }

  function openAbout(): void {
    setCurrentPage("ABOUT");
  }

  function openSettings(): void {
    setCurrentPage("SETTINGS");
  }

  function openShare(draft?: ShareResultInput): void {
    setShareDraft(draft ?? null);
    setCurrentPage("SHARE");
  }

  function openRecordsWithDraft(draft: ExpertCaseDraft): void {
    setPendingExpertCaseDraft(draft);
    setCurrentPage("EXPERT_RECORDS");
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "inherit",
      }}
    >
      {currentPage !== "HOME" && (
        <header className="ef-app-header">
          <div className="ef-app-header__inner">
            <div className="ef-app-brand">ExpertFee</div>
            <p>محاسبه حق‌الزحمه کارشناسان رسمی دادگستری</p>
          </div>
        </header>
      )}

      <Suspense
        fallback={
          <main className="ef-page" role="status" aria-live="polite">
            <div className="ef-form-shell">در حال بارگذاری صفحه…</div>
          </main>
        }
      >
        {currentPage === "HOME" && (
          <HomePage
            onOpenArticle11={openArticle11}
            onOpenArticle13={() => setCurrentPage("ARTICLE_13")}
            onOpenArticle14={() => setCurrentPage("ARTICLE_14")}
            onOpenWaterEngineering={() => setCurrentPage("WATER_ENGINEERING")}
            onOpenMetalsAndMining={() => setCurrentPage("METALS_AND_MINING")}
            onOpenMovableProperty={() => setCurrentPage("MOVABLE_PROPERTY")}
            onOpenFinancialAffairs={() => setCurrentPage("FINANCIAL_AFFAIRS")}
            onOpenVehicles={() => setCurrentPage("VEHICLES")}
            onOpenRoadBuilding={() => setCurrentPage("ROAD_BUILDING")}
            onOpenIndustryTechnology={() => setCurrentPage("INDUSTRY_TECHNOLOGY")}
            onOpenAgricultureNaturalResources={() =>
              setCurrentPage("AGRICULTURE_NATURAL_RESOURCES")
            }
            onOpenHistory={() => {
              setPendingExpertCaseDraft(null);
              setCurrentPage("EXPERT_RECORDS");
            }}
            onOpenShare={openShare}
            onOpenAbout={openAbout}
            onOpenSettings={openSettings}
          />
        )}

        {currentPage === "ARTICLE_11" && (
          <div>
            <div className="ef-route-back">
              <button type="button" onClick={goHome}>
                ← بازگشت به صفحه اصلی
              </button>
            </div>
            <Article11Page
              onSaveCalculation={openRecordsWithDraft}
              onShareCalculation={openShare}
            />
          </div>
        )}

        {currentPage === "ARTICLE_13" && <Article13Page onBack={goHome} />}
        {currentPage === "ARTICLE_14" && <Article14Page onBack={goHome} />}
        {currentPage === "WATER_ENGINEERING" && (
          <WaterEngineeringPage onBack={goHome} onOpenArticle11={openArticle11} />
        )}
        {currentPage === "METALS_AND_MINING" && (
          <MetalsAndMiningPage onBack={goHome} />
        )}
        {currentPage === "MOVABLE_PROPERTY" && (
          <MovablePropertyPage onBack={goHome} />
        )}
        {currentPage === "FINANCIAL_AFFAIRS" && (
          <FinancialAffairsPage onBack={goHome} />
        )}
        {currentPage === "VEHICLES" && <VehiclePage onBack={goHome} />}
        {currentPage === "ROAD_BUILDING" && (
          <RoadBuildingPage onBack={goHome} />
        )}
        {currentPage === "INDUSTRY_TECHNOLOGY" && (
          <IndustryTechnologyPage onBack={goHome} />
        )}
        {currentPage === "AGRICULTURE_NATURAL_RESOURCES" && (
          <AgricultureNaturalResourcesPage onBack={goHome} />
        )}
        {currentPage === "EXPERT_RECORDS" && (
          <ExpertRecordsPage
            onBack={goHome}
            initialDraft={pendingExpertCaseDraft}
            onDraftConsumed={() => setPendingExpertCaseDraft(null)}
          />
        )}
        {currentPage === "ABOUT" && <AboutPage onBack={goHome} />}
        {currentPage === "SETTINGS" && <SettingsPage onBack={goHome} />}
        {currentPage === "SHARE" && (
          <SharePage onBack={goHome} shareInput={shareDraft ?? undefined} />
        )}
      </Suspense>

      <footer className="ef-app-footer">
        <div>نسخه 1.0</div>
      </footer>
    </div>
  );
}
