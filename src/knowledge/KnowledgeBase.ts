import { TariffArticle } from "@/types/tariff";

export class KnowledgeBase {

    private articles: TariffArticle[] = [];

    public load(data: TariffArticle[]) {

        this.articles = data;

    }

    public getArticle(article: number) {

        return this.articles.find(a => a.article === article);

    }

    public getAll() {

        return this.articles;

    }

}