// Private administrator scripts are separate from the shared client state and public HTML.
const ADMIN_SCRIPTS_KEY='admin-scripts/team-main/state.json';
const ADMIN_SCRIPT_CATEGORIES=['onboarding','existing','followup','activation','module'];
function scriptFields(input){if(!input||typeof input!=='object')return null;let clean={category:input.category,title:typeof input.title==='string'?input.title.trim():'',body:typeof input.body==='string'?input.body.trim():'',note:typeof input.note==='string'?input.note.trim():''};return ADMIN_SCRIPT_CATEGORIES.includes(clean.category)&&clean.title.length>=1&&clean.title.length<=160&&clean.body.length>=1&&clean.body.length<=20000&&clean.note.length<=500?clean:null}
function scriptSeed(env){let raw=env.CS_ADMIN_SCRIPT_SEED;if(!raw)return {scripts:[]};let value=JSON.parse(raw);if(!Array.isArray(value.scripts)||value.scripts.length>200)throw Error('Invalid script seed');let ids=new Set();return {scripts:value.scripts.map(item=>{let fields=scriptFields(item);if(!fields||typeof item.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(item.id)||ids.has(item.id))throw Error('Invalid script seed');ids.add(item.id);return {...fields,id:item.id,createdAt:item.createdAt||null,updatedAt:null,updatedBy:null,archivedAt:null}})}}
async function handleAdminScripts(request,env){
 let account=await requestAccount(request,env);if(!account)return json({error:'Autenticação necessária'},401);
 let team=await teamContext(account,env);if(!team.config||!team.isAdmin)return json({error:'Acesso exclusivo do administrador.'},403);
 if(!['GET','POST'].includes(request.method))return json({error:'Método não permitido'},405);
 if(request.method==='POST'){
  if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Origem inválida'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Formato inválido'},415)
 }
 let object=await env.BUCKET.get(ADMIN_SCRIPTS_KEY),state=object?await object.json():scriptSeed(env);
 if(request.method==='GET')return json({scripts:state.scripts,etag:object?.etag||null});
 let expected=request.headers.get('If-Match'),initial=request.headers.get('If-None-Match')==='*';if(!expected&&!initial)return json({error:'Versão obrigatória. Recarregue a lista.'},428);
 if(expected&&expected!==object?.etag||initial&&object)return json({error:'Os scripts foram alterados em outra aba. Recarregue a lista antes de salvar.'},409);
 let raw=await request.text();if(raw.length>30000)return json({error:'Texto muito grande.'},413);let body;try{body=JSON.parse(raw)}catch{return json({error:'Solicitação inválida'},400)}
 if(!body||!['save','archive','restore'].includes(body.action))return json({error:'Ação inválida'},400);
 let at=new Date().toISOString(),next=JSON.parse(JSON.stringify(state)),id=body.script?.id||body.id,item=id?next.scripts.find(s=>s.id===id):null;
 if(id&&!item)return json({error:'Script não encontrado.'},404);
 if(body.action==='save'){
  let fields=scriptFields(body.script);if(!fields)return json({error:'Informe uma categoria válida, título de até 160 caracteres, mensagem de até 20.000 e observação de até 500.'},422);
  if(item?.archivedAt)return json({error:'Restaure o script antes de editar.'},409);
  if(item)Object.assign(item,fields,{updatedAt:at,updatedBy:account.name});else{if(next.scripts.length>=2000)return json({error:'Limite de scripts atingido.'},422);item={...fields,id:crypto.randomUUID(),createdAt:at,updatedAt:at,updatedBy:account.name,archivedAt:null};next.scripts.push(item)}
 }else{if(!item)return json({error:'Informe o script.'},400);item.archivedAt=body.action==='archive'?at:null;item.updatedAt=at;item.updatedBy=account.name}
 let serialized=JSON.stringify(next);if(serialized.length>1000000)return json({error:'Limite total de armazenamento atingido.'},413);
 // Preserve a private pre-change snapshot, including the initial seed, before the conditional write.
 await env.BUCKET.put('admin-scripts/team-main/versions/'+descendingStamp()+'.json',JSON.stringify({data:state,actor:account.name,at,reason:body.action}),{httpMetadata:{contentType:'application/json'}});
 let saved=await env.BUCKET.put(ADMIN_SCRIPTS_KEY,serialized,{onlyIf:expected?{etagMatches:expected}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
 return saved?json({saved:true,scripts:next.scripts,etag:saved.etag,id:item.id}):json({error:'Outra alteração foi salva primeiro. Recarregue a lista.'},409)
}
