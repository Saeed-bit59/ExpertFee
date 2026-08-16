import articles from "../../../knowledge/articles.json";
import rules from "../../../knowledge/rules.json";
import questions from "../../../knowledge/questions.json";
import workflows from "../../../knowledge/workflow.json";

export class KnowledgeProvider {

    public getArticles() {
        return articles;
    }

    public getRules() {
        return rules;
    }

    public getQuestions() {
        return questions;
    }

    public getWorkflows() {
        return workflows;
    }

}