export interface CalcInput{
 service:string;
 article:number;
 amount:number;
 modifiers:Record<string,boolean>;
}
export interface CalcResult{
 fee:number;
 trace:string[];
}
export function calculationEngine(input:CalcInput,rules:any[]){
 let fee=0;
 const trace:string[]=[];
 for(const r of rules){
   trace.push(r.id ?? 'rule');
 }
 return {fee,trace};
}
