export interface Rule {

    id: string;

    article: number;

    title: string;

    priority: number;

    enabled: boolean;

    conditions: string[];

    formula: string;

}