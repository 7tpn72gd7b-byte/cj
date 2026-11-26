import {DEPLOY_CONTEXT} from '../lib/deploy-context.generated.mjs';
import {getStore} from '@netlify/blobs';
import {bucketFromStore} from '../lib/bucket.mjs';
import {createScheduledSnapshot} from '../lib/server.generated.mjs';
export default async function(){
 if(DEPLOY_CONTEXT !== 'production')throw Error('Backup permitido somente em produção.');
 const env={BUCKET:bucketFromStore(getStore({name:'central-cs',consistency:'strong'})),TEAM_ADMIN_USERNAME:process.env.TEAM_ADMIN_USERNAME||'juliocnovais'};
 if(!await env.BUCKET.get('migration/ready.json'))throw Error('Migração ainda não concluída.');
 const result=await createScheduledSnapshot(env);
 if(!result.saved)throw Error('Backup não confirmado.');
 console.log(JSON.stringify({saved:result.saved,slot:result.slot,clients:result.clients,events:result.events}));
 return new Response(null,{status:204});
}
