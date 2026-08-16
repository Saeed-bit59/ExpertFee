import { calculateExpertCaseFinancials, getInstitutionSharePercent, resolveProcessingInstitution } from "../src/database/ExpertCaseFinancialRules";
function a(c:boolean,m:string){if(!c)throw new Error(`EXPERT CASE FINANCIAL RULES TEST FAILED: ${m}`)}
const j=calculateExpertCaseFinancials("JUDICIARY",10_000_000);a(getInstitutionSharePercent("JUDICIARY")===5,"Judiciary 5%");a(j.institutionShareToman===500_000&&j.netReceivableToman===9_500_000,"Judiciary amounts");
const c=calculateExpertCaseFinancials("CENTER",10_000_000);a(c.institutionSharePercent===10&&c.netReceivableToman===9_000_000,"Center 10/90");
const b=calculateExpertCaseFinancials("BAR_ASSOCIATION",10_000_000);a(b.institutionSharePercent===10&&b.netReceivableToman===9_000_000,"Bar 10/90");
a(resolveProcessingInstitution("CENTER")==="CENTER","Center route");a(resolveProcessingInstitution("BAR_ASSOCIATION")==="BAR_ASSOCIATION","Bar route");a(resolveProcessingInstitution("JUDICIARY","CENTER")==="CENTER","Judiciary Center route");let rejected=false;try{resolveProcessingInstitution("JUDICIARY")}catch{rejected=true}a(rejected,"Judiciary institution required");console.log("EXPERT CASE FINANCIAL RULES: ALL TESTS PASSED");
