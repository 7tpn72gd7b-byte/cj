// Layout da carteira: mesma base e mesmos comandos de gravação.
let clientPaneId='',clientPaneDismissed=false;
function clientNextStep(c){
 const a=statusAlert(c),w=nextCustomerWork(c),tasks=[c.nextContact?{label:c.nextContactNote||'Retorno agendado',date:c.nextContact,call:workAction('returnForm',c.id)}:null,a?{label:'Acompanhar implantação',date:a.due,call:workAction('followupForm',c.id)}:null,w?{label:w.title,date:w.due,call:workAction('workDetail','client',c.id,w.id)}:null].filter(Boolean).sort((a,b)=>a.date.localeCompare(b.date));
 return tasks[0]||{label:nextAction(c),date:'',call:workAction('noteForm',c.id)};
}
function clientStepDate(date){return !date?'':date===activationToday()?'Hoje':date===datePlus(activationToday(),1)?'Amanhã':fmt(date)}
function layoutMetrics(){return '<div class="layout-metrics">'+[['implementation','Em implantação',db.clients.filter(c=>clientCategory(c).split(' ').includes('implementation')).length],['clock','Follow-ups vencidos/hoje',db.clients.filter(c=>statusAlert(c)?.d<=0).length],['activation','Ativações de carteira',db.clients.filter(c=>c.activationStatus==='Ativada').length]].map(([key,label,count])=>'<div class="layout-metric"><span class="metric-icon metric-'+key+'">'+dayIcon(key)+'</span><div><span>'+label+'</span><strong>'+count+'</strong></div></div>').join('')+'</div>'}
function compactJourney(c){
 const steps=[['Chegada',!!c.arrival],['Contrato',!!c.contractSigned],['Implantação',!!(c.implementation||c.implementationConfirmed)],['Ativação',c.activationStatus==='Ativada']];
 let active=c.activationStatus==='Ativada'?3:c.implementation||c.implementationConfirmed?2:c.contractPortal?1:0;
 return '<ol class="compact-journey" aria-label="Etapas do cliente">'+steps.map(([label,done],i)=>'<li class="'+(i===active?'current':done?'done':'')+'"><span aria-hidden="true">'+(done&&i!==active?'✓':'')+'</span><small>'+label+'</small><span class="sr-only">'+(i===active?'Etapa atual':done?'Concluída':'Não registrada')+'</span></li>').join('')+'</ol>';
}
function layoutNavigation(){
 polishNavigation();let nav=document.querySelector('#app>aside>nav');if(!nav)return;
 nav.querySelectorAll('.nav-group-label').forEach(e=>e.remove());
 for(const [label,keys] of [['Rotina',['dashboard','clients','alerts']],['Gestão',['health','reports']],['Administração',['scripts','team','backup']],['',['account']]]){
  let items=keys.map(k=>$('nav-'+k)).filter(Boolean);if(!items.length)continue;
  if(label){let h=document.createElement('span');h.className='nav-group-label';h.textContent=label;nav.append(h)}
  items.forEach(b=>nav.append(b));
 }
 const scripts=$('nav-scripts');if(scripts)scripts.innerHTML=scriptsLockIcon()+'<span>Scripts</span>';
 $('nav-account')?.classList.add('nav-account-bottom');
 if(current==='clients'){$('pageTitle').textContent='Clientes';$('subtitle').textContent='Acompanhe cada etapa da sua carteira'}else $('subtitle').textContent='Acompanhamento de ponta a ponta';
}
function closeClientPane(restoreFocus=true){clientPaneId='';clientPaneDismissed=true;listActiveClient='';$('clientWorkspace')?.classList.remove('has-client-pane');let pane=$('clientSidePanel');if(pane){pane.hidden=true;pane.innerHTML=''}document.querySelectorAll('#clientRows tr').forEach(r=>r.classList.remove('client-row-selected'));if(restoreFocus)$('clientRows')?.querySelector('button')?.focus({preventScroll:true})}
const layoutOriginalDetail=detail;
function renderClientPane(id,focus=false){
 const c=db.clients.find(c=>c.id===id),pane=$('clientSidePanel');if(!c||!pane)return;
 if($('modal').open){if(hasUnsavedDraft()){guardDraft(()=>renderClientPane(id,focus));return}closeModal()}
 if(!$('modal').open)$('modalBody').replaceChildren();
 clientPaneId=id;clientPaneDismissed=false;listActiveClient=id;
 // Reuse the complete existing ficha, including history, plans and permissions.
 let captured='',originalOpen=openDialog;
 try{openDialog=(title,body)=>{captured=body};layoutOriginalDetail(id)}finally{openDialog=originalOpen}
 const temp=document.createElement('template');temp.innerHTML=captured;
 const sheet=temp.content.querySelector('.client-sheet');if(!sheet)return;
 sheet.querySelectorAll('details').forEach(d=>{if(/^Treinamentos \(0\)/.test(d.querySelector('summary')?.textContent||''))d.remove()});
 sheet.querySelector('.client-sheet-meta')?.remove();sheet.querySelector('.client-sheet-summary')?.remove();
 const journey=sheet.querySelector('.journey');if(journey){const d=document.createElement('details');d.className='panel';d.innerHTML='<summary>Datas e prazos da jornada</summary>';journey.replaceWith(d);d.append(journey)}
 const work=sheet.querySelector('.cs-work-panel');if(work){const d=document.createElement('details');d.className='panel';d.innerHTML='<summary>Planos e encaminhamentos ('+customerWork(c).filter(t=>t.status==='open').length+')</summary>';work.replaceWith(d);d.append(work)}
 const contacts=[...sheet.querySelectorAll('.timeline')].find(el=>el.closest('section')?.querySelector('h3')?.textContent.includes('Histórico de contatos'));
 if(contacts&&contacts.children.length>2){const d=document.createElement('details');d.innerHTML='<summary>Ver contatos anteriores ('+(contacts.children.length-2)+')</summary>';[...contacts.children].slice(2).forEach(e=>d.append(e));contacts.append(d)}
 const step=clientNextStep(c),key=esc(JSON.stringify(id)),canActivate=clientCategory(c).split(' ').includes('implementation');
 pane.innerHTML='<div class="client-pane-heading"><h2 id="clientPaneTitle">'+esc(c.fantasy)+'</h2><button class="icon-button" aria-label="Fechar ficha do cliente" onclick="closeClientPane()">×</button></div>'+stageBadge(c.stage)+'<p class="client-pane-owner">'+polishIcon('account')+'Responsável: '+esc(c.responsible||'Não informado')+'</p>'+compactJourney(c)+'<button type="button" class="client-next-step" onclick="'+step.call+'"><span class="metric-icon">'+dayIcon('clock')+'</span><div><small>Próxima ação</small><strong>'+esc(step.label)+'</strong><span>'+esc([clientStepDate(step.date),c.responsible].filter(Boolean).join(' · '))+'</span></div></button><div class="client-pane-actions"><button onclick="noteForm('+key+')">Registrar contato</button>'+(canActivate?'<button class="secondary" onclick="activateWalletForm('+key+')">Ativar carteira</button>':'<button class="secondary" onclick="returnForm('+key+')">Agendar retorno</button>')+'</div><div class="client-pane-tools"><button class="text-button" onclick="openClient('+key+')">Editar cadastro</button><span id="clientSyncBadge" role="status">'+syncBadgeMarkup()+'</span></div>';
 // Contacts before secondary sections, as in the approved illustration.
 const contactSection=contacts?.closest('section');if(contactSection)sheet.prepend(contactSection);
 pane.append(sheet);pane.hidden=false;$('clientWorkspace').classList.add('has-client-pane');
 document.querySelectorAll('#clientRows tr[data-client-id]').forEach(r=>r.classList.toggle('client-row-selected',r.dataset.clientId===id));
 if(focus){pane.setAttribute('tabindex','-1');pane.focus({preventScroll:true});if(matchMedia('(max-width: 1100px)').matches)pane.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}
}
detail=function(id){if(current==='clients'&&$('clientSidePanel')){clientPaneId=id;renderClientRows(false);renderClientPane(id,true);return}layoutOriginalDetail(id)};
renderClientRows=function(refreshPane=true){
 if(!$('clientRows'))return;const cat=preferences.category,rows=visibleClients();
 $('clientHeads').innerHTML='<tr><th>Cliente</th><th>'+ (cat==='activation'?'Ativação':'Etapa')+'</th><th>'+(cat==='activation'?'Ticket / vendedor':'Próxima ação')+'</th><th><span class="sr-only">Ações</span></th></tr>';
 $('filterCount').innerHTML=filterSummaryMarkup(rows.length,rows.length===1?'cliente':'clientes',[['Busca',preferences.query],['Responsável CS',cat!=='activation'?(preferences.responsible==='__none__'?'Sem responsável':preferences.responsible):''],['Mês',cat==='activation'?displayFilterMonth(preferences.month):''],['Vendedor',cat==='activation'?(preferences.seller==='__none__'?'Não informado':preferences.seller):'']],'Mais antigos primeiro');
 $('clientRows').innerHTML=rows.map(c=>{const step=clientNextStep(c),key=esc(JSON.stringify(c.id));return '<tr data-client-id="'+esc(c.id)+'" class="'+(clientPaneId===c.id?'client-row-selected':'')+'"><td><button class="client-name-button" onclick="detail('+key+')">'+polishIcon('clients')+'<span><strong>'+esc(c.fantasy)+'</strong><small>CNPJ: '+esc(c.cnpj)+'</small></span></button></td><td>'+(cat==='activation'?'<span>'+fmt(c.activationDate)+'</span>':stageBadge(c.stage))+'</td><td>'+(cat==='activation'?'<strong>'+esc(c.activationTicket||'—')+'</strong><small class="cell-secondary">'+esc(activationSellerName(c))+'</small>':'<span class="client-row-next '+(step.date&&step.date<activationToday()?'overdue':'')+'">'+esc(step.label)+(step.date?' · '+esc(clientStepDate(step.date)):'')+'</span>')+'</td><td><details class="client-row-menu"><summary aria-label="Ações de '+esc(c.fantasy)+'">•••</summary><div><button onclick="detail('+key+')">Ver ficha</button><button onclick="noteForm('+key+')">Registrar contato</button>'+(clientCategory(c).split(' ').includes('implementation')?'<button onclick="activateWalletForm('+key+')">Ativar carteira</button>':'')+'<button onclick="openClient('+key+')">Editar cadastro</button></div></details></td></tr>'}).join('')||'<tr><td colspan="4" class="empty">Nenhum cliente encontrado. Ajuste os filtros ou cadastre um cliente.</td></tr>';
 if($('sellerSummary'))$('sellerSummary').innerHTML='';
 if(refreshPane&&$('clientSidePanel')){if(clientPaneId&&!rows.some(c=>c.id===clientPaneId))clientPaneId=rows[0]?.id||'';if(!clientPaneId&&!clientPaneDismissed)clientPaneId=rows[0]?.id||'';if(clientPaneId)renderClientPane(clientPaneId);else{let dismissed=clientPaneDismissed;closeClientPane(false);clientPaneDismissed=dismissed}}
};
const layoutOriginalClients=clients;
clients=function(){
 layoutOriginalClients();$('view').classList.add('clients-workspace-view');
 const tabs=$('view').querySelector('.client-tabs'),panel=$('view').querySelector('.client-panel');if(!tabs||!panel)return;
 const workspace=document.createElement('div');workspace.id='clientWorkspace';workspace.className='client-workspace';
 const list=document.createElement('div');list.className='client-list-column';list.innerHTML=layoutMetrics();list.append(tabs,panel);
 const pane=document.createElement('section');pane.id='clientSidePanel';pane.className='client-side-panel';pane.setAttribute('aria-labelledby','clientPaneTitle');pane.hidden=true;
 workspace.append(list,pane);$('view').replaceChildren(workspace);
 const toolbar=panel.querySelector('.client-toolbar');toolbar.querySelector('button[onclick*="preferences.responsible=db.user"]')?.remove();
 const search=$('search');search.placeholder='Buscar nome, CNPJ ou ticket';
 renderClientRows();layoutNavigation();
};
const layoutOriginalRender=render;render=function(){if(current!=='clients')$('view').classList.remove('clients-workspace-view');layoutOriginalRender();layoutNavigation()};
window.addEventListener('DOMContentLoaded',layoutNavigation);
// Fechar menus de linha ao escolher uma ação e ao clicar fora.
document.addEventListener('click',e=>{document.querySelectorAll('.client-row-menu[open]').forEach(d=>{if(!d.contains(e.target)||e.target.closest('button'))d.open=false})});
