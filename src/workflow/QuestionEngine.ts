import {
  WorkflowDefinitions
} from "./WorkflowDefinitions";

import type {
  WorkflowDefinition,
  WorkflowId
} from "./WorkflowDefinitions";

import type {
  Question
} from "./QuestionTypes";


/*
 * ========================================
 * Question Engine
 * ========================================
 *
 * وظایف:
 *
 * 1- پیدا کردن Workflow
 * 2- دریافت سوالات
 * 3- تعیین سوالات قابل نمایش
 */


export type WorkflowAnswers =
  Record<string, unknown>;


/*
 * ========================================
 * دریافت Workflow
 * ========================================
 */

export function getWorkflow(
  id: WorkflowId
): WorkflowDefinition {

  const workflow =
    WorkflowDefinitions.find(
      item =>
        item.id === id
    );


  if (!workflow) {

    throw new Error(
      `Workflow not found: ${id}`
    );
  }


  return workflow;
}


/*
 * ========================================
 * دریافت تمام سوالات Workflow
 * ========================================
 */

export function getWorkflowQuestions(
  id: WorkflowId
): Question[] {

  return getWorkflow(
    id
  ).questions;
}


/*
 * ========================================
 * دریافت یک سوال مشخص
 * ========================================
 */

export function getQuestion(
  workflowId: WorkflowId,
  questionId: string
): Question | undefined {

  return getWorkflowQuestions(
    workflowId
  ).find(
    question =>
      question.id ===
      questionId
  );
}


/*
 * ========================================
 * Visibility Rules
 * ========================================
 *
 * این بخش تعیین می‌کند هر سوال
 * در چه شرایطی به کاربر نمایش داده شود.
 */


function isQuestionVisible(
  question: Question,
  answers: WorkflowAnswers
): boolean {

  /*
   * ========================================
   * بدون شرط نمایش
   * ========================================
   *
   * اگر سوال visibleIf نداشته باشد،
   * همیشه نمایش داده می‌شود.
   */

  if (!question.visibleIf) {

    return true;
  }


  /*
   * ========================================
   * expertCount > 1
   * ========================================
   *
   * سوال مربوط به وضعیت رشته اعضای هیأت
   * فقط زمانی نمایش داده می‌شود که
   * تعداد کارشناسان بیشتر از یک نفر باشد.
   */

  if (
    question.visibleIf ===
    "expertCount > 1"
  ) {

    const expertCount =
      answers.expertCount;


    return (
      typeof expertCount ===
        "number" &&
      expertCount > 1
    );
  }


  /*
   * ========================================
   * subjectType === CONTRACT
   * ========================================
   *
   * سوال مربوط به نوع رسیدگی قراردادی
   * فقط زمانی نمایش داده می‌شود که
   * کاربر موضوع کارشناسی قراردادی
   * را انتخاب کرده باشد.
   */

  if (
    question.visibleIf ===
    "subjectType === CONTRACT"
  ) {

    const subjectType =
      answers.subjectType;


    return (
      subjectType ===
      "CONTRACT"
    );
  }


  /*
   * ========================================
   * Rule ناشناخته
   * ========================================
   *
   * اگر شرط نمایش برای QuestionEngine
   * شناخته‌شده نباشد، برای جلوگیری از
   * نمایش اشتباه سوال، آن را مخفی می‌کنیم.
   */

  return false;
}


/*
 * ========================================
 * دریافت سوالات قابل نمایش
 * ========================================
 *
 * فقط سوالاتی برگردانده می‌شوند که
 * با وضعیت فعلی پاسخ‌های کاربر
 * سازگار باشند.
 */

export function getVisibleQuestions(
  workflowId: WorkflowId,
  answers: WorkflowAnswers
): Question[] {

  const questions =
    getWorkflowQuestions(
      workflowId
    );


  return questions.filter(
    question =>
      isQuestionVisible(
        question,
        answers
      )
  );
}