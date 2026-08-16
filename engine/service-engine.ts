export function getService(id:string,catalog:any[]){
 return catalog.find(s=>s.id===id);
}
