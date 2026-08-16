import { Question } from "@/types/question";

export class QuestionRepository {

    private questions: Question[] = [];

    public load(data: Question[]) {

        this.questions = data;

    }

    public byArticle(article: number): Question[] {

        return this.questions.filter(q => q.article === article);

    }

    public getAll(): Question[] {

        return this.questions;

    }

}