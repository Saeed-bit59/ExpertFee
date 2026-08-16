import Article11CalculatorPanel from "../components/Article11CalculatorPanel";
import type { ExpertCaseDraft } from "../records/ExpertCaseDraft";

interface Props {
  onSaveCalculation?: (draft: ExpertCaseDraft) => void;
}

export default function Article11Page({
  onSaveCalculation
}: Props) {
  return (
    <Article11CalculatorPanel
      onSaveCalculation={
        onSaveCalculation
      }
    />
  );
}
