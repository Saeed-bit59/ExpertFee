import { Workflow } from "@/types/Workflow";

export class WorkflowRepository {

    private workflows: Workflow[] = [];

    public load(data: Workflow[]) {

        this.workflows = data;

    }

    public get(article: number) {

        return this.workflows.find(w => w.article === article);

    }

    public getAll() {

        return this.workflows;

    }

}