(function(){
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

 // Partner intelligence console
 const table=document.getElementById('partnerTable');
 const graphic=document.getElementById('partnerGraphic');
 if(table&&graphic){
   let data=[],filter='all';
   const search=document.getElementById('partnerSearch');
   const brief=document.getElementById('partnerBrief');
   const maxes={strategic:25,application:20,economics:20,riskShare:15,readiness:10,timing:10};
   const labels={strategic:'Strategic fit',application:'Application value',economics:'Economic contribution',riskShare:'Risk sharing',readiness:'Execution readiness',timing:'Intent + timing'};
   function card(a){
     return '<article class="partner-card" data-account="'+esc(a.name)+'"><div class="score-ring" style="--score:'+a.score+'"><b>'+a.score+'</b></div><div><span>'+esc(a.status)+' · '+esc(a.priority_band||'')+'</span><strong>'+esc(a.name)+'</strong><small>'+esc(a.program)+' · '+esc(a.deal)+'</small></div></article>';
   }
   function row(a){
     const src=a.source?'<a class="source-link" target="_blank" rel="noopener" href="'+esc(a.source)+'">Source</a>':'Notes / thesis';
     return '<div class="research-row" data-account="'+esc(a.name)+'">'+
      '<div><span class="acct-name">'+esc(a.name)+'</span><span class="acct-status">'+esc(a.status)+' · '+esc(a.priority_band||'')+'</span></div>'+
      '<div>'+esc(a.category)+'</div><div>'+esc(a.program)+'</div><div>'+esc(a.deal)+'</div>'+
      '<div><b>'+a.score+'</b><div class="mini-bar"><i style="width:'+a.score+'%"></i></div></div>'+
      '<div><span class="risk '+a.risk.toLowerCase()+'">'+esc(a.risk)+'</span></div>'+
      '<div>'+esc(a.thesis)+'</div><div>'+esc(a.signal)+'<br>'+src+'</div></div>';
   }
   function peopleHtml(a){
     if(a.known_people&&a.known_people.length){
       return '<div class="people-list">'+a.known_people.map(p=>'<div class="person"><strong>'+esc(p.name)+'</strong><span>'+esc(p.title)+'</span><em>'+esc(p.role)+'</em></div>').join('')+'</div>'+
        (a.people_source?'<a class="brief-source" target="_blank" rel="noopener" href="'+esc(a.people_source)+'">Leadership source</a>':'');
     }
     return '<p>No named executive shown until current public leadership is verified. Use the role map below for outreach research.</p>';
   }
   function showBrief(a){
     if(!brief)return;
     const breakdown=Object.keys(labels).map(k=>{
       const v=(a.f&&a.f[k])||0,m=maxes[k];
       return '<div class="score-line"><span>'+labels[k]+'</span><div class="track"><i style="width:'+Math.round(v/m*100)+'%"></i></div><b>'+v+' / '+m+'</b></div>';
     }).join('');
     const gaps=(a.knowledge_gaps||[]).map(g=>'<span>'+esc(g)+'</span>').join('');
     const mainSource=a.source?'<a class="brief-source" target="_blank" rel="noopener" href="'+esc(a.source)+'">Relationship / thesis source</a>':'';
     brief.innerHTML=
      '<div class="brief-head"><div class="brief-score" style="--score:'+a.score+'"><b>'+a.score+'</b></div>'+
      '<div><span class="eyebrow">ACCOUNT BRIEF · '+esc(a.priority_band||'')+'</span><h3>'+esc(a.name)+'</h3><p>'+esc(a.status)+' · '+esc(a.category)+' · '+esc(a.program)+'</p></div>'+
      '<div class="brief-tags"><span>'+esc(a.deal)+'</span><span>Risk: '+esc(a.risk)+'</span><span>'+esc(a.personnel_confidence||'')+'</span></div></div>'+
      '<div class="brief-grid">'+
       '<div class="brief-box"><span>PARTNER IQ BREAKDOWN</span><div class="score-breakdown">'+breakdown+'</div></div>'+
       '<div class="brief-box"><span>STRATEGIC THESIS</span><h4>'+esc(a.thesis)+'</h4><p>'+esc(a.signal)+'</p>'+mainSource+'</div>'+
       '<div class="brief-box" style="grid-column:1/-1"><span>BUYING COMMITTEE HYPOTHESIS</span><div class="committee">'+
        '<div><b>Economic buyer</b><strong>'+esc(a.economic_buyer_title||'CEO / Chief Strategy Officer')+'</strong></div>'+
        '<div><b>Decision maker</b><strong>'+esc(a.decision_maker_title||'Business Unit President / CTO / COO')+'</strong></div>'+
        '<div><b>Champion</b><strong>'+esc(a.champion_title||'VP Corporate Development / Strategic Partnerships')+'</strong></div>'+
       '</div></div>'+
       '<div class="brief-box"><span>KNOWN CURRENT PERSONNEL</span>'+peopleHtml(a)+'</div>'+
       '<div class="brief-box"><span>FIRST MEETING OBJECTIVE</span><h4>'+esc(a.first_meeting||'Validate strategic fit, internal sponsor and the appropriate deal structure.')+'</h4><span style="display:block;margin-top:14px;color:var(--amber);font-size:10.5px;font-weight:900">KNOWLEDGE GAPS</span><div class="gap-list">'+gaps+'</div></div>'+
      '</div>';
     document.querySelectorAll('.partner-card').forEach(x=>x.classList.toggle('active',x.dataset.account===a.name));
   }
   function bind(){
     document.querySelectorAll('[data-account]').forEach(el=>el.addEventListener('click',e=>{
       if(e.target.closest('a'))return;
       const a=data.find(x=>x.name===el.dataset.account);if(a)showBrief(a);
     }));
   }
   function render(){
     const q=(search?.value||'').trim().toLowerCase();
     let rows=data.filter(a=>{
       const c=(a.category||'').toLowerCase();
       const ok=filter==='all'||
        (filter==='public'&&a.status==='Public relationship')||
        (filter==='proposed'&&a.status!=='Public relationship')||
        (filter==='jv'&&a.deal.includes('JV'))||
        (filter==='launch'&&a.program.includes('New Glenn'))||
        (filter==='leo'&&(a.program.includes('LEO')||a.program.includes('Orbital Reef')))||
        (filter==='lunar'&&(a.program.includes('Blue Moon')||a.program.includes('Blue Alchemist')||a.program.includes('Exploration')))||
        (filter==='tier1'&&a.priority_band==='Tier 1')||
        (filter==='verified'&&a.known_people&&a.known_people.length)||
        (filter==='pharma'&&(c.includes('pharma')||c.includes('biotech')))||
        (filter==='defense'&&(c.includes('defense')||c.includes('sda')))||
        (filter==='data'&&(c.includes('cloud')||c.includes('data center')||c.includes('connectivity')||c.includes('telecom')));
       const match=!q||JSON.stringify(a).toLowerCase().includes(q);
       return ok&&match;
     }).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
     graphic.innerHTML=rows.slice(0,12).map(card).join('');
     table.querySelectorAll('.research-row:not(.head),.empty-row').forEach(x=>x.remove());
     table.insertAdjacentHTML('beforeend',rows.map(row).join('')||'<div class="empty-row">No accounts match this filter.</div>');
     const meta=document.getElementById('partnerMeta');if(meta)meta.textContent=rows.length+' accounts shown';
     bind();
   }
   fetch('/blueorigin/accounts.json').then(r=>r.json()).then(d=>{
     data=d.accounts||[];
     const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v;};
     set('universeCount',data.length);
     set('verifiedCount',data.filter(a=>a.known_people&&a.known_people.length).length);
     set('tier1Count',data.filter(a=>a.priority_band==='Tier 1').length);
     render();
     if(data[0])showBrief(data[0]);
   });
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