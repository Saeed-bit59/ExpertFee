import Article13CalculatorPanel
  from "../components/Article13CalculatorPanel";


interface Article13PageProps {
  onBack: () => void;
}


export default function Article13Page({
  onBack
}: Article13PageProps) {

  return (

    <main dir="rtl" className="ef-calculator-page-shell">

      <div className="ef-page-backbar">

        <button
          className="ef-page-back-button article13-back-button"
          type="button"
          onClick={onBack}
        >
          ← بازگشت به صفحه اصلی
        </button>

      </div>


      <Article13CalculatorPanel />

    </main>

  );
}
