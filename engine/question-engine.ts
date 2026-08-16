export function getQuestions(article:number,bank:any[]){
 return bank.filter(q=>q.article===article);
}
