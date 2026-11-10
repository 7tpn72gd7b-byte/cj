// Shared CS work stays with the customer record and follows the existing save/backup flow.
const postActivationSteps=[
 [7,'Confirmar primeiros dias de uso','Verificar se a operação começou e anotar dúvidas ou bloqueios.'],
 [30,'Revisar adoção e treinamento','Confirmar se a equipe opera sozinha e identificar reforços de treinamento.'],
 [60,'Revisar resultados e riscos','Validar o que melhorou, o que falta e se há risco de cancelamento.']
];
const handoffTeams=['Implantação','Suporte','Financeiro'];
const workLabels={post:'Pós-ativação',risk:'Plano de ação',handoff:'Encaminhamento'};
function workCustomer(kind,id,data=db){return (kind==='health'?data.healthClients||[]:data.clients||[]).find(c=>c.id===id)}
function activationWork(c){
 if(!c.postActivation||c.activationStatus!=='Ativada'||!dayDate(c.activationDate))return [];
 return postActivationSteps.map(([days,title,description])=>{const saved=(c.csWork||[]).find(t=>t.id==='post-'+days);return {id:'post-'+days,type:'post',title,description,owner:c.responsible||'',due:datePlus(c.activationDate,days),status:'open',...saved}});
}
function customerWork(c){return [...activationWork(c),...(c.csWork||[]).filter(t=>t.type!=='post')]}
function nextCustomerWork(c){return customerWork(c).filter(t=>t.status==='open').sort((a,b)=>a.due.localeCompare(b.due))[0]}
function workQueue(data,day,user,mine){
 const queue=[];
 for(const [kind,clients] of [['client',data.clients||[]],['health',data.healthClients||[]]])for(const c of clients){
  if(c.contractStatus==='churn')continue;
  for(const task of customerWork(c)){
   if(task.status!=='open'||!task.due||task.due>day||(mine&&task.owner&&normalizeSearch(task.owner)!==normalizeSearch(user)))continue;
   queue.push({kind,id:c.id,name:c.fantasy,date:task.due,label:workLabels[task.type],note:task.title,extra:(task.owner||'Sem responsável')+' · Prazo: '+fmt(task.due),action:'work',taskId:task.id});
  }
 }
 return queue;
}
function workAction(name,...args){return esc(name+'('+args.map(x=>JSON.stringify(x)).join(',')+')')}
function workBadge(task,day=activationToday()){
 let [label,style]=task.status==='done'?['Concluído','ok']:task.status==='cancelled'?['Cancelado','']:task.due<day?['Vencido','late']:task.due===day?['Hoje','soon']:['Programado',''];
 return '<span class="tag '+style+'">'+label+'</span>';
}
function workPanel(kind,c){
 const tasks=customerWork(c),open=tasks.filter(t=>t.status==='open').sort((a,b)=>a.due.localeCompare(b.due)),closed=tasks.filter(t=>t.status!=='open');
 const row=t=>`<article class="cs-work-row"><div><small>${workLabels[t.type]}${t.team?' · '+esc(t.team):''}</small><strong>${esc(t.title)}</strong><small>${esc(t.owner||'Sem responsável')} · ${fmt(t.due)}</small></div>${workBadge(t)}<button class="secondary" onclick="${workAction('workDetail',kind,c.id,t.id)}">Abrir</button></article>`;
 const enable=kind==='client'&&c.activationStatus==='Ativada'&&dayDate(c.activationDate)&&!c.postActivation;
 return `<section class="panel cs-work-panel"><div class="cs-work-heading"><div><h3>Acompanhamento do cliente</h3><p class="muted">${open.length} em aberto · ${closed.length} encerrado(s)</p></div><div class="actions"><button class="secondary" onclick="${workAction('workForm',kind,c.id,'risk')}">Novo plano de ação</button><button class="secondary" onclick="${workAction('workForm',kind,c.id,'handoff')}">Registrar encaminhamento</button></div></div>${enable?`<p class="hint">Carteira já ativada. Se quiser incluir os retornos de 7, 30 e 60 dias, use a data de ativação registrada. Os prazos que passaram aparecerão como vencidos.</p><button class="secondary" onclick="${workAction('enableActivationWork',c.id)}">Iniciar pós-ativação</button>`:''}${open.map(row).join('')||'<p class="muted">Nenhuma ação em aberto.</p>'}${closed.length?`<details><summary>Histórico de ações (${closed.length})</summary>${closed.map(row).join('')}</details>`:''}</section>`;
}
function workBack(kind,id){if(kind==='health')healthDetail(id);else detail(id)}
function enableActivationWork(id){
 const c=workCustomer('client',id);if(!c||c.postActivation||c.activationStatus!=='Ativada'||!dayDate(c.activationDate))return;
 c.postActivation=true;save();render();detail(id);toast('Acompanhamento pós-ativação iniciado.');
}
function workForm(kind,id,type,taskId=''){
 const c=workCustomer(kind,id);if(!c||!['risk','handoff','post'].includes(type)||c.contractStatus==='churn')return;
 const task=taskId?customerWork(c).find(t=>t.id===taskId):null;if(taskId&&(!task||task.type!==type||task.status!=='open'))return;if(type==='post'&&!task)return;
 const risk=kind==='health'?healthLatest(c):null,owners=c.responsible||risk?.actionOwner||db.user||'';
 const heading=task?'Editar '+workLabels[type].toLowerCase():type==='risk'?'Novo plano de ação':'Registrar encaminhamento';
 openDialog(heading,`<form class="cs-work-form" onsubmit="${workAction('saveWorkForm',kind,id,type,taskId).replace('(','(event,')}">
 <p class="hint">${esc(c.fantasy)} · ${type==='handoff'?'Registre a passagem de bastão e quando cobrar retorno.':'Defina quem acompanha a ação e quando ela deve ser feita.'}</p>
 ${type==='post'?'<p><strong>'+esc(task.title)+'</strong> · '+esc(task.description)+'</p>':field('title',type==='risk'?'Próxima ação':'Assunto','text',task?.title||'', 'required maxlength="160"')}
 ${type==='handoff'?'<div class="grid">'+options('team','Equipe de destino',handoffTeams,task?.team||'Suporte')+field('ticket','Número do ticket','text',task?.ticket||'','required maxlength="100"')+'</div>':''}
 <div class="grid">${field('owner','Responsável','text',task?.owner??owners,'required maxlength="120"')}${field('due',type==='handoff'?'Prazo para cobrar retorno':'Prazo','date',task?.due||activationToday(),'required')}</div>
 ${type==='post'?'':`<label>${type==='risk'?'Motivo / risco identificado':'Contexto do encaminhamento'}</label><textarea name="description" required maxlength="2000">${esc(task?.description??(type==='risk'?(risk?.criticalReason||risk?.risk||''):''))}</textarea>`}
 ${type==='risk'?'<label>Como saberemos que foi resolvido?</label><textarea name="criterion" required maxlength="1000">'+esc(task?.criterion||'')+'</textarea>':''}
 <div class="actions"><button type="submit">Salvar</button><button type="button" class="secondary" onclick="${workAction('workBack',kind,id)}">Voltar à ficha</button></div></form>`);
}
function saveWorkForm(event,kind,id,type,taskId){
 event.preventDefault();const c=workCustomer(kind,id);if(!c||c.contractStatus==='churn')return;
 const prior=taskId?customerWork(c).find(t=>t.id===taskId):null;if(taskId&&(!prior||prior.status!=='open'||prior.type!==type))return;
 const form=new FormData(event.target),v=k=>String(form.get(k)||'').trim(),due=dayDate(v('due')),owner=v('owner'),now=new Date().toISOString();
 const task={...prior,id:prior?.id||uid(),type,owner,due,status:'open',createdAt:prior?.createdAt||now,createdBy:prior?.createdBy||db.user,updatedAt:now,updatedBy:db.user};
 if(type!=='post')Object.assign(task,{title:v('title'),description:v('description')});
 if(type==='risk')task.criterion=v('criterion');
 if(type==='handoff')Object.assign(task,{team:v('team'),ticket:v('ticket')});
 if(!due||!owner||(type!=='post'&&(!task.title||!task.description))||(type==='risk'&&!task.criterion)||(type==='handoff'&&(!task.ticket||!handoffTeams.includes(task.team)))){alert('Preencha os campos obrigatórios.');return}
 storeWork(c,task);save();render();workDetail(kind,id,task.id);toast('Acompanhamento registrado.');
}
function storeWork(c,task){
 const i=(c.csWork||=[]).findIndex(t=>t.id===task.id);
 if(i<0)c.csWork.push(task);else c.csWork[i]=task;
 }
function workDetail(kind,id,taskId){
 const c=workCustomer(kind,id),t=c&&customerWork(c).find(x=>x.id===taskId);if(!t)return;
 openDialog(t.title,`<div class="cs-work-detail"><p class="muted">${esc(c.fantasy)} · ${workLabels[t.type]}</p><p>${workBadge(t)} · <strong>${esc(t.owner||'Sem responsável')}</strong> · Prazo ${fmt(t.due)}</p><p>${esc(t.description)}</p>
 ${t.team?`<p><strong>${esc(t.team)}</strong> · Ticket ${esc(t.ticket)}</p>`:''}${t.criterion?`<p><strong>Critério de resolução:</strong> ${esc(t.criterion)}</p>`:''}
 ${t.status==='open'?`<form class="cs-work-form" onsubmit="${workAction('finishWork',kind,id,taskId).replace('(','(event,')}"><label for="workOutcome">Resultado ou motivo do cancelamento</label><textarea id="workOutcome" name="outcome" required maxlength="2000"></textarea><div class="actions"><button name="status" value="done">Concluir</button><button class="secondary" name="status" value="cancelled">Cancelar ação</button><button type="button" class="secondary" onclick="${workAction('workForm',kind,id,t.type,t.id)}">Editar ou reagendar</button></div></form>`:`<p><strong>Resultado:</strong> ${esc(t.outcome)}</p><p class="hint">${esc(t.closedBy||'')} · ${fmt(dayDate(t.closedAt))}</p>`}
 <button type="button" class="text-button" onclick="${workAction('workBack',kind,id)}">Voltar à ficha</button></div>`);
}
function finishWork(event,kind,id,taskId){
 event.preventDefault();const c=workCustomer(kind,id),task=c&&customerWork(c).find(t=>t.id===taskId),status=event.submitter?.value||'done',outcome=String(new FormData(event.target).get('outcome')||'').trim();
 if(!task||task.status!=='open'||!['done','cancelled'].includes(status)||!outcome){alert('Informe o resultado ou motivo antes de encerrar.');return}
 const at=new Date().toISOString();storeWork(c,{...task,status,outcome,createdAt:task.createdAt||at,createdBy:task.createdBy||db.user,updatedAt:at,updatedBy:db.user,closedAt:at,closedBy:db.user});
 if(task.type==='post'&&status==='done'){record(id,'Contato pós-ativação',outcome);db.events.at(-1).contact=true}save();
 render();workDetail(kind,id,taskId);toast(status==='done'?'Ação concluída.':'Ação cancelada.');
}

const bottleneckStages=['Aguardando contrato','Aguardando assinatura','Aguardando onboarding','Aguardando implantação','Em implantação'];
function bottleneckModel(clients,day,minimum){
 const groups=bottleneckStages.map(label=>({label,rows:[],dated:0,totalDays:0,missing:0}));
 for(const c of clients){
  if(c.activationStatus==='Ativada'||['Concluído','Ativação de carteira'].includes(c.stage))continue;
  const [stage,start]=c.implementation||c.implementationConfirmed?[4,c.implementation]:c.onboarding?[3,c.onboarding]:c.contractSigned?[2,c.contractSigned]:c.contractPortal?[1,c.contractPortal]:[0,c.arrival];
  const group=groups[stage],date=dayDate(start);
  if(!date||date>day){group.missing++;continue}
  const days=dayInterval(date,day);group.dated++;group.totalDays+=days;
  if(days>=minimum)group.rows.push({id:c.id,name:c.fantasy,owner:c.responsible||'',date,days});
 }
 for(const g of groups)g.rows.sort((a,b)=>b.days-a.days||a.name.localeCompare(b.name,'pt-BR'));
 return groups;
}
let bottleneckDays=10,bottleneckStage=null;
function bottleneckReport(){
 reportMode='bottlenecks';const groups=bottleneckModel(db.clients,activationToday(),bottleneckDays),picked=bottleneckStage===null?groups.flatMap(g=>g.rows.map(row=>({...row,stage:g.label}))).sort((a,b)=>b.days-a.days):groups[bottleneckStage].rows.map(row=>({...row,stage:groups[bottleneckStage].label}));
 $('view').innerHTML=reportTabs()+`<section class="panel"><div class="cs-work-heading"><div><h2>Gargalos da jornada</h2><p class="muted">Carteira em aberto · dias corridos desde a entrada na etapa atual</p></div><div><label for="bottleneckDays">Tempo mínimo na etapa</label><select id="bottleneckDays" onchange="bottleneckDays=Number(this.value);bottleneckReport()">${[7,10,14,30].map(n=>`<option value="${n}" ${n===bottleneckDays?'selected':''}>${n} dias</option>`).join('')}</select></div></div>
 <div class="cs-bottleneck-grid">${groups.map((g,i)=>`<button class="secondary" aria-pressed="${i===bottleneckStage}" onclick="bottleneckStage=bottleneckStage===${i}?null:${i};bottleneckReport()"><strong>${g.rows.length}</strong><span>${g.label}</span><small>${g.dated?'Média: '+(g.totalDays/g.dated).toLocaleString('pt-BR',{maximumFractionDigits:1})+' dias':'Sem datas válidas'}${g.missing?' · '+g.missing+' sem data válida':''}</small></button>`).join('')}</div>
 ${filterSummaryMarkup(picked.length,picked.length===1?'cliente':'clientes',[['Etapa',bottleneckStage===null?'':groups[bottleneckStage].label],['Prazo',bottleneckDays+' dias ou mais']])}
 <div class="tablewrap"><table><thead><tr><th>Cliente</th><th>Etapa</th><th>Responsável CS</th><th>Desde</th><th>Dias</th><th>Ações</th></tr></thead><tbody>${picked.map(r=>`<tr><td><strong>${esc(r.name)}</strong></td><td>${esc(r.stage)}</td><td>${esc(r.owner||'Sem responsável')}</td><td>${fmt(r.date)}</td><td>${r.days}</td><td><button class="secondary" onclick="${workAction('detail',r.id)}">Ver ficha</button></td></tr>`).join('')||'<tr><td colspan="6">Nenhum cliente no recorte selecionado.</td></tr>'}</tbody></table></div></section>`;
}
const workBaseReports=reports;reports=function(mode=reportMode){if(mode==='bottlenecks')bottleneckReport();else workBaseReports(mode)};
const workBaseTabs=reportTabs;reportTabs=function(){return workBaseTabs().replace(/<\/div>$/,`<button class="${reportMode==='bottlenecks'?'active':''}" onclick="reports('bottlenecks')">Gargalos</button></div>`)};
const workBaseHealthDetail=healthDetail;healthDetail=function(id){workBaseHealthDetail(id);const c=workCustomer('health',id);if(c&&c.contractStatus!=='churn')$('modalBody').insertAdjacentHTML('afterbegin',workPanel('health',c))};
const workBaseDayModel=dayFocusModel;dayFocusModel=function(data,day,user,mine,idleDays){
 const model=workBaseDayModel(data,day,user,mine,idleDays);
 for(const row of workQueue(data,day,user,mine)){
  if(row.date<day)model.late.push(row);else{model.today.push(row);model.agenda.push(row)}
 }
 const sort=(a,b)=>Number(!!b.critical)-Number(!!a.critical)||a.date.localeCompare(b.date)||a.name.localeCompare(b.name,'pt-BR');
 model.late.sort(sort);model.today.sort(sort);return model;
};
const workBaseDayAction=dayFocusAction;dayFocusAction=function(row){return row.action==='work'?'workDetail('+[row.kind,row.id,row.taskId].map(x=>JSON.stringify(x)).join(',')+')':workBaseDayAction(row)};
const workBaseDayRow=dayFocusRow;dayFocusRow=function(row){if(row.action!=='work')return workBaseDayRow(row);return `<article class="focus-row"><span class="focus-row-icon">${polishIcon('alerts')}</span><div class="focus-row-copy"><div><strong>${esc(row.name)}</strong><span class="tag ${row.date<activationToday()?'late':'soon'}">${esc(row.label)}</span></div><p>${esc(row.note)}</p><small>${esc(row.extra)}</small></div><button onclick="${esc(dayFocusAction(row))}">Abrir ação</button></article>`};
