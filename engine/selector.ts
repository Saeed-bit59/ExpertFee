export function selectWorkflow(service:string){
 switch(service){
  case 'valuation': return 11;
  case 'rent': return 13;
  case 'aerial': return 14;
  default: return null;
 }
}
