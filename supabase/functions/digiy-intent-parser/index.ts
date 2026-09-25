import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json; charset=utf-8"};
function clean(v:unknown,m=500){return String(v??"").trim().slice(0,m)}
function parse(raw:string){const t=raw.trim().replace(/^```json\s*/i,"").replace(/```$/i,"").trim();const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a<0||b<=a)throw new Error("json");return JSON.parse(t.slice(a,b+1))}
function fallback(t:string){return {ok:true,mode:"fallback",search_text:t,requests:[]}}
function enrich(original:string,rs:any[]){const out=[original];for(const r of Array.isArray(rs)?rs:[]){for(const k of ["intent","specialty","query_clean","zone","origin","destination","date","time"]){if(r?.[k])out.push(String(r[k]));}if(Number.isFinite(Number(r?.people)))out.push(String(r.people)+" personnes")}return Array.from(new Set(out.map(x=>clean(x,180)).filter(Boolean))).join(" ")}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:H});
 if(req.method!=="POST")return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:H});
 try{
  const body=await req.json();const text=clean(body?.text,700);
  if(!text)return new Response(JSON.stringify({error:"text_required"}),{status:400,headers:H});
  const key=Deno.env.get("MISTRAL_API_KEY");if(!key)return new Response(JSON.stringify(fallback(text)),{headers:H});
  const sys="Tu es le parseur d'intentions de DIGIYLYFE. Tu ne discutes pas et tu n'inventes rien. Intentions: DRIVER, LOC, RESTO, COMMERCE, BUILD, BEAUTY, JOB, EXPLORE, RESA, UNKNOWN. Retourne seulement JSON {requests:[...]}. Chaque request: intent,specialty,zone,origin,destination,date,time,people,query_clean,confidence. Utilise null si absent. Pour BUILD: specialty plumber,electrician,mason,solar ou null. Une demande de fuite, eau, robinet, tuyau ou canalisation => BUILD + plumber et query_clean doit contenir plombier. Pour BEAUTY: nails,hair,massage,spa ou null. Plusieurs besoins => plusieurs requests. Comprends français imparfait et wolof courant mélangé au français.";
  const ai=await fetch("https://api.mistral.ai/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:Deno.env.get("DIGIY_AI_MODEL")||"mistral-small-latest",temperature:0,max_tokens:700,messages:[{role:"system",content:sys},{role:"user",content:text}]})});
  if(!ai.ok)return new Response(JSON.stringify(fallback(text)),{headers:H});
  const data=await ai.json();const content=data?.choices?.[0]?.message?.content;if(typeof content!=="string")return new Response(JSON.stringify(fallback(text)),{headers:H});
  try{const p=parse(content);const rs=Array.isArray(p?.requests)?p.requests:[];return new Response(JSON.stringify({ok:true,mode:"ai",search_text:enrich(text,rs),requests:rs}),{headers:H})}
  catch{return new Response(JSON.stringify(fallback(text)),{headers:H})}
 }catch{return new Response(JSON.stringify({error:"intent_parser_failed"}),{status:500,headers:H})}
});