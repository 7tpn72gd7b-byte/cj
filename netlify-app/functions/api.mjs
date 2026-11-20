import {DEPLOY_CONTEXT} from '../lib/deploy-context.generated.mjs';
import {getStore} from '@netlify/blobs';
import {bucketFromStore} from '../lib/bucket.mjs';
import {migrate} from '../lib/migration.mjs';
import {route} from '../lib/server.generated.mjs';
export default async function(request,context) {
  if(DEPLOY_CONTEXT !== 'production')return Response.json({error:'Dados privados indisponíveis em prévias.'},{status:503,headers:{'Cache-Control':'no-store'}});
  const headers=new Headers(request.headers);
  // Sites identity headers are untrusted on an independent host.
  for(const name of [...headers.keys()])if(name.startsWith('oai-'))headers.delete(name);
  headers.set('CF-Connecting-IP',context.ip || 'unknown');
  const url=new URL(request.url);
  if(url.pathname.startsWith('/.netlify/functions/api/'))url.pathname='/api/'+url.pathname.slice('/.netlify/functions/api/'.length);
  const safe=new Request(url, {method:request.method,headers,...(!['GET','HEAD'].includes(request.method)?{body:await request.arrayBuffer()}: {})});
  const env={BUCKET:bucketFromStore(getStore({name:'central-cs',consistency:'strong'})),TEAM_ADMIN_USERNAME:process.env.TEAM_ADMIN_USERNAME || 'juliocnovais'};
  try {
    if(url.pathname==='/api/migration')return await migrate(safe,env.BUCKET,process.env.MIGRATION_ACCESS_KEY);
    // An empty deployment is locked until the authenticated operator imports data/accounts.
    if(!await env.BUCKET.get('migration/ready.json'))return Response.json({error:'Migração em preparação. Acesso liberado após conferência dos dados.'},{status:503,headers:{'Cache-Control':'no-store'}});
    return await route(safe,env);
  } catch { return Response.json({error:'Serviço temporariamente indisponível'},{status:503,headers:{'Cache-Control':'no-store'}}); }
}
