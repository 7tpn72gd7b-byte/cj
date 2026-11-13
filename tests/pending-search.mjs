import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
const code=await readFile('app/pending-search.js','utf8');
const ctx=vm.createContext({statusAlert:c=>c.alert||null,normalizeSearch:s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),dayDate:s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')?s:'',dayInterval:(a,b)=>(Date.parse(b)-Date.parse(a))/86400000,dayFocusModel:data=>({clients:data.clients,late:[{id:'a',kind:'client',action:'return',date:'2026-11-01',name:'A'}],today:[],idle:[],agenda:[]}),document:{addEventListener(){}},renderGlobalSearch(){},globalSearch(){},matchesSearch(){}});
vm.runInContext(code,ctx);
ctx.data={clients:[{id:'a',fantasy:'Farmácia São José',cnpj:'69.679.257/0001-18',owner:'Júlio Novais',ticket:'108123',nextContact:'2026-11-01',csWork:[{ticket:'99977'}],arrival:'2026-10-01'},{id:'b',fantasy:'Bela Vita',arrival:'2026-10-01'},{id:'c',fantasy:'Ativada',activationStatus:'Ativada',arrival:'2026-10-01'},{id:'d',fantasy:'Futura',arrival:'2026-12-01'}],events:[{clientId:'b',at:'2026-11-12'}],healthClients:[{id:'a',fantasy:'Outra Farmácia',cnpj:'69679257000118',reseller:'Revenda A',city:'Jales',contractStatus:'churn'}]};
for(const q of ['69679257000118','69.679.257/0001-18','julio novais','#108123','#99977','farmacia jose']){ctx.q=q;assert.equal(vm.runInContext('completeSearchMatch(data.clients[0],q)',ctx),true,q)}
assert.equal(vm.runInContext("globalSearchModel(data,'69679257000118').length",ctx),2);
assert.equal(vm.runInContext("globalSearchModel(data,'69679257000118','health')[0].kind",ctx),'health');
assert.equal(vm.runInContext("globalSearchModel(data,'jales')[0].client.contractStatus",ctx),'churn');
assert.equal(vm.runInContext("globalSearchModel(data,'').length",ctx),0);
assert.equal(vm.runInContext("globalSearchModel(data,'inexistente').length",ctx),0);
const before=JSON.stringify(ctx.data);vm.runInContext("model=dayFocusModel(data,'2026-11-13','Júlio',false,7)",ctx);
assert.equal(ctx.model.idle.length,1);assert.equal(ctx.model.all.length,1);assert.equal(ctx.model.all[0].action,'return');assert.equal(JSON.stringify(ctx.data),before);
assert.equal(vm.runInContext("pendingRows(model,'all','return').length",ctx),1);assert.equal(vm.runInContext("pendingRows(model,'all','work').length",ctx),0);
console.log('Pendências/busca: CNPJ formatado, acentos, proprietário, tickets, bases separadas, churn explícito, deduplicação e ausência de mutações OK.');

ctx.data.clients[0].alert={due:'2026-11-02'};vm.runInContext("model=dayFocusModel(data,'2026-11-13','Júlio',false,7)",ctx);assert.equal(vm.runInContext("pendingRows(model,'all','followup').length",ctx),1);assert.equal(vm.runInContext("pendingRows(model,'all','return').length",ctx),1);
