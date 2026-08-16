export default function QuestionRenderer({question}:any){
  switch(question.type){
    case 'number': return <input type='number' />;
    case 'select': return <select />;
    case 'boolean': return <input type='checkbox' />;
    default: return <input />;
  }
}
