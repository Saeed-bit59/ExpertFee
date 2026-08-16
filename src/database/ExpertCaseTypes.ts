export type ReferralSource = "JUDICIARY" | "CENTER" | "BAR_ASSOCIATION";
export type ProcessingInstitution = "CENTER" | "BAR_ASSOCIATION";
export type PaymentStatus = "PENDING" | "RECEIVED";
export type InstitutionSharePercent = 5 | 10;
export interface ExpertCaseRecord { id:string; createdAt:string; updatedAt:string; referralSource:ReferralSource; processingInstitution:ProcessingInstitution; caseNumber?:string; plaintiff?:string; defendant?:string; notificationNumber?:string; requestingAuthority?:string; calculationCategory:string; tariffArticle?:number; subject?:string; grossFeeToman:number; institutionSharePercent:InstitutionSharePercent; institutionShareToman:number; netReceivableToman:number; paymentStatus:PaymentStatus; receivedAt?:string; receivedAmountToman:number; notes?:string; }
export interface CreateExpertCaseInput { referralSource:ReferralSource; processingInstitution?:ProcessingInstitution; caseNumber?:string; plaintiff?:string; defendant?:string; notificationNumber?:string; requestingAuthority?:string; calculationCategory:string; tariffArticle?:number; subject?:string; grossFeeToman:number; notes?:string; }
export interface ExpertCaseFilter { referralSource?:ReferralSource; processingInstitution?:ProcessingInstitution; paymentStatus?:PaymentStatus; createdFrom?:string; createdTo?:string; receivedFrom?:string; receivedTo?:string; search?:string; }
export interface ExpertCaseFinancialSummary { recordCount:number; receivedCount:number; pendingCount:number; grossFeeToman:number; institutionShareToman:number; netReceivableToman:number; receivedAmountToman:number; pendingReceivableToman:number; }
export interface ExpertCaseDatabaseSnapshot { schemaVersion:1; exportedAt:string; records:ExpertCaseRecord[]; }
