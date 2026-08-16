import type { ShareResult, ShareResultInput } from "./ShareResult";

function money(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

export function buildShareResult(input: ShareResultInput): ShareResult {
  if (!Number.isFinite(input.evaluationValueToman) || input.evaluationValueToman <= 0) {
    throw new Error("مبلغ مورد ارزیابی برای اشتراک‌گذاری معتبر نیست.");
  }

  if (!Number.isInteger(input.expertCount) || input.expertCount <= 0) {
    throw new Error("تعداد کارشناسان برای اشتراک‌گذاری معتبر نیست.");
  }

  if (!Number.isFinite(input.calculatedFeeToman) || input.calculatedFeeToman < 0) {
    throw new Error("مبلغ دستمزد برای اشتراک‌گذاری معتبر نیست.");
  }

  const text = [
    "نتیجه محاسبه حق‌الزحمه کارشناسی",
    "",
    `مبلغ مورد ارزیابی: ${money(input.evaluationValueToman)} تومان`,
    `تعداد کارشناسان: ${input.expertCount.toLocaleString("fa-IR")} نفر`,
    `دستمزد محاسبه‌شده: ${money(input.calculatedFeeToman)} تومان`,
    "",
    "تولیدشده توسط:",
    "ExpertFee",
  ].join("\n");

  return {
    title: "نتیجه محاسبه ExpertFee",
    text,
  };
}
