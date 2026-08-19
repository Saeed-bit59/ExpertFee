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
        <div style={{ maxWidth: 900, margin: "20px auto 0", padding: "0 24px" }}>
          <button
            type="button"
            onClick={onBack}
            style={{ padding: "9px 16px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#ffffff", cursor: "pointer", fontFamily: "inherit" }}
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
