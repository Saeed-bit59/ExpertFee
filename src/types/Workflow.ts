export interface Workflow {
  id: string;

  article: number;

  enabled: boolean;

  firstQuestion: string | null;

  status: string;
}