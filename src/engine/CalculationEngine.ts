import { DecisionEngine } from "./DecisionEngine";

export class CalculationEngine {

    private decision=new DecisionEngine();

    public calculate(article:number){

        const articleInfo=this.decision.getArticle(article);

        const rules=this.decision.getRules(article);

        const questions=this.decision.getQuestions(article);

        return{

            article:articleInfo,

            rules,

            questions,

            fee:0,

            trace:[],

            success:true

        };

    }

}