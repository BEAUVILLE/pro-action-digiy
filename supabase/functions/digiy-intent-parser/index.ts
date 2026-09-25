import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
  "Content-Type":"application/json; charset=utf-8"
};

function clean(v:unknown,max=500){return String(v??"").trim().slice(0,max)}
function extractJson(raw:string){
  const txt=raw.trim().replace(/^```json\s*/i,"").replace(/```$/i,"").trim();
  const a=txt.indexOf("{"),b=txt.lastIndexOf("}");
  if(a<0||b<=a) throw new Error("invalid_json");
  return JSON.parse(txt.slice(a,b+1));
}
function fallback(text:string){
  return {ok:true,mode:"fallback",search_text:text,requests:[]};
}
function buildSearchText(original:string,requests:any[]){
  const bits=[original];
  for(const r of Array.isArray(requests)?requests:[]){
    if(r?.intent) bits.push(String(r.intent));\n    if(r?.specialty) bits.push(String(r.specialty));\n    if(r?.query_clean) bits.push(String(r.query_clean));
    if(r?.zone) bits.push(String(r.zone));
    if(r?.origin) bits.push(String(r.origin));
    if(r?.destination) bits.push(String(r.destination));
    if(r?.date) bits.push(String(r.date));
    if(r?.time) bits.push(String(r.time));
    if(Number.isFinite(Number(r?.people))) bits.push(String(r.people)+" personnes");
  }
  return Array.from(new Set(bits.map(x=>clean(x,180)).filter(Boolean))).join(" ");
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:CORS});
  if(req.method!=="POST") return new Response(JSON.stringify({error:"method_not_allowed"}),{status:405,headers:CORS});
  try{
    const body=await req.json();
    const text=clean(body?.text,700);
    if(!text) return new Response(JSON.stringify({error:"text_required"}),{status:400,headers:CORS});

    const apiKey=Deno.env.get("MISTRAL_API_KEY");
    if(!apiKey) return new Response(JSON.stringify(fallback(text)),{status:200,headers:CORS});

    const today=new Date().toISOString().slice(0,10);
    const system=[
      "Tu es le parseur d'intentions de DIGIYLYFE.",
      "Tu n'es pas un chatbot. Tu ne réponds jamais au client.",
      "Tu n'inventes aucune information. Si une donnée manque, mets null.",
      "Tu comprends le français naturel, le français imparfait, l'anglais courant et le wolof courant mélangé au français.",
      "Intentions autorisées: DRIVER, LOC, RESTO, COMMERCE, BUILD, BEAUTY, JOB, EXPLORE, RESA, UNKNOWN.",
      "Plusieurs besoins dans une phrase = plusieurs objets requests.",
      "Champs: intent, specialty, zone, origin, destination, date, time, people, query_clean, confidence.",\n      "Pour BUILD, specialty peut être plumber, electrician, mason, solar ou null. Pour BEAUTY, specialty peut être nails, hair, massage, spa ou null.",\n      "Si la phrase signifie réparer une fuite, réparer l’eau, problème de robinet, tuyau ou canalisation, utilise BUILD + specialty plumber et query_clean contenant plombier.",
      "confidence est un nombre entre 0 et 1.",
      "Normalise seulement ce qui est explicitement compris.",
      "Date du jour: "+today+". Fuseau métier: Africa/Dakar.",
      "Réponds uniquement en JSON valide sous la forme {\"requests\":[...]}"
    ].join(" ");

    const ai=await fetch("https://api.mistral.ai/v1/chat/completions",{
      method:"POST",
      headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:Deno.env.get("DIGIY_AI_MODEL")||"mistral-small-latest",
        temperature:0,
        max_tokens:700,
        messages:[
          {role:"system",content:system},
          {role:"user",content:text}
        ]
      })
    });

    if(!ai.ok) return new Response(JSON.stringify(fallback(text)),{status:200,headers:CORS});
    const data=await ai.json();
    const content=data?.choices?.[0]?.message?.content;
    if(typeof content!=="string") return new Response(JSON.stringify(fallback(text)),{status:200,headers:CORS});

    try{
      const parsed=extractJson(content);
      const requests=Array.isArray(parsed?.requests)?parsed.requests:[];
      return new Response(JSON.stringify({
        ok:true,
        mode:"ai",
        search_text:buildSearchText(text,requests),
        requests
      }),{status:200,headers:CORS});
    }catch{
      return new Response(JSON.stringify(fallback(text)),{status:200,headers:CORS});
    }
  }catch{
    return new Response(JSON.stringify({error:"intent_parser_failed"}),{status:500,headers:CORS});
  }
});