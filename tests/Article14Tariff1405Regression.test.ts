import { TARIFF_1405 } from "../src/config/Tariff1405";
import { calculateArticle14 } from "../src/engine/Article14Calculator";

function assertEqual(actual: number, expected: number, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected=${expected} actual=${actual}`);
  }
}

const tariff = TARIFF_1405.article14;
assertEqual(tariff.baseFeeToman, 2_000_000, "Article 14 base fee");
assertEqual(tariff.pastImageYearRate, 0.10, "Article 14 past-image rate");
assertEqual(tariff.additionalConnectedParcelRate, 0.40, "Article 14 connected-parcel rate");

const combined = calculateArticle14({
  pastImageYearCount: 2,
  hasAdditionalConnectedParcels: true,
  additionalConnectedParcelCount: 2
});

assertEqual(combined.pastImagesAdditionalFeeToman, 400_000, "Article 14 past-image fee");
assertEqual(combined.additionalParcelsFeeToman, 1_600_000, "Article 14 connected-parcel fee");
assertEqual(combined.finalFeeToman, 4_000_000, "Article 14 combined fee");

console.log("ARTICLE 14 TARIFF 1405 REGRESSION: PASS");
