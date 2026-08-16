type FooterProps = {
  onAbout?: () => void;
};

export default function Footer({ onAbout }: FooterProps) {
  return (
    <footer
      dir="rtl"
      data-testid="shared-footer"
      style={{
        marginTop: 40,
        padding: "18px 20px",
        borderTop: "1px solid #e2e8f0",
        background: "#ffffff",
        textAlign: "center",
        fontSize: 13,
        opacity: 0.9,
        fontFamily:
          'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif',
      }}
    >
      {onAbout && (
        <button
          type="button"
          data-testid="footer-about-button"
          onClick={onAbout}
          style={{
            border: "none",
            background: "transparent",
            color: "#0d47a1",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            padding: "4px 8px",
          }}
        >
          درباره نرم‌افزار
        </button>
      )}

      <div
        style={{
          marginTop: 6,
          color: "#64748b",
          fontSize: 12,
        }}
      >
        ExpertFee · نسخه 0.1.0
      </div>
    </footer>
  );
}
