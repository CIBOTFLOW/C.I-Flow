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

})();