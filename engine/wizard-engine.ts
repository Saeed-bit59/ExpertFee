export function nextStep(current:string,tree:any){
 const node=tree.nodes.find((n:any)=>n.id===current);
 return node?node.next:null;
}
