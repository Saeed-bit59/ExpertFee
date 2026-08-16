import { KnowledgeBase } from "./KnowledgeBase";
import { RuleRepository } from "./RuleRepository";
import { QuestionRepository } from "./QuestionRepository";
import { WorkflowRepository } from "./WorkflowRepository";

export const knowledge = new KnowledgeBase();

export const rules = new RuleRepository();

export const questions = new QuestionRepository();

export const workflows = new WorkflowRepository();