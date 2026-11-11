// Kanban usa as mesmas datas e a mesma base compartilhada da carteira.
const kanbanStages=[['contract','Aguardando contrato'],['signature','Aguardando assinatura'],['ready','Aguardando implantação'],['implementation','Em implantação'],['activated','Carteira ativada']];
const kanbanDateFields=['contractPortal','contractSigned','implementation','activationDate'];
function kanbanStage(c){return c.activationStatus==='Ativada'?4:c.implementation||c.implementationConfirmed?3:c.contractSigned?2:c.contractPortal?1:0}
function kanbanSince(c){return [c.arrival,c.contractPortal,c.contractSigned,c.implementation,c.activationDate][kanbanStage(c)]||''}
function kanbanElapsed(c,day){let since=kanbanSince(c);return !dayDate(since)?'Data não informada':since>day?'Data futura':Math.round((Date.parse(day+'T12:00:00Z')-Date.parse(since+'T12:00:00Z'))/86400000)+' dias nesta etapa'}
function kanbanRows(data,filters,user){return (data.clients||[]).filter(c=>matchesSearch(c,filters.query||'')&&(!filters.owner||filters.owner==='__mine__'&&normalizeSearch(c.responsible)===normalizeSearch(user)||filters.owner==='__none__'&&!c.responsible||c.responsible===filters.owner)&&(kanbanStage(c)!==4||!filters.month||String(c.activationDate||'').startsWith(filters.month))).slice().sort((a,b)=>String(kanbanSince(a)||'9999').localeCompare(String(kanbanSince(b)||'9999'))||String(a.fantasy).localeCompare(String(b.fantasy),'pt-BR'))}
function kanbanTransition(c,target,values,day){
 const from=kanbanStage(c);if(!Number.isInteger(target)||target<=from||target>4)return {error:'Arraste para uma etapa seguinte. Para corrigir etapas anteriores, edite as datas do cadastro.'};
 const next={...c};
 // Apenas datas realmente informadas: não inventar marcos antigos ao pular colunas.
 for(let i=0;i<target;i++){const key=kanbanDateFields[i];if(key==='activationDate')next[key]=day;else if(!next[key])next[key]=String(values[key]||'').trim();if(!dayDate(next[key]))return {error:'Informe uma data válida para '+labels[key]+'.'};if(next[key]>day)return {error:labels[key]+': use a data em que a etapa aconteceu, até hoje.'}}
 const issue=clientDateMessage(next);if(issue)return {error:issue};
 for(const [a,b]of [['arrival','contractPortal'],['contractPortal','contractSigned'],['contractSigned','implementation'],['implementation','activationDate']])if(next[a]&&next[b]&&next[b]<next[a])return {error:labels[b]+' não pode ser anterior a '+labels[a]+'.'};
 if(target===4){const ticket=String(values.activationTicket||'').trim();if(!ticket||ticket.length>100)return {error:'Informe o ticket de ativação, com até 100 caracteres.'};next.activationTicket=ticket;next.activationStatus='Ativada';next.postActivation=true;captureActivationSeller(next,c)}
 next.stage=automaticStage(next);return {data:next};
}
let kanbanQuery=preferences.kanbanQuery||'',kanbanOwner=preferences.kanbanOwner||'',kanbanMonth=preferences.kanbanMonth??activationToday().slice(0,7),kanbanClient='',kanbanDragging='',kanbanMoveSnapshot='';
let kanbanBoardPosition={x:0,ys:[]};
function rememberKanbanPosition(){const board=$('kanbanBoard');if(board)kanbanBoardPosition={x:board.scrollLeft,ys:[...board.querySelectorAll('.kanban-stack')].map(el=>el.scrollTop)}}
function persistKanbanFilters(){preferences.kanbanQuery=kanbanQuery;preferences.kanbanOwner=kanbanOwner;preferences.kanbanMonth=kanbanMonth;persistPreferences()}
function kanbanNav(){if($('nav-kanban')){$('nav-kanban').classList.toggle('active',current==='kanban');return}let b=document.createElement('button');b.id='nav-kanban';b.type='button';b.onclick=()=>go('kanban');b.innerHTML='<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M6 7v5M12 7v8M18 7v3"/></svg><span>Kanban</span>';$('nav-alerts').before(b);b.classList.toggle('active',current==='kanban')}
function kanbanOwnerOptions(){let owners=[...new Set(db.clients.map(c=>c.responsible).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));if(kanbanOwner&&!['__mine__','__none__'].includes(kanbanOwner)&&!owners.includes(kanbanOwner))owners.push(kanbanOwner);return [['','Todos os responsáveis'],['__mine__','Minha carteira'],['__none__','Sem responsável'],...owners.map(o=>[o,o])].map(([v,l])=>'<option value="'+esc(v)+'" '+(kanbanOwner===v?'selected':'')+'>'+esc(l)+'</option>').join('')}
function renderKanban(){
 rememberKanbanPosition();
 $('view').classList.remove('clients-workspace-view');$('pageTitle').textContent='Kanban';$('subtitle').textContent='Acompanhe os clientes em cada etapa';
 $('view').innerHTML='<div class="kanban-toolbar"><div class="kanban-search"><label class="sr-only" for="kanbanSearch">Buscar cliente ou CNPJ</label><input id="kanbanSearch" type="search" placeholder="Buscar cliente ou CNPJ" value="'+esc(kanbanQuery)+'" oninput="kanbanQuery=this.value;updateKanban()"></div><label class="sr-only" for="kanbanOwner">Responsável</label><select id="kanbanOwner" aria-label="Responsável do Kanban" onchange="kanbanOwner=this.value;updateKanban()">'+kanbanOwnerOptions()+'</select><button class="secondary" aria-pressed="'+(kanbanOwner==='__mine__')+'" onclick="kanbanOwner=kanbanOwner===\'__mine__\'?\'\':\'__mine__\';$(\'kanbanOwner\').value=kanbanOwner;updateKanban()">Minha carteira</button><div class="kanban-month"><label for="kanbanMonth">Ativações no mês</label><input id="kanbanMonth" aria-label="Mês das ativações no Kanban" type="month" value="'+esc(kanbanMonth)+'" onchange="kanbanMonth=this.value;updateKanban()"></div><button class="text-button" onclick="clearKanbanFilters()">Limpar filtros</button></div><div class="kanban-intro"><span>Arraste para avançar · Clique no nome para abrir a ficha</span><small>O mês filtra somente as carteiras ativadas. Sem mês, mostra todas.</small></div><div id="kanbanStatus" class="sr-only" role="status" aria-live="polite"></div><div id="clientWorkspace" class="kanban-workspace"><div id="kanbanBoard" class="kanban-board" aria-label="Processos dos clientes"></div><section id="clientSidePanel" class="client-side-panel" aria-labelledby="clientPaneTitle" hidden></section></div>';
 updateKanban();
}
function clearKanbanFilters(){kanbanQuery=kanbanOwner=kanbanMonth='';persistKanbanFilters();renderKanban()}
function kanbanCard(c,stage){
 const key=esc(JSON.stringify(c.id)),name=c.responsible||'Sem responsável',initial=name==='Sem responsável'?'—':name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join('').toUpperCase();
 let action,style='',call;
 if(stage===4){action='Ativada em '+fmt(c.activationDate);style='activated';call=workAction('detail',c.id)}
 else if(stage<3){action=['Lançar contrato','Acompanhar assinatura','Confirmar início'][stage];call=workAction('kanbanMove',c.id,stage+1)}
 else{const step=clientNextStep(c);action=step.label+(step.date?' · '+clientStepDate(step.date):'');style=step.date&&step.date<activationToday()?'late':step.date===activationToday()?'today':'';call=step.call}
 return '<article class="kanban-card '+(kanbanClient===c.id?'selected':'')+'" data-kanban-id="'+esc(c.id)+'" draggable="'+(stage<4)+'" ondragstart="kanbanDragStart(event,'+key+')" ondragend="kanbanDragEnd()"><div class="kanban-card-heading"><button class="kanban-card-name" onclick="detail('+key+')">'+esc(c.fantasy)+'</button>'+(stage<4?'<button class="kanban-drag-handle" aria-label="Mover '+esc(c.fantasy)+' para outra etapa" title="Arraste o cartão ou clique para mover" onpointerdown="kanbanPointerStart(event,'+key+')" onclick="if(event.detail===0)kanbanMove('+key+')">⠿</button>':'')+'</div><p class="kanban-owner"><span aria-hidden="true">'+esc(initial)+'</span><small>Responsável: '+esc(name)+'</small></p>'+(stage<4?'<p class="kanban-elapsed">'+dayIcon('clock')+esc(kanbanElapsed(c,activationToday()))+'</p>':'')+'<button class="kanban-card-action '+style+'" onclick="'+call+'">'+dayIcon(stage===4?'check':style?'clock':'note')+'<span>'+esc(action)+'</span></button></article>';
}
function updateKanban(){
 persistKanbanFilters();const board=$('kanbanBoard');if(!board)return;const x=board.children.length?board.scrollLeft:kanbanBoardPosition.x,scrolls=board.children.length?[...board.querySelectorAll('.kanban-stack')].map(el=>el.scrollTop):kanbanBoardPosition.ys,rows=kanbanRows(db,{query:kanbanQuery,owner:kanbanOwner,month:kanbanMonth},db.user);
 board.innerHTML=kanbanStages.map(([key,label],i)=>{let cards=rows.filter(c=>kanbanStage(c)===i);return '<section class="kanban-column kanban-'+key+'" data-kanban-stage="'+i+'" aria-label="'+label+'" ondragover="kanbanDragOver(event,'+i+')" ondragleave="kanbanDragLeave(event)" ondrop="kanbanDrop(event,'+i+')"><h2>'+label+'<span>'+cards.length+'</span></h2><div class="kanban-stack">'+(cards.map(c=>kanbanCard(c,i)).join('')||'<p class="kanban-empty">Nenhum cliente nesta etapa</p>')+'</div></section>'}).join('');
 board.scrollLeft=x;board.querySelectorAll('.kanban-stack').forEach((el,i)=>el.scrollTop=scrolls[i]||0);$('kanbanStatus').textContent=rows.length+' clientes no quadro.';
 document.querySelector('.kanban-toolbar button[aria-pressed]')?.setAttribute('aria-pressed',String(kanbanOwner==='__mine__'));
 if($('kanbanOwner'))$('kanbanOwner').value=kanbanOwner;
 if(kanbanClient&&rows.some(c=>c.id===kanbanClient))renderClientPane(kanbanClient);else if(kanbanClient){kanbanClient='';closeClientPane(false)}
}
function kanbanMove(id,target=null){
 const c=db.clients.find(c=>c.id===id);if(!c)return;const from=kanbanStage(c);if(from===4){toast('Esta carteira já está ativada. Para correções, edite o cadastro.');return}
 if(target===null)target=from+1;
 if(!Number.isInteger(target)||target<=from||target>4){toast('Avance para uma etapa seguinte. Para corrigir etapas anteriores, edite o cadastro.');return}
 kanbanMoveSnapshot=JSON.stringify(c);
 openDialog('Avançar cliente', '<form id="kanbanMoveForm" onsubmit="saveKanbanMove(event,'+esc(JSON.stringify(id))+')"><p><strong>'+esc(c.fantasy)+'</strong></p><label for="kanbanTarget">Etapa de destino</label><select id="kanbanTarget" name="target" onchange="kanbanMoveFields('+esc(JSON.stringify(id))+')">'+kanbanStages.map(([,l],i)=>i>from?'<option value="'+i+'" '+(i===target?'selected':'')+'>'+l+'</option>':'').join('')+'</select><div id="kanbanMoveFields"></div><p class="hint">Informe quando cada etapa aconteceu. O cadastro e o Kanban serão atualizados juntos somente após a confirmação.</p><p id="kanbanMoveError" class="error" role="alert"></p><div class="actions"><button type="submit">Confirmar avanço</button><button type="button" class="secondary" onclick="closeModal()">Cancelar</button></div></form>');kanbanMoveFields(id);
}
function kanbanMoveFields(id){
 const c=db.clients.find(c=>c.id===id),box=$('kanbanMoveFields'),form=$('kanbanMoveForm');if(!c||!box||!form)return;
 const values=Object.fromEntries(new FormData(form)),target=Number(form.elements.target.value);
 box.innerHTML=kanbanDateFields.slice(0,target).filter(key=>!c[key]||key==='activationDate').map(key=>field(key,labels[key],'date',key==='activationDate'?activationToday():values[key]||activationToday(),'required max="'+activationToday()+'"'+(key==='activationDate'?' readonly':''))).join('')+(target===4?field('activationTicket','Ticket de ativação','text',values.activationTicket||c.activationTicket||'','required maxlength="100"'):'');
 // As opções são parte do mesmo rascunho; não redefinir a proteção ao trocar o destino.
}
function saveKanbanMove(event,id){
 event.preventDefault();const c=db.clients.find(c=>c.id===id),form=event.target,error=$('kanbanMoveError');
 if(!c||JSON.stringify(c)!==kanbanMoveSnapshot){error.textContent='O cadastro mudou enquanto a confirmação estava aberta. Feche e tente novamente.';return}
 if(cloudConflict){error.textContent='Resolva o conflito de sincronização antes de avançar a etapa.';return}
 const values=Object.fromEntries(new FormData(form)),target=Number(values.target),result=kanbanTransition(c,target,values,activationToday());if(result.error){error.textContent=result.error;return}
 const before=JSON.stringify(db),changes=Object.keys(result.data).filter(k=>JSON.stringify(c[k])!==JSON.stringify(result.data[k]));
 Object.assign(c,result.data);record(id,target===4?'Carteira ativada':'Etapa avançada no Kanban',kanbanStages[target][1]+' · '+changes.map(k=>(labels[k]||k)+': '+(dateFields.includes(k)?fmt(c[k]):typeof c[k]==='boolean'?(c[k]?'Sim':'Não'):c[k])).join(' · '));
 try{save()}catch(e){db=JSON.parse(before);error.textContent='Não foi possível salvar. Tente novamente.';return}
 kanbanClient=id;closeModal();render();toast('Etapa atualizada no cadastro e no Kanban.');
}
function kanbanDragStart(event,id){if(kanbanPointer){event.preventDefault();return}const c=db.clients.find(c=>c.id===id);if(!c||kanbanStage(c)===4){event.preventDefault();return}kanbanDragging=id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id);event.currentTarget.classList.add('dragging')}
function kanbanDragEnd(){kanbanDragging='';document.querySelectorAll('.kanban-column.drop-ready,.kanban-card.dragging').forEach(el=>el.classList.remove('drop-ready','dragging'))}
function kanbanDragOver(event,target){let c=db.clients.find(c=>c.id===kanbanDragging);if(c&&target>kanbanStage(c)){event.preventDefault();event.dataTransfer.dropEffect='move';event.currentTarget.classList.add('drop-ready')}}
function kanbanDragLeave(event){if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.classList.remove('drop-ready')}
function kanbanDrop(event,target){event.preventDefault();const id=kanbanDragging;kanbanDragEnd();if(id)kanbanMove(id,target)}
const kanbanOriginalDetail=detail;detail=function(id){if(current==='kanban'&&$('clientSidePanel')){kanbanClient=id;updateKanban();renderClientPane(id,true);return}kanbanOriginalDetail(id)};
const kanbanOriginalClosePane=closeClientPane;closeClientPane=function(focus=true){if(current==='kanban'){const id=kanbanClient;kanbanClient='';kanbanOriginalClosePane(false);document.querySelectorAll('.kanban-card.selected').forEach(el=>el.classList.remove('selected'));if(focus)[...document.querySelectorAll('.kanban-card')].find(el=>el.dataset.kanbanId===id)?.querySelector('button')?.focus({preventScroll:true});return}kanbanOriginalClosePane(focus)};
const kanbanOriginalRender=render;render=function(){rememberKanbanPosition();kanbanNav();if(current==='kanban'){scriptsNav();renderKanban();layoutNavigation();renderAccountTopbar();return}kanbanOriginalRender()};
window.addEventListener('DOMContentLoaded',kanbanNav);

// Alça com Pointer Events: mouse e toque; botão também funciona pelo teclado.
let kanbanPointer=null;
function kanbanPointerStart(event,id){
 if(event.button!==0||kanbanPointer)return;const card=event.currentTarget.closest('.kanban-card'),c=db.clients.find(c=>c.id===id);if(!card||!c||kanbanStage(c)===4)return;
 event.preventDefault();const handle=event.currentTarget;
 kanbanPointer={id,from:kanbanStage(c),handle,card,pointerId:event.pointerId,x:event.clientX,y:event.clientY,moved:false,target:-1,ghost:null};
 handle.setPointerCapture(event.pointerId);handle.addEventListener('pointermove',kanbanPointerMove);handle.addEventListener('pointerup',kanbanPointerEnd);handle.addEventListener('pointercancel',kanbanPointerCancel);
}
function kanbanPointerMove(event){
 const p=kanbanPointer;if(!p||p.pointerId!==event.pointerId)return;
 if(!p.moved&&Math.hypot(event.clientX-p.x,event.clientY-p.y)<6)return;
 if(!p.moved){p.moved=true;const rect=p.card.getBoundingClientRect();p.ghost=p.card.cloneNode(true);p.ghost.className='kanban-card kanban-drag-preview';p.ghost.setAttribute('aria-hidden','true');p.ghost.removeAttribute('draggable');p.ghost.style.width=rect.width+'px';document.body.append(p.ghost);p.card.classList.add('dragging')}
 event.preventDefault();p.ghost.style.left=event.clientX+12+'px';p.ghost.style.top=event.clientY+12+'px';
 const board=$('kanbanBoard'),rect=board?.getBoundingClientRect();if(rect&&event.clientY>=rect.top&&event.clientY<=rect.bottom){if(event.clientX>rect.right-30)board.scrollLeft+=16;else if(event.clientX<rect.left+30)board.scrollLeft-=16}
 const col=document.elementFromPoint(event.clientX,event.clientY)?.closest('.kanban-column');p.target=col?Number(col.dataset.kanbanStage):-1;
 document.querySelectorAll('.kanban-column').forEach(el=>el.classList.toggle('drop-ready',el===col&&p.target>p.from));
}
function kanbanPointerClean(){const p=kanbanPointer;if(!p)return null;kanbanPointer=null;p.ghost?.remove();p.card.classList.remove('dragging');document.querySelectorAll('.kanban-column.drop-ready').forEach(el=>el.classList.remove('drop-ready'));p.handle.removeEventListener('pointermove',kanbanPointerMove);p.handle.removeEventListener('pointerup',kanbanPointerEnd);p.handle.removeEventListener('pointercancel',kanbanPointerCancel);if(p.handle.hasPointerCapture(p.pointerId))p.handle.releasePointerCapture(p.pointerId);return p}
function kanbanPointerEnd(event){if(kanbanPointer?.pointerId!==event.pointerId)return;const p=kanbanPointerClean();if(!p)return;if(!p.moved)kanbanMove(p.id);else if(p.target>p.from)kanbanMove(p.id,p.target);else toast('Solte em uma etapa seguinte para avançar.');}
function kanbanPointerCancel(){kanbanPointerClean()}
