import {
  useEffect,
  useState
} from "react";
import {
  useLocation,
  useNavigate
} from "react-router-dom";

import HomePage
  from "./pages/HomePage";

import Article11Page
  from "./pages/Article11Page";

import Article13Page
  from "./pages/Article13Page";

import Article14Page
  from "./pages/Article14Page";

import WaterEngineeringPage
  from "./pages/WaterEngineeringPage";

import MetalsAndMiningPage
  from "./pages/MetalsAndMiningPage";

import MovablePropertyPage
  from "./pages/MovablePropertyPage";

import FinancialAffairsPage
  from "./pages/FinancialAffairsPage";

import VehiclePage
  from "./pages/VehiclePage";

import RoadBuildingPage from "./pages/RoadBuildingPage";
import IndustryTechnologyPage from "./pages/IndustryTechnologyPage";
import AgricultureNaturalResourcesPage from "./pages/AgricultureNaturalResourcesPage";
import ExpertRecordsPage from "./pages/ExpertRecordsPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import SharePage from "./pages/SharePage";
import type { ExpertCaseDraft } from "./records/ExpertCaseDraft";
import type { ShareResultInput } from "./share/ShareResult";


type AppPage =
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

const PAGE_PATHS: Record<AppPage, string> = {
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
  SHARE: "/share"
};

const PATH_PAGES = Object.fromEntries(
  Object.entries(PAGE_PATHS).map(([page, path]) => [path, page])
) as Record<string, AppPage>;

export const APP_PAGE_PATHS = PAGE_PATHS;

export function resolveAppPage(pathname: string): AppPage {
  return PATH_PAGES[pathname] ?? "HOME";
}


export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = resolveAppPage(location.pathname);

  function setCurrentPage(page: AppPage): void {
    navigate(PAGE_PATHS[page]);
  }

  useEffect(() => {
    if (!PATH_PAGES[location.pathname]) {
      navigate(PAGE_PATHS.HOME, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }, [location.pathname]);

  const [
    pendingExpertCaseDraft,
    setPendingExpertCaseDraft
  ] = useState<ExpertCaseDraft | null>(
    null
  );

  const [shareDraft, setShareDraft] = useState<ShareResultInput | null>(null);


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


  function openRecordsWithDraft(
    draft: ExpertCaseDraft
  ): void {
    setPendingExpertCaseDraft(
      draft
    );
    setCurrentPage(
      "EXPERT_RECORDS"
    );
  }


  return (

    <div dir="rtl" className="ef-app-shell">

      {/* =====================================
          Header
          ===================================== */}

      {currentPage !== "HOME" && (
      <header className="ef-app-header">
        <div className="ef-app-header-inner">
          <div className="ef-app-brand"><strong>ExpertFee</strong><span>محاسبه حق‌الزحمه کارشناسان رسمی</span></div>
          <div className="ef-app-tariff-badge"><span>تعرفه</span><strong>۱۴۰۵</strong></div>
        </div>
      </header>
      )}


      {/* =====================================
          Home
          ===================================== */}

      {currentPage === "HOME" && (

        <HomePage

          onOpenArticle11={
            openArticle11
          }

          onOpenArticle13={() => {
            setCurrentPage(
              "ARTICLE_13"
            );
          }}

          onOpenArticle14={() => {
            setCurrentPage(
              "ARTICLE_14"
            );
          }}

          onOpenWaterEngineering={() => {
            setCurrentPage(
              "WATER_ENGINEERING"
            );
          }}

          onOpenMetalsAndMining={() => {
            setCurrentPage(
              "METALS_AND_MINING"
            );
          }}

          onOpenMovableProperty={() => {
            setCurrentPage(
              "MOVABLE_PROPERTY"
            );
          }}

          onOpenFinancialAffairs={() => {
            setCurrentPage(
              "FINANCIAL_AFFAIRS"
            );
          }}

          onOpenVehicles={() => {
            setCurrentPage(
              "VEHICLES"
            );
          }}

          onOpenRoadBuilding={() => setCurrentPage("ROAD_BUILDING")}
          onOpenIndustryTechnology={() => setCurrentPage("INDUSTRY_TECHNOLOGY")}
          onOpenAgricultureNaturalResources={() => setCurrentPage("AGRICULTURE_NATURAL_RESOURCES")}
          onOpenHistory={() => {
            setPendingExpertCaseDraft(null);
            setCurrentPage("EXPERT_RECORDS");
          }}
          onOpenShare={openShare}
          onOpenAbout={openAbout}
          onOpenSettings={openSettings}

        />

      )}


      {/* =====================================
          Article 11
          ===================================== */}

      {currentPage === "ARTICLE_11" && (

        <div>

          <div className="ef-page-backbar">

            <button
              type="button"
              onClick={goHome}
              className="ef-page-back-button ef-keyboard-focus"
            >
              ← بازگشت به صفحه اصلی
            </button>

          </div>


          <Article11Page
            onSaveCalculation={
              openRecordsWithDraft
            }
            onShareCalculation={openShare}
          />

        </div>

      )}

      {/* =====================================
          Article 13
          ===================================== */}

      {currentPage === "ARTICLE_13" && (

        <Article13Page
          onBack={goHome}
        />

      )}


      {/* =====================================
          Article 14
          ===================================== */}

      {currentPage === "ARTICLE_14" && (

        <Article14Page
          onBack={goHome}
        />

      )}


      {/* =====================================
          Water Engineering
          Articles 15 - 21
          ===================================== */}

      {currentPage ===
        "WATER_ENGINEERING" && (

        <WaterEngineeringPage
          onBack={goHome}
          onOpenArticle11={
            openArticle11
          }
        />

      )}


      {/* =====================================
          Metals and Mining
          Article 22
          ===================================== */}

      {currentPage ===
        "METALS_AND_MINING" && (

        <MetalsAndMiningPage
          onBack={goHome}
        />

      )}


      {/* =====================================
          Movable Property
          Article 23
          ===================================== */}

      {currentPage ===
        "MOVABLE_PROPERTY" && (

        <MovablePropertyPage
          onBack={goHome}
        />

      )}


      {/* =====================================
          Financial Affairs
          Articles 25 - 29
          ===================================== */}

      {currentPage ===
        "FINANCIAL_AFFAIRS" && (

        <FinancialAffairsPage
          onBack={goHome}
        />

      )}


      {/* =====================================
          Vehicles
          Articles 31 - 32
          ===================================== */}

      {currentPage ===
        "VEHICLES" && (

        <VehiclePage
          onBack={goHome}
        />

      )}


      {currentPage === "ROAD_BUILDING" && <RoadBuildingPage onBack={goHome} />}
      {currentPage === "INDUSTRY_TECHNOLOGY" && <IndustryTechnologyPage onBack={goHome} />}
      {currentPage === "AGRICULTURE_NATURAL_RESOURCES" && <AgricultureNaturalResourcesPage onBack={goHome} />}

      {currentPage === "EXPERT_RECORDS" && (
        <ExpertRecordsPage
          onBack={goHome}
          initialDraft={
            pendingExpertCaseDraft
          }
          onDraftConsumed={() =>
            setPendingExpertCaseDraft(
              null
            )
          }
        />
      )}


      {/* =====================================
          About
          ===================================== */}

      {currentPage === "ABOUT" && (
        <AboutPage onBack={goHome} />
      )}


      {/* =====================================
          Settings
          ===================================== */}

      {currentPage === "SETTINGS" && (
        <SettingsPage onBack={goHome} />
      )}

      {currentPage === "SHARE" && (
        <SharePage onBack={goHome} shareInput={shareDraft ?? undefined} />
      )}


      {/* =====================================
          Footer
          ===================================== */}

      <footer className="ef-app-footer">
        <span>ExpertFee</span><span>نسخه ۱٫۰ · تعرفه ۱۴۰۵</span>
      </footer>

    </div>

  );
}
