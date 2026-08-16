export function applyRules(ctx:any,rules:any[]){
 const trace=[];
 for(const r of rules){trace.push(r.id);}
 return {ctx,trace};
}
