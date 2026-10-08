(function(){
 const q=s=>document.querySelector(s);
 const qa=s=>[...document.querySelectorAll(s)];

 // Account IQ
 const acct=qa('[data-acct-group]'),acctOut=q('[data-acct-output]');
 function scoreAcct(){
  if(!acctOut)return;
  const vals={};acct.filter(x=>x.classList.contains('active')).forEach(x=>vals[x.dataset.acctGroup]=Number(x.dataset.score||0));
  const total=Object.values(vals).reduce((a,b)=>a+b,0);
  let label='Low priority',note='Do not force field time. Keep in nurture until economics or intent improves.';
  if(total>=80){label='Gold account';note='High-touch field motion. Build President / Treasurer alignment and move toward an audit + board presentation.';}
  else if(total>=60){label='Silver account';note='Good fit. Use scaled outreach and promote to high-touch once a trigger or response appears.';}
  acctOut.querySelector('strong').textContent=total+' / 100';acctOut.querySelector('h3').textContent=label;acctOut.querySelector('p').textContent=note;
 }
 acct.forEach(b=>b.addEventListener('click',()=>{acct.filter(x=>x.dataset.acctGroup===b.dataset.acctGroup).forEach(x=>x.classList.remove('active'));b.classList.add('active');scoreAcct();}));scoreAcct();

 // Lead IQ
 const lead=qa('[data-lead-group]'),leadOut=q('[data-lead-output]');
 function scoreLead(){
  if(!leadOut)return;
  const vals={};lead.filter(x=>x.classList.contains('active')).forEach(x=>vals[x.dataset.leadGroup]=Number(x.dataset.score||0));
  const total=Object.values(vals).reduce((a,b)=>a+b,0);
  let label='Nurture contact',note='Find a stronger board stakeholder or wait for clearer engagement.';
  if(total>=75){label='Priority contact',note='Direct phone + personal email + coffee or working session. Move toward operational audit.';}
  else if(total>=50){label='Relevant contact',note='Multi-touch sequence. Look for a warmer path to President or Treasurer.';}
  leadOut.querySelector('strong').textContent=total+' / 100';leadOut.querySelector('h3').textContent=label;leadOut.querySelector('p').textContent=note;
 }
 lead.forEach(b=>b.addEventListener('click',()=>{lead.filter(x=>x.dataset.leadGroup===b.dataset.leadGroup).forEach(x=>x.classList.remove('active'));b.classList.add('active');scoreLead();}));scoreLead();

 // ROI calculator
 const inputs=qa('[data-roi]'),roiOut=q('[data-roi-output]');
 function calcROI(){
  if(!roiOut)return;
  const v={};inputs.forEach(i=>v[i.dataset.roi]=Number(i.value||0));
  const current=v.units*v.current*12;
  const proposed=v.units*v.proposed*12;
  const feeSavings=current-proposed;
  const boardValue=v.hours*v.hourly*12;
  const total=feeSavings+boardValue;
  roiOut.querySelector('[data-total]').textContent='$'+Math.round(total).toLocaleString();
  roiOut.querySelector('[data-fees]').textContent='$'+Math.round(feeSavings).toLocaleString();
  roiOut.querySelector('[data-time]').textContent='$'+Math.round(boardValue).toLocaleString();
 }
 inputs.forEach(i=>i.addEventListener('input',calcROI));calcROI();


 // Pipeline Lab
 const targetTable=q('#targetTable'),partnerResearch=q('#partnerResearch');
 if(targetTable){
   let targets=[],filter='all';
   const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
   const search=q('#targetSearch');
   function renderTargets(){
     const term=(search?.value||'').toLowerCase().trim();
     const rows=targets.filter(a=>{
       const ok=filter==='all'||(filter==='A'&&a.priority==='A')||(filter==='managed'&&a.incumbent!=='Unknown')||(filter==='sanmateo'&&a.city==='San Mateo');
       return ok&&(!term||JSON.stringify(a).toLowerCase().includes(term));
     });
     targetTable.querySelectorAll('.target-row:not(.head),.empty-row').forEach(x=>x.remove());
     targetTable.insertAdjacentHTML('beforeend',rows.map(a=>'<div class="target-row"><div><b>'+esc(a.name)+'</b></div><div>'+esc(a.city)+'</div><div>'+(a.units??'Research')+'</div><div>'+esc(a.type)+'</div><div>'+esc(a.incumbent)+'</div><div><span class="priority '+a.priority.toLowerCase()+'">'+esc(a.priority)+'</span></div><div>'+esc(a.next)+'</div><div><a class="source-link" target="_blank" rel="noopener" href="'+esc(a.source)+'">Public source</a></div></div>').join('')||'<div class="empty-row">No public targets match this filter.</div>');
   }
   fetch('/assembly/pipeline-data.json').then(r=>r.json()).then(d=>{
     targets=d.targets||[];renderTargets();
     if(partnerResearch)partnerResearch.innerHTML=(d.referral_partners||[]).map(p=>'<article class="partner-item"><span>'+esc(p.category)+' · '+esc(p.area)+'</span><h3>'+esc(p.name)+'</h3><p>'+esc(p.why)+'</p><small>'+esc(p.contact)+'</small><a class="source-link" target="_blank" rel="noopener" href="'+esc(p.source)+'">Public source</a></article>').join('');
   });
   search?.addEventListener('input',renderTargets);
   qa('[data-target-filter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-target-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.targetFilter;renderTargets();}));
 }

 // CRM CSV reactivation importer
 const crmFile=q('#crmFile'),crmTable=q('#crmTable'),clearCrm=q('#clearCrm');
 function parseCSV(text){
   const rows=[];let row=[],field='',quote=false;
   for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
     if(c==='"'){if(quote&&n==='"'){field+='"';i++;}else quote=!quote;}
     else if(c===','&&!quote){row.push(field);field='';}
     else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&n==='\n')i++;row.push(field);field='';if(row.some(x=>x.trim()))rows.push(row);row=[];}
     else field+=c;
   } row.push(field);if(row.some(x=>x.trim()))rows.push(row);return rows;
 }
 function findCol(headers,names){const h=headers.map(x=>x.toLowerCase().trim());for(const n of names){const i=h.findIndex(x=>x.includes(n));if(i>=0)return i;}return -1;}
 function bucket(stage,status,reason,last){
   const s=(stage+' '+status+' '+reason).toLowerCase();
   if(/not now|timing|contract|renewal|budget|no decision|stalled|nurture|follow up/.test(s))return ['Reactivate now','hot','Re-score Account IQ, confirm current board / incumbent timing, and reopen with the original context.'];
   if(/lost|competitor|price|pricing/.test(s))return ['Research','research','Validate whether the original loss condition changed before spending field time.'];
   if(/unqualified|bad fit|too small|too large/.test(s))return ['Nurture','nurture','Re-check fit only if Assembly ICP, product scope or community conditions have materially changed.'];
   return ['Research','research','Review original notes, map the board, add a current trigger and assign a dated next action.'];
 }
 function renderCRM(records){
   if(!crmTable)return;
   crmTable.querySelectorAll('.pipeline-row:not(.head),.empty-row').forEach(x=>x.remove());
   let hot=0,nur=0,res=0;
   if(!records.length){crmTable.insertAdjacentHTML('beforeend','<div class="empty-row">Import a CRM CSV to populate the reactivation queue.</div>');}
   else crmTable.insertAdjacentHTML('beforeend',records.map(r=>{if(r.kind==='hot')hot++;else if(r.kind==='nurture')nur++;else res++;return '<div class="pipeline-row"><div><b>'+r.account+'</b></div><div>'+r.stage+'</div><div>'+r.reason+'</div><div>'+r.last+'</div><div><span class="bucket '+r.kind+'">'+r.bucket+'</span></div><div>'+r.next+'</div></div>';}).join(''));
   const set=(id,v)=>{const el=q(id);if(el)el.textContent=v;};set('#crmImported',records.length);set('#crmHot',hot);set('#crmNurture',nur);set('#crmResearch',res);
 }
 crmFile?.addEventListener('change',async e=>{
   const file=e.target.files?.[0];if(!file)return;const rows=parseCSV(await file.text());if(rows.length<2)return;
   const h=rows[0],ia=findCol(h,['account','company','community','hoa']),ic=findCol(h,['contact','name']),is=findCol(h,['stage']),ist=findCol(h,['status']),ir=findCol(h,['lost reason','reason']),il=findCol(h,['last activity','last touch','activity']);
   const records=rows.slice(1).map(row=>{const account=(ia>=0?row[ia]:'')||(ic>=0?row[ic]:'')||'Unnamed record';const stage=is>=0?row[is]:'';const status=ist>=0?row[ist]:'';const reason=ir>=0?row[ir]:status;const last=il>=0?row[il]:'';const b=bucket(stage,status,reason,last);return {account,stage:stage||status||'Unknown',reason:reason||'Review notes',last:last||'Unknown',bucket:b[0],kind:b[1],next:b[2]};});
   renderCRM(records);
 });
 clearCrm?.addEventListener('click',()=>{if(crmFile)crmFile.value='';renderCRM([]);});
})();