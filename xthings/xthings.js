(function(){
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 qa('.iq-tab').forEach(tab=>tab.addEventListener('click',()=>{qa('.iq-tab').forEach(x=>x.classList.remove('active'));qa('.iq-panel').forEach(x=>x.classList.remove('active'));tab.classList.add('active');q('#'+tab.dataset.target)?.classList.add('active');}));
 function calc(panel){
  const out=panel.querySelector('.iq-result');if(!out)return;
  const groups={};panel.querySelectorAll('.iq-choice.active').forEach(x=>groups[x.dataset.group]=Number(x.dataset.score||0));
  const total=Object.values(groups).reduce((a,b)=>a+b,0);
  let label='Research more',note='Do not over-invest until fit, leverage or timing improves.';
  if(total>=80){label='Priority now';note='Invest executive / field attention and define the next commercial proof point.';}
  else if(total>=60){label='Qualified';note='Advance with a clear next step, but close the remaining evidence gaps.';}
  out.querySelector('strong').textContent=total+' / 100';out.querySelector('h3').textContent=label;out.querySelector('p').textContent=note;
 }
 qa('.iq-panel').forEach(panel=>{panel.querySelectorAll('.iq-choice').forEach(btn=>btn.addEventListener('click',()=>{panel.querySelectorAll('.iq-choice[data-group="'+btn.dataset.group+'"]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');calc(panel);}));calc(panel);});

 // Nationwide Partner IQ research
 const pTable=q('#partnerIntelTable');
 if(pTable){
   let rows=[],filter='all';
   const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
   const search=q('#partnerSearch');
   function renderPartners(){
     const term=(search?.value||'').toLowerCase().trim();
     const show=rows.filter(p=>{
       const blob=(p.name+' '+p.category+' '+p.region+' '+p.evidence+' '+p.motion).toLowerCase();
       let ok=true;
       if(filter==='Tier 1')ok=p.priority==='Tier 1';
       else if(filter==='National')ok=/united states|north america|all 50|nationwide|national/i.test(p.region+' '+p.evidence);
       else if(filter==='Integrator')ok=/integrator|security/i.test(p.category);
       else if(filter==='Specifier')ok=/design|consult|building automation|building technology/i.test(p.category);
       return ok&&(!term||blob.includes(term));
     });
     pTable.querySelectorAll('.partner-intel-row:not(.head),.partner-loading').forEach(x=>x.remove());
     pTable.insertAdjacentHTML('beforeend',show.map(p=>'<div class="partner-intel-row"><div><b>'+esc(p.name)+'</b><small>'+esc(p.priority)+'</small></div><div>'+esc(p.region)+'</div><div>'+esc(p.category)+'</div><div><span class="partner-score">'+p.score+'</span><small>R '+p.reach+' · T '+p.tech+' · L '+p.leverage+' · F '+p.fit+'</small></div><div>'+esc(p.evidence)+'</div><div>'+esc(p.motion)+'</div><div><a target="_blank" rel="noopener" href="'+esc(p.source)+'">Public source</a></div></div>').join('')||'<div class="partner-loading">No partners match this view.</div>');
   }
   fetch('/xthings/partners.json').then(r=>r.json()).then(d=>{
     rows=d.partners||[];
     const c=q('#partnerCount'),t=q('#partnerTier1');if(c)c.textContent=rows.length;if(t)t.textContent=rows.filter(x=>x.priority==='Tier 1').length;
     renderPartners();
   });
   search?.addEventListener('input',renderPartners);
   qa('[data-pfilter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-pfilter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.pfilter;renderPartners();}));
 }
})();