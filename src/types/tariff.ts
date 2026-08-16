export interface TariffArticle {

    article: number;

    title: string;

    text: string;

    questions: string[];

    ruleIds: string[];

}

export interface TariffRule {

    id: string;

    article: number;

    title: string;

    priority: number;

    enabled: boolean;

}

export interface TariffQuestion {

    id: string;

    article: number;

    text: string;

    type: "number" | "text" | "select" | "boolean";

    required: boolean;

}