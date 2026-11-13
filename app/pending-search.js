// Read-only queues and search indexes derived from the shared customer records.
function pendingType(row){return row.action==='work'?'work':row.kind==='health'?'health':row.action==='return'?'return':row.action==='followup'?'followup':'idle'}
function pendingRows(model,tab,type){return (model[tab]||[]).filter(row=>!type||pendingType(row)===type)}
let dayPendingType='';
function choosePendingType(value){dayPendingType=value;dayFocusPage=0;dashboard()}
const pendingPreviousModel=dayFocusModel;
dayFocusModel=function(data,day,user,mine,idleDays=7){
 const model=pendingPreviousModel(data,day,user,mine,idleDays),known=new Set(model.idle.map(r=>r.id));
 // Keep distinct actionable tasks: resolving a follow-up does not complete a return.
 for(const key of ['late','today'])model[key]=model[key].filter(r=>!(r.kind==='client'&&['return','followup'].includes(r.action)));
 const add=r=>{if(r.date<day)model.late.push(r);else if(r.date===day)model.today.push(r)};
 for(const c of model.clients){
  const date=dayDate(c.nextContact);if(date&&date<=day)add({kind:'client',id:c.id,name:c.fantasy,date,label:date<day?'Retorno vencido':'Retorno hoje',note:c.nextContactNote||'Retorno agendado',action:'return'});
  const alert=c.stage!=='Concluído'&&c.activationStatus!=='Ativada'?statusAlert(c):null;
  if(alert&&dayDate(alert.due)&&alert.due<=day)add({kind:'client',id:c.id,name:c.fantasy,date:alert.due,label:alert.due<day?'Follow-up vencido':'Follow-up hoje',note:'Follow-up após 7 dias de implantação',action:'followup'});
 }
 const byPriority=(a,b)=>Number(!!b.critical)-Number(!!a.critical)||a.date.localeCompare(b.date)||String(a.name).localeCompare(String(b.name),'pt-BR');
 model.late.sort(byPriority);model.today.sort(byPriority);
 for(const c of model.clients){
  if(known.has(c.id)||c.activationStatus==='Ativada'||c.stage==='Concluído')continue;
  const start=dayDate(c.arrival);if(!start||start>day)continue;
  const last=(data.events||[]).filter(e=>e.clientId===c.id).map(e=>dayDate(e.at)).filter(d=>d&&d>=start&&d<=day).sort().at(-1)||start;
  const days=dayInterval(last,day);if(days<idleDays)continue;
  model.idle.push({kind:'client',id:c.id,name:c.fantasy,date:last,label:'Sem movimentação',note:'Sem movimentação há '+days+' dias · '+(c.stage||'Aguardando contrato'),action:'detail',days});
 }
 model.idle.sort((a,b)=>b.days-a.days||String(a.name).localeCompare(String(b.name),'pt-BR'));
 // A stopped customer already carrying a due task appears once in the combined queue.
 const due=[...model.late,...model.today],busy=new Set(due.map(r=>r.kind+':'+r.id));
 model.all=[...due,...model.idle.filter(r=>!busy.has(r.kind+':'+r.id))].sort((a,b)=>Number(!!b.critical)-Number(!!a.critical)||a.date.localeCompare(b.date)||String(a.name).localeCompare(String(b.name),'pt-BR'));
 return model;
};
function searchFields(c){return [c.fantasy,c.name,c.cnpj,c.owner,c.ticket,c.implementationTicket,c.activationTicket,c.responsible,c.reseller,c.city,c.state,...(c.csWork||[]).map(t=>t.ticket)].filter(Boolean)}
function completeSearchMatch(c,query){const fields=searchFields(c).map(normalizeSearch),text=fields.join(' ');return normalizeSearch(query).split(/\s+/).filter(Boolean).every(word=>text.includes(word)||(/^[#\d./-]+$/.test(word)&&/\d/.test(word)&&fields.some(f=>f.replace(/\D/g,'').includes(word.replace(/\D/g,''))))) }
// The same normalization fixes formatted CNPJs and owner searches in existing lists.
matchesSearch=completeSearchMatch;
function globalSearchModel(data,query,scope='all'){
 if(!String(query||'').trim())return [];
 const rows=[];for(const [kind,clients] of [['client',data.clients||[]],['health',data.healthClients||[]]]){
  if(scope!=='all'&&scope!==kind)continue;
  for(const c of clients)if(completeSearchMatch(c,query))rows.push({kind,client:c});
 }
 const q=normalizeSearch(query),digits=q.replace(/\D/g,'');
 const rank=r=>normalizeSearch(r.client.fantasy)===q||digits.length===14&&String(r.client.cnpj||'').replace(/\D/g,'')===digits?0:normalizeSearch(r.client.fantasy).startsWith(q)?1:2;
 return rows.sort((a,b)=>rank(a)-rank(b)||String(a.client.fantasy||'').localeCompare(String(b.client.fantasy||''),'pt-BR')||a.kind.localeCompare(b.kind));
}
let globalSearchPage=0;
globalSearch=function(){globalSearchPage=0;openDialog('Buscar cliente','<div class="global-search-controls"><label for="globalQuery">Nome, CNPJ, proprietário ou ticket</label><input id="globalQuery" type="search" autocomplete="off" placeholder="Ex.: Bela Vita, CNPJ ou #108123" oninput="globalSearchPage=0;renderGlobalSearch()"><label class="sr-only" for="globalScope">Base de clientes</label><select id="globalScope" onchange="globalSearchPage=0;renderGlobalSearch()"><option value="all">Todas as bases</option><option value="client">Central CS</option><option value="health">Health Score</option></select></div><div id="globalResults" aria-live="polite"></div>');$('globalQuery').focus();renderGlobalSearch()};
renderGlobalSearch=function(){const q=$('globalQuery')?.value||'',box=$('globalResults');if(!box)return;if(!q.trim()){box.innerHTML='<p class="muted">Busque em todas as etapas. No Health Score, também por revenda, cidade ou estado.</p>';return}
 const rows=globalSearchModel(db,q,$('globalScope')?.value||'all'),size=10;globalSearchPage=Math.min(globalSearchPage,Math.max(0,Math.ceil(rows.length/size)-1));
 box.innerHTML='<p class="global-search-count">'+rows.length+' resultado(s)</p>'+(rows.slice(globalSearchPage*size,(globalSearchPage+1)*size).map(({kind,client:c})=>'<article class="global-search-result"><div><small class="tag">'+(kind==='health'?'Health Score':'Central CS')+'</small><strong>'+esc(c.fantasy||'Sem nome')+'</strong><small>CNPJ '+esc(c.cnpj||'não informado')+' · '+esc(c.owner||'Proprietário não informado')+'</small><small>'+esc(kind==='health'?[c.reseller,c.city,c.state,c.contractStatus==='churn'?'Churn':'Contrato ativo'].filter(Boolean).join(' · '):[c.stage,c.responsible?'CS: '+c.responsible:'',c.ticket?'Entrada: #'+c.ticket:'',c.activationTicket?'Ativação: #'+c.activationTicket:''].filter(Boolean).join(' · '))+'</small></div><button class="secondary" onclick="'+workAction('openGlobalClient',kind,c.id)+'">Abrir ficha</button></article>').join('')||'<div class="empty">Nenhum cliente encontrado. Confira o termo ou selecione outra base.</div>')+(rows.length>size?'<div class="focus-pagination"><small>Página '+(globalSearchPage+1)+' de '+Math.ceil(rows.length/size)+'</small><div><button class="secondary" '+(!globalSearchPage?'disabled':'')+' onclick="globalSearchPage--;renderGlobalSearch()">Anterior</button><button class="secondary" '+((globalSearchPage+1)*size>=rows.length?'disabled':'')+' onclick="globalSearchPage++;renderGlobalSearch()">Próxima</button></div></div>':'');
};
function openGlobalClient(kind,id){if(!workCustomer(kind,id)){toast('Cliente não encontrado. Atualize a página.');return}closeModal();if(kind==='health')healthDetail(id);else detail(id)}
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&!event.altKey&&!event.shiftKey&&document.querySelector('#app')?.style.display!=='none'){event.preventDefault();if($('modal').open)return;globalSearch()}});
