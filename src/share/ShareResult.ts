export interface ShareResultInput {
  evaluationValueToman: number;
  expertCount: number;
  calculatedFeeToman: number;
  calculationTitle?: string;
  tariffReference?: string;
}

export interface ShareResult {
  title: string;
  text: string;
}
