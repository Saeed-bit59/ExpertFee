import {
  TARIFF_1405,
  type Tariff1405Article11Bracket,
} from "../config/Tariff1405";

export interface Article11Bracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface Article11Result {
  value: number;
  baseFee: number;
  finalFee: number;
  capped: boolean;
  maximumFee: number;
  breakdown: {
    from: number;
    to: number | null;
    taxableAmount: number;
    rate: number;
    fee: number;
  }[];
}

const FIXED_LIMIT =
  TARIFF_1405.article11.fixedLimitRial;

const FIXED_FEE =
  TARIFF_1405.article11.fixedFeeRial;

const MAXIMUM_FEE =
  TARIFF_1405.article11.generalMaximumRial;

const BRACKETS: Article11Bracket[] =
  TARIFF_1405.article11.bracketsRial.map(
    (item: Tariff1405Article11Bracket) => ({
      from: item.from,
      to: item.to,
      rate: item.rate,
    }),
  );

export function calculateArticle11(
  value: number,
): Article11Result {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      "Evaluation value must be a non-negative number.",
    );
  }

  const breakdown: Article11Result["breakdown"] = [];

  if (value === 0) {
    return {
      value,
      baseFee: 0,
      finalFee: 0,
      capped: false,
      maximumFee: MAXIMUM_FEE,
      breakdown,
    };
  }

  let fee = FIXED_FEE;

  breakdown.push({
    from: 0,
    to: FIXED_LIMIT,
    taxableAmount: Math.min(value, FIXED_LIMIT),
    rate: 0,
    fee: FIXED_FEE,
  });

  if (value > FIXED_LIMIT) {
    for (const bracket of BRACKETS) {
      if (value <= bracket.from) {
        break;
      }

      const upperLimit =
        bracket.to === null
          ? value
          : Math.min(value, bracket.to);

      const taxableAmount =
        upperLimit - bracket.from;

      if (taxableAmount <= 0) {
        continue;
      }

      const bracketFee =
        taxableAmount * bracket.rate;

      fee += bracketFee;

      breakdown.push({
        from: bracket.from,
        to: bracket.to,
        taxableAmount,
        rate: bracket.rate,
        fee: bracketFee,
      });
    }
  }

  const baseFee = Math.round(fee);

  const finalFee = Math.min(
    baseFee,
    MAXIMUM_FEE,
  );

  return {
    value,
    baseFee,
    finalFee,
    capped:
      baseFee > MAXIMUM_FEE,
    maximumFee:
      MAXIMUM_FEE,
    breakdown,
  };
}
