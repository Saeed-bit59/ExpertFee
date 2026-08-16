import { DecisionEngine } from "./DecisionEngine";
import { WizardState } from "./WizardState";

export class WizardEngine {

    private decision=new DecisionEngine();

    public start(article:number):WizardState{

        const questions=this.decision.getQuestions(article);

        return{

            article,

            currentQuestion:questions.length
                ? questions[0].id
                : "",

            answers:{},

            finished:false

        };

    }

}