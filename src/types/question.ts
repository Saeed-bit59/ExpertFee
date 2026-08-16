export interface Question {

    id: string;

    article: number;

    title: string;

    type: "number" | "text" | "select" | "boolean";

    required: boolean;

    options?: string[];

    next?: string;

}