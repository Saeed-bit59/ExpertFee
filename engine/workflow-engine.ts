export function getWorkflow(mode:'fast'|'professional'){
 return mode==='fast'
 ? ['service','field','amount','result']
 : ['service','field','expertType','questions','modifiers','result'];
}
