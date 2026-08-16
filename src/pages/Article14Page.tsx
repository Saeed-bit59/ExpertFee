import Article14CalculatorPanel
  from "../components/Article14CalculatorPanel";


interface Article14PageProps {
  onBack: () => void;
}


export default function Article14Page({
  onBack
}: Article14PageProps) {

  return (

    <main
      dir="rtl"
      style={{
        minHeight: "70vh"
      }}
    >

      <div
        style={{
          maxWidth: 800,
          margin: "20px auto 0",
          padding: "0 24px"
        }}
      >

        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "8px 14px",
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          ← بازگشت به صفحه اصلی
        </button>

      </div>


      <Article14CalculatorPanel />

    </main>

  );
}