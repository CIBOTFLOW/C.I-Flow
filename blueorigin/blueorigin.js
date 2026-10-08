(function(){
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

 // Partner intelligence console
 const table=document.getElementById('partnerTable');
 const graphic=document.getElementById('partnerGraphic');
 if(table&&graphic){
   let data=[],filter='all';
   const search=document.getElementById('partnerSearch');
   function card(a){
     return '<article class="partner-card"><div class="score-ring" style="--score:'+a.score+'"><b>'+a.score+'</b></div><div><span>'+esc(a.status)+'</span><strong>'+esc(a.name)+'</strong><small>'+esc(a.program)+' · '+esc(a.deal)+'</small></div></article>';
   }
   function row(a){
     const src=a.source?'<a class="source-link" target="_blank" rel="noopener" href="'+esc(a.source)+'">Source</a>':'Notes / thesis';
     return '<div class="research-row">'+
      '<div><span class="acct-name">'+esc(a.name)+'</span><span class="acct-status">'+esc(a.status)+'</span></div>'+
      '<div>'+esc(a.category)+'</div><div>'+esc(a.program)+'</div><div>'+esc(a.deal)+'</div>'+
      '<div><b>'+a.score+'</b><div class="mini-bar"><i style="width:'+a.score+'%"></i></div></div>'+
      '<div><span class="risk '+a.risk.toLowerCase()+'">'+esc(a.risk)+'</span></div>'+
      '<div>'+esc(a.thesis)+'</div><div>'+esc(a.signal)+'<br>'+src+'</div></div>';
   }
   function render(){
     const q=(search?.value||'').trim().toLowerCase();
     let rows=data.filter(a=>{
       const ok=filter==='all'||(filter==='public'&&a.status==='Public relationship')||(filter==='proposed'&&a.status!=='Public relationship')||(filter==='jv'&&a.deal.includes('JV'))||(filter==='launch'&&a.program.includes('New Glenn'))||(filter==='leo'&&(a.program.includes('LEO')||a.program.includes('Orbital Reef')))||(filter==='lunar'&&(a.program.includes('Blue Moon')||a.program.includes('Blue Alchemist')||a.program.includes('Exploration')));
       const match=!q||JSON.stringify(a).toLowerCase().includes(q);
       return ok&&match;
     }).sort((a,b)=>b.score-a.score);
     graphic.innerHTML=rows.slice(0,12).map(card).join('');
     table.querySelectorAll('.research-row:not(.head),.empty-row').forEach(x=>x.remove());
     table.insertAdjacentHTML('beforeend',rows.map(row).join('')||'<div class="empty-row">No accounts match this filter.</div>');
     const meta=document.getElementById('partnerMeta');if(meta)meta.textContent=rows.length+' accounts shown';
   }
   fetch('/blueorigin/accounts.json').then(r=>r.json()).then(d=>{data=d.accounts||[];render();});
   search?.addEventListener('input',render);
   document.querySelectorAll('[data-partner-filter]').forEach(btn=>btn.addEventListener('click',()=>{
     document.querySelectorAll('[data-partner-filter]').forEach(x=>x.classList.remove('active'));
     btn.classList.add('active');filter=btn.dataset.partnerFilter;render();
   }));
 }

 // Deal structurer
 const choices=[...document.querySelectorAll('[data-struct-group]')];
 const output=document.querySelector('[data-struct-output]');
 function updateStruct(){
   if(!output)return;
   const picked={};
   choices.filter(x=>x.classList.contains('active')).forEach(x=>picked[x.dataset.structGroup]=x.dataset.value);
   let rec='Commercial Partnership',terms=['MSA','Volume commitment','Milestones','Pricing'];
   let rationale='Use when the main objective is demand, capacity or services without shared ownership of an asset.';
   if(picked.need==='shared_asset'||picked.control==='shared'){rec='JV / SPV';terms=['Capital contribution','Governance','Background IP','Foreground IP','Exit rights','Milestones'];rationale='Use when both sides contribute material capital, IP or operating capability to a shared commercial asset.';}
   else if(picked.need==='technology'||picked.need==='development'){rec='Co-Development Agreement';terms=['Development funding','Technical gates','Field-of-use IP','Milestones','Commercialization rights'];rationale='Use when the strategic value comes from jointly creating a capability before monetization.';}
   else if(picked.need==='anchor'||picked.capital==='high'){rec='Partner-Linked Financial Agreement';terms=['Non-cancellable commitment','Deposit','Warrant / option','Vesting tranches','Volume thresholds','Performance gates'];rationale='Use when Blue Origin needs an anchor commitment or capital contribution and the partner should earn upside only as milestones are achieved.';}
   output.querySelector('h3').textContent=rec;output.querySelector('p').textContent=rationale;
   output.querySelector('.terms').innerHTML=terms.map(t=>'<span>'+t+'</span>').join('');
 }
 choices.forEach(btn=>btn.addEventListener('click',()=>{
   const g=btn.dataset.structGroup;choices.filter(x=>x.dataset.structGroup===g).forEach(x=>x.classList.remove('active'));btn.classList.add('active');updateStruct();
 }));
 updateStruct();
})();