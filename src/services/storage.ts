export const storage={
 save:(k:string,v:any)=>localStorage.setItem(k,JSON.stringify(v)),
 load:(k:string)=>JSON.parse(localStorage.getItem(k)||"null")
};
