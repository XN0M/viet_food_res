export type Address={street:string;house:string;city:string;postal:string};
export async function geocode(address:Address):Promise<{lat:number;lng:number}|null>{
  const key=process.env.OPENCAGE_API_KEY;if(!key)return null;
  try{
    const query=new URLSearchParams({key,q:`${address.street} ${address.house}, ${address.postal} ${address.city}, Slovakia`,countrycode:'sk',limit:'1',no_annotations:'1'});
    const response=await fetch('https://api.opencagedata.com/geocode/v1/json?'+query,{signal:AbortSignal.timeout(5000),cache:'no-store'});
    if(!response.ok)return null;const data=await response.json();const result=data.results?.[0];
    if(!result||result.confidence<8||!result.components?.house_number)return null;
    const {lat,lng}=result.geometry;return Number.isFinite(lat)&&Number.isFinite(lng)?{lat,lng}:null;
  }catch{return null;}
}
