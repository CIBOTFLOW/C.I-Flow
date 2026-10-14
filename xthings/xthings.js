(function(){
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],zh=document.documentElement.lang.toLowerCase().startsWith('zh');
 qa('.iq-tab').forEach(tab=>tab.addEventListener('click',()=>{qa('.iq-tab').forEach(x=>x.classList.remove('active'));qa('.iq-panel').forEach(x=>x.classList.remove('active'));tab.classList.add('active');q('#'+tab.dataset.target)?.classList.add('active');}));
 function calc(panel){
  const out=panel.querySelector('.iq-result');if(!out)return;
  const groups={};panel.querySelectorAll('.iq-choice.active').forEach(x=>groups[x.dataset.group]=Number(x.dataset.score||0));
  const total=Object.values(groups).reduce((a,b)=>a+b,0);
  let label=zh?'继续研究':'Research more',note=zh?'在匹配度、杠杆或时机改善前，不要过度投入。':'Do not over-invest until fit, leverage or timing improves.';
  if(total>=80){label=zh?'优先推进':'Priority now';note=zh?'投入高管/现场关注，并明确下一个商业验证点。':'Invest executive / field attention and define the next commercial proof point.';}
  else if(total>=60){label=zh?'合格':'Qualified';note=zh?'以明确下一步继续推进，同时补齐剩余证据缺口。':'Advance with a clear next step, but close the remaining evidence gaps.';}
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
       else if(filter==='National')ok=/united states|north america|all 50|nationwide|national|全美|美国|北美/i.test(p.region+' '+p.evidence);
       else if(filter==='Integrator')ok=/integrator|security|集成商|安防/i.test(p.category);
       else if(filter==='Specifier')ok=/design|consult|building automation|building technology|设计|顾问|楼宇/i.test(p.category);
       return ok&&(!term||blob.includes(term));
     });
     pTable.querySelectorAll('.partner-intel-row:not(.head),.partner-loading').forEach(x=>x.remove());
     pTable.insertAdjacentHTML('beforeend',show.map(p=>'<div class="partner-intel-row"><div><b>'+esc(p.name)+'</b><small>'+esc(p.priority)+'</small></div><div>'+esc(p.region)+'</div><div>'+esc(p.category)+'</div><div><span class="partner-score">'+p.score+'</span><small>R '+p.reach+' · T '+p.tech+' · L '+p.leverage+' · F '+p.fit+'</small></div><div>'+esc(p.evidence)+'</div><div>'+esc(p.motion)+'</div><div><a target="_blank" rel="noopener" href="'+esc(p.source)+'">'+(zh?'公开来源':'Public source')+'</a></div></div>').join('')||'<div class="partner-loading">'+(zh?'没有匹配的伙伴。':'No partners match this view.')+'</div>');
   }
   fetch(zh?'/xthings/partners-zh.json':'/xthings/partners.json').then(r=>r.json()).then(d=>{
     rows=d.partners||[];
     const c=q('#partnerCount'),t=q('#partnerTier1');if(c)c.textContent=rows.length;if(t)t.textContent=rows.filter(x=>x.priority==='Tier 1').length;
     renderPartners();
   });
   search?.addEventListener('input',renderPartners);
   qa('[data-pfilter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-pfilter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.pfilter;renderPartners();}));
 }
})();