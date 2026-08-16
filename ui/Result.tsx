export default function Result({result}:any){
return <pre>{JSON.stringify(result,null,2)}</pre>
}
