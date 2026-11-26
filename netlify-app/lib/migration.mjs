import {webcrypto} from 'node:crypto';
const enc=new TextEncoder();
const digest=async value=>Buffer.from(await webcrypto.subtle.digest('SHA-256',enc.encode(value))).toString('hex');
const same=(a,b)=>a.length===b.length&&Buffer.from(a).reduce((n,v,i)=>n|(v^Buffer.from(b)[i]),0)===0;
export async function migrate(request,bucket,secret){
 const answer=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
 if(request.method!=='POST')return answer({error:'Método não permitido.'},405);
 if(request.headers.get('Origin')!==new URL(request.url).origin)return answer({error:'Origem inválida.'},403);
 if(!secret||secret.length<32)return answer({error:'O proprietário deve configurar MIGRATION_ACCESS_KEY com pelo menos 32 caracteres na Netlify antes de importar.'},503);
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const rateKey='migration-attempts/'+await digest(ip);
 const row=await bucket.get(rateKey),rate=row?await row.json():{count:0,until:0};
 if(rate.until>Date.now()&&rate.count>=5)return answer({error:'Aguarde 15 minutos antes de tentar novamente.'},429);
 let raw=await request.text();if(raw.length>4000000)return answer({error:'Pacote excede o tamanho permitido.'},413);
 let body;try{body=JSON.parse(raw)}catch{return answer({error:'Pacote inválido.'},400)}
 if(!same(await digest(String(body.accessKey||'')),await digest(secret))){await bucket.put(rateKey,JSON.stringify({count:rate.until>Date.now()?rate.count+1:1,until:Date.now()+900000}));return answer({error:'Chave de migração inválida.'},401)}
 if(await bucket.get('migration/ready.json'))return answer({error:'A migração já foi concluída. Nenhum dado foi alterado.'},409);
 if((await bucket.list({prefix:'teams/',limit:1})).objects.length||(await bucket.list({prefix:'accounts/',limit:1})).objects.length)return answer({error:'O destino já contém dados. Revisão do operador necessária.'},409);
 const {server,scripts,team,audit}=body;
 const data=server?.data,adminId=server?.accountId,password=String(body.password||''),name='juliocnovais';
 if(password.length<6||password.length>256)return answer({error:'Use uma senha de 6 a 256 caracteres.'},422);
 if(!server?.shared||!server?.isAdmin||!adminId||!['clients','events','trainings'].every(k=>Array.isArray(data?.[k]))||!Array.isArray(scripts?.scripts)||!Array.isArray(audit)||team?.members?.length!==1||team.members[0].id!==adminId||team.pending?.length!==0)return answer({error:'Pacote incompatível com a exportação da Central CS.'},422);
 const validId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]+$/.test(id);
 for(const items of [data.clients,data.events,data.trainings,scripts.scripts])if(!items.every(x=>x&&validId(x.id))||new Set(items.map(x=>x.id)).size!==items.length)return answer({error:'Identificadores inválidos ou duplicados.'},422);
 if(audit.length!==data.clients.length||new Set(audit.map(x=>x.clientId)).size!==data.clients.length||audit.some(x=>!validId(x.clientId)||!data.clients.some(c=>c.id===x.clientId)||!Array.isArray(x.items)||x.items.some(y=>!Number.isFinite(Date.parse(y.at)))))return answer({error:'Auditoria incompleta ou inválida.'},422);
 const salt=webcrypto.randomUUID(),key=await webcrypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
 const hash=Buffer.from(await webcrypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},key,256)).toString('hex');
 const entries=[['teams/main/state.json',data],['admin-scripts/team-main/state.json',{scripts:scripts.scripts}],['accounts/'+name,{id:adminId,name,displayName:server.displayName||name,salt,hash,authVersion:0,recoveryHash:null}],['teams/main/config.json',{adminId,members:team.members,pending:[],createdAt:new Date().toISOString()}]];
 for(const client of audit)client.items.forEach((record,i)=>entries.push(['audit/team-main/'+client.clientId+'/'+String(9999999999999-Date.parse(record.at)).padStart(13,'0')+'-import-'+i+'.json',record]));
 if(!await bucket.put('migration/lock.json',JSON.stringify({at:new Date().toISOString()}),{onlyIf:{etagDoesNotMatch:'*'}}))return answer({error:'Importação já iniciada. Aguarde ou solicite revisão do operador.'},409);
 try{for(const [key,value] of entries){if(!await bucket.put(key,JSON.stringify(value),{onlyIf:{etagDoesNotMatch:'*'}}))throw Error('Conflito de gravação');const saved=await bucket.get(key);if(!saved||JSON.stringify(await saved.json())!==JSON.stringify(value))throw Error('Falha na conferência')}
 const counts={clients:data.clients.length,events:data.events.length,scripts:scripts.scripts.length,auditEntries:audit.reduce((n,c)=>n+c.items.length,0)};
 if(!await bucket.put('migration/ready.json',JSON.stringify({at:new Date().toISOString(),counts}),{onlyIf:{etagDoesNotMatch:'*'}}))throw Error('Falha ao concluir');
 return answer({saved:true,counts,username:name});
 }catch{return answer({error:'A importação não terminou. Acesso permanece bloqueado para revisão; não repita nem exclua dados.'},503)}
}
