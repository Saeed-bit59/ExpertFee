export interface WizardState {

    article:number;

    currentQuestion:string;

    answers:Record<string,unknown>;

    finished:boolean;

}