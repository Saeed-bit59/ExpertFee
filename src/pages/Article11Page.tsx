import Article11CalculatorPanel from "../components/Article11CalculatorPanel";
import type { ExpertCaseDraft } from "../records/ExpertCaseDraft";
import type { ShareResultInput } from "../share/ShareResult";

interface Props {
  onSaveCalculation?: (draft: ExpertCaseDraft) => void;
  onShareCalculation?: (input: ShareResultInput) => void;
  useArticle11Note1?: boolean;
  onBack?: () => void;
}

export default function Article11Page({
  onSaveCalculation,
  onShareCalculation,
  useArticle11Note1,
  onBack
}: Props) {
  return (
    <>
      {onBack && (
        <div className="ef-page-backbar">
          <button
            className="ef-page-back-button"
            type="button"
            onClick={onBack}
          >
            ← بازگشت به صفحه اصلی
          </button>
        </div>
      )}

      <Article11CalculatorPanel
        onSaveCalculation={onSaveCalculation}
        onShareCalculation={onShareCalculation}
        useArticle11Note1={useArticle11Note1}
      />
    </>
  );
}
