import Article14CalculatorPanel
  from "../components/Article14CalculatorPanel";


interface Article14PageProps {
  onBack: () => void;
}


export default function Article14Page({
  onBack
}: Article14PageProps) {

  return (

    <main dir="rtl" className="ef-calculator-page-shell">

      <div className="ef-page-backbar">

        <button
          className="ef-page-back-button article14-back-button"
          type="button"
          onClick={onBack}
        >
          ← بازگشت به صفحه اصلی
        </button>

      </div>


      <Article14CalculatorPanel />

    </main>

  );
}
