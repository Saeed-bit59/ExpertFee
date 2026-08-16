import Article13CalculatorPanel
  from "../components/Article13CalculatorPanel";


interface Article13PageProps {
  onBack: () => void;
}


export default function Article13Page({
  onBack
}: Article13PageProps) {

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
          className="article13-back-button"
          type="button"
          onClick={onBack}
          style={{
            padding:
              "8px 14px",
            border:
              "1px solid #ccc",
            borderRadius: 8,
            background:
              "#fff",
            cursor: "pointer"
          }}
        >
          بازگشت به صفحه اصلی
        </button>

      </div>


      <Article13CalculatorPanel />

    </main>

  );
}