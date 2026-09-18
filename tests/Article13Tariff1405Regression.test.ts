import { TARIFF_1405 } from "../src/config/Tariff1405";
import { calculateArticle13 } from "../src/engine/Article13Calculator";

function assertEqual(actual: number | boolean, expected: number | boolean, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected=${expected} actual=${actual}`);
  }
}

const tariff = TARIFF_1405.article13;

assertEqual(tariff.fixedLimitToman, 10_000_000, "Article 13 fixed limit");
assertEqual(tariff.fixedFeeToman, 2_000_000, "Article 13 fixed fee");
assertEqual(tariff.secondLimitToman, 50_000_000, "Article 13 second limit");
assertEqual(tariff.thirdLimitToman, 100_000_000, "Article 13 third limit");
assertEqual(tariff.maximumFeeToman, 90_000_000, "Article 13 maximum");

assertEqual(calculateArticle13({ monthlyRentToman: 10_000_000 }).finalFeeToman, 2_000_000, "Article 13 first boundary");
assertEqual(calculateArticle13({ monthlyRentToman: 50_000_000 }).finalFeeToman, 12_000_000, "Article 13 second boundary");
assertEqual(calculateArticle13({ monthlyRentToman: 100_000_000 }).finalFeeToman, 19_500_000, "Article 13 third boundary");

const capped = calculateArticle13({ monthlyRentToman: 2_000_000_000 });
assertEqual(capped.finalFeeToman, tariff.maximumFeeToman, "Article 13 cap");
assertEqual(capped.capped, true, "Article 13 capped flag");

let rejectedInvalidInput = false;
try {
  calculateArticle13({ monthlyRentToman: -1 });
} catch {
  rejectedInvalidInput = true;
}
assertEqual(rejectedInvalidInput, true, "Article 13 invalid input protection");

console.log("ARTICLE 13 TARIFF 1405 REGRESSION: PASS");
