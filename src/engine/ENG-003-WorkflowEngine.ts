import { DecisionEngine } from "./DecisionEngine";

export class WorkflowEngine {

    private decision = new DecisionEngine();

    public start(article: number) {

        return this.decision.getWorkflow(article);

    }

}