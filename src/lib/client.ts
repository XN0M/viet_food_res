export async function api<T=any>(path:string,options:RequestInit={}):Promise<T>{
  const res=await fetch('/api/'+path,{...options,headers:{'Content-Type':'application/json',...options.headers},cache:'no-store'});
  const data=await res.json();if(!res.ok)throw new Error(data.error??'Služba nie je dostupná.');return data;
}
