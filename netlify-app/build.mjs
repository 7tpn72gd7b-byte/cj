import {readFile,writeFile,mkdir,rm,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here);
const read=p=>readFile(path.join(root,p),'utf8');
const modules=['upgrade','productivity','sellers','insights','health','health-workflow','header','polish','forms-visual','workflow','day-focus','scripts','operations','layout','kanban','pending-search'];
let html=await read('app/index.html');
const extra=(await Promise.all(modules.map(n=>read('app/'+n+'.js')))).join('\n');
html=html.replace('</script>',()=>extra+'\n</script>');
html=html.replace('<script>','<script src="/xlsx-v45.js"></script><script>');
const pub=path.join(here,'public');await rm(pub,{recursive:true,force:true});await mkdir(pub,{recursive:true});
await writeFile(path.join(pub,'index.html'),html);
await copyFile(path.join(here,'migration.html'),path.join(pub,'migration.html'));
await copyFile(path.join(root,'assets/xlsx-0.20.3.full.min.js'),path.join(pub,'xlsx-v45.js'));
await copyFile(path.join(root,'assets/cs-robot-run-v2.png'),path.join(pub,'cs-robot-run-v2.png'));
const logo=(await readFile(path.join(root,'assets/central-cs-logo-v1.png'))).toString('base64');
for(const [name,view] of [['brand-logo-v1.svg','160 210 1660 410'],['brand-icon-v1.svg','150 170 500 500']])await writeFile(path.join(pub,name),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}"><image width="1967" height="799" href="data:image/png;base64,${logo}"/></svg>`);
const names=['auth','profile','team','history','scheduled-backup','api','scripts'];
const code=(await Promise.all(names.map(n=>read('worker/'+n+'.js')))).join('\n').replace(/export async function /g,'async function ');
const routes=`
export async function route(request,env){const p=new URL(request.url).pathname;
if(p.startsWith('/api/recovery/'))return handleRecovery(request,env,p.slice(14));
if(p.startsWith('/api/auth/'))return handleAuth(request,env,p.slice(10));
const routes={'/api/admin-scripts':handleAdminScripts,'/api/profile':handleProfile,'/api/team':handleTeam,'/api/backup-status':handleBackupStatus,'/api/history':handleHistory,'/api/audit':handleAudit,'/api/state':handleState};
if(p==='/api/history/restore')return handleHistory(request,env,true);
return routes[p]?routes[p](request,env):json({error:'Não encontrado'},404)}
export {createScheduledSnapshot};
`;
await writeFile(path.join(here,'lib/server.generated.mjs'),code+routes);
// CONTEXT is supplied at build time, not guaranteed in Functions runtime.
await writeFile(path.join(here,'lib/deploy-context.generated.mjs'),'export const DEPLOY_CONTEXT = '+JSON.stringify(process.env.CONTEXT||'local')+';\n');
console.log('Central CS: interface e servidor Netlify preparados.');
