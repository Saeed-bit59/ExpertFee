export interface Context{answers:any;rules:any[];formulas:any[]}
export function run(ctx:Context){
 let fee=0;
 const trace=[];
 for(const rule of ctx.rules){trace.push(rule.id);}
 return {fee,trace};
}
