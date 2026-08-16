export type ExpertMode = "fast" | "professional";

export type ExpertType = "individual" | "panel";

export interface Service {

    id: string;

    title: string;

    article: number;

}

export interface Question {

    id: string;

    title: string;

    type: "number" | "text" | "select" | "boolean";

    required: boolean;

}

export interface Answer {

    questionId: string;

    value: unknown;

}

export interface CalculationResult {

    fee: number;

    article: number;

    trace: string[];

}