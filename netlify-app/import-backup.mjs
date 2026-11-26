// Operator-only import. Never include private data in the deploy or repository.
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {getStore} from '@netlify/blobs';
import {bucketFromStore} from './lib/bucket.mjs';
import {webcrypto} from 'node:crypto';
import readline from 'node:readline';
const folder=process.argv[2];
if(!folder||!process.env.NETLIFY_SITE_ID||!process.env.NETLIFY_AUTH_TOKEN)throw Error('Informe a pasta extraída do backup e configure NETLIFY_SITE_ID e NETLIFY_AUTH_TOKEN no ambiente do operador.');
if(!process.stdin.isTTY)throw Error('Execute em terminal interativo para definir a senha sem exibi-la.');
const read=name=>readFile(path.join(folder,name),'utf8').then(JSON.parse);
const [server,scripts,team,audit]=await Promise.all(['base-servidor.json','scripts-administrador.json','equipe.json','auditoria-servidor.json'].map(read));
const data=server.data;
if(!server.shared||!server.isAdmin||!Array.isArray(data?.clients)||!Array.isArray(data?.events)||!Array.isArray(data?.trainings)||!Array.isArray(scripts.scripts)||!Array.isArray(audit))throw Error('Pacote de exportação inválido.');
if(team.members.length!==1||team.pending.length)throw Error('Este importador exige conferência manual para equipes com mais de um acesso ou pedidos pendentes.');
for(const list of [data.clients,data.events,data.trainings,scripts.scripts])if(new Set(list.map(x=>x.id)).size!==list.length)throw Error('Identificadores duplicados no backup.');
const adminName=process.env.TEAM_ADMIN_USERNAME||'juliocnovais',adminId=server.accountId;
if(!adminId||team.members[0].id!==adminId)throw Error('Identidade administrativa não confere.');
const bucket=bucketFromStore(getStore({name:'central-cs',siteID:process.env.NETLIFY_SITE_ID,token:process.env.NETLIFY_AUTH_TOKEN,consistency:'strong'}));
if((await bucket.list({limit:1})).objects.length)throw Error('Destino não está vazio. Importação interrompida sem sobrescrever dados.');
function secret(prompt){return new Promise(resolve=>{process.stdout.write(prompt);let value='';readline.emitKeypressEvents(process.stdin);process.stdin.setRawMode(true);process.stdin.resume();const onKey=(str,key)=>{if(key?.ctrl&&key.name==='c'){process.exit(130)}if(key?.name==='return'){process.stdin.removeListener('keypress',onKey);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');resolve(value)}else if(key?.name==='backspace'){value=value.slice(0,-1)}else if(str&&!key?.ctrl&&!key?.meta)value+=str};process.stdin.on('keypress',onKey)})}
const password=await secret('Nova senha do administrador (não será exibida): '),confirm=await secret('Confirme a senha: ');
if(password.length<6||password.length>256||password!==confirm)throw Error('Senhas diferentes ou tamanho inválido. Nenhum dado importado.');
const salt=webcrypto.randomUUID(),encoder=new TextEncoder(),hex=bytes=>Buffer.from(bytes).toString('hex');
const key=await webcrypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
const hash=hex(await webcrypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256));
const entries=[['teams/main/state.json',data],['admin-scripts/team-main/state.json',{scripts:scripts.scripts}],['accounts/'+adminName,{id:adminId,name:adminName,displayName:server.displayName||adminName,salt,hash,authVersion:0,recoveryHash:null}],['teams/main/config.json',{adminId,members:team.members,pending:team.pending,createdAt:new Date().toISOString()}]];
for(const client of audit){if(!/^[a-zA-Z0-9_-]+$/.test(client.clientId)||!Array.isArray(client.items))throw Error('Auditoria inválida.');for(let i=0;i<client.items.length;i++)entries.push(['audit/team-main/'+client.clientId+'/'+String(9999999999999-Date.parse(client.items[i].at)).padStart(13,'0')+'-import-'+i+'.json',client.items[i]])}
// Atomic lock prevents simultaneous imports. A failed import stays closed for operator review.
if(!await bucket.put('migration/lock.json',JSON.stringify({at:new Date().toISOString()}),{onlyIf:{etagDoesNotMatch:'*'}}))throw Error('Outra importação já iniciou.');
for(const [name,value] of entries){if(!await bucket.put(name,JSON.stringify(value),{onlyIf:{etagDoesNotMatch:'*'}}))throw Error('Registro já existe: importação interrompida.');const saved=await bucket.get(name);if(!saved||JSON.stringify(await saved.json())!==JSON.stringify(value))throw Error('Falha na conferência da gravação. A aplicação permanecerá bloqueada.');}
const counts={clients:data.clients.length,events:data.events.length,scripts:scripts.scripts.length,auditEntries:audit.reduce((n,c)=>n+c.items.length,0)};
if(!await bucket.put('migration/ready.json',JSON.stringify({at:new Date().toISOString(),counts}),{onlyIf:{etagDoesNotMatch:'*'}}))throw Error('Não foi possível liberar a migração.');
console.log('Importação conferida:',JSON.stringify(counts));
