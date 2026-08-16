export default function ResultCard({result}:any){
 return <div><h3>نتیجه محاسبه</h3><pre>{JSON.stringify(result,null,2)}</pre></div>;
}
