import { Rule } from "@/types/rule";

export class RuleRepository {

    private rules: Rule[] = [];

    public load(data: Rule[]) {

        this.rules = data;

    }

    public getAll(): Rule[] {

        return this.rules;

    }

    public byArticle(article: number): Rule[] {

        return this.rules.filter(r => r.article === article);

    }

}