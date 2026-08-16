import { KnowledgeProvider } from "@/knowledge/KnowledgeProvider";

export class DecisionEngine {

    private provider = new KnowledgeProvider();

    public getArticle(article: number) {

        return this.provider
            .getArticles()
            .find((a: any) => a.article === article);

    }

    public getRules(article: number) {

        return this.provider
            .getRules()
            .filter((r: any) => r.article === article);

    }

    public getQuestions(article: number) {

        return this.provider
            .getQuestions()
            .filter((q: any) => q.article === article);

    }

    public getWorkflow(article: number) {

        return this.provider
            .getWorkflows()
            .find((w: any) => w.article === article);

    }

}