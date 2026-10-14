(function(){
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];

// battlecards
qa('.battle-tab').forEach(btn=>btn.addEventListener('click',()=>{qa('.battle-tab').forEach(x=>x.classList.remove('active'));qa('.battle-panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');q('#'+btn.dataset.target)?.classList.add('active');}));

// internal practice tabs
qa('.practice-tab').forEach(btn=>btn.addEventListener('click',()=>{qa('.practice-tab').forEach(x=>x.classList.remove('active'));qa('.practice-panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');q('#'+btn.dataset.target)?.classList.add('active');}));

// deal health
const health=q('#dealHealth');
function calcHealth(){
 if(!health)return;
 let total=0,count=0;
 health.querySelectorAll('.health-choice.active').forEach(x=>{total+=Number(x.dataset.score||0);count++;});
 const score=count?Math.round(total/count):0,out=q('#healthScore'),label=q('#healthLabel'),note=q('#healthNote');
 if(out)out.textContent=score+' / 10';
 let l='Not qualified',n='Do not spend solution-consulting capacity yet. Close the evidence gaps or disqualify.';
 if(score>=8){l='Forecastable pursuit';n='Strong enough to invest pursuit resources. Build the mutual close plan and multi-thread the buyer group.';}
 else if(score>=6){l='Qualified, but exposed';n='Advance selectively. The missing MEDDPICC evidence is now the agenda for the next customer interaction.';}
 else if(score>=4){l='Discovery only';n='There may be pain, but the buying path is not strong enough for proposal or demo resources yet.';}
 if(label)label.textContent=l;if(note)note.textContent=n;
}
qa('.health-choice').forEach(btn=>btn.addEventListener('click',()=>{health?.querySelectorAll('.health-choice[data-group="'+btn.dataset.group+'"]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');calcHealth();}));
calcHealth();

// signal engine
const table=q('#signalTable');
if(table){
 let rows=[],filter='all';
 const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const search=q('#signalSearch'),brief=q('#signalBrief');
 function render(){
  const term=(search?.value||'').toLowerCase().trim();
  const show=rows.filter(a=>{
   const blob=(a.company+' '+a.vertical+' '+a.signal+' '+a.why_now+' '+a.location).toLowerCase();
   return (filter==='all'||a.signal_type===filter)&&(!term||blob.includes(term));
  });
  table.querySelectorAll('.signal-row:not(.head),.signal-empty').forEach(x=>x.remove());
  table.insertAdjacentHTML('beforeend',show.map(a=>'<div class="signal-row"><div><button data-account="'+esc(a.id)+'"><b>'+esc(a.company)+'</b><small>'+esc(a.location)+'</small></button></div><div>'+esc(a.vertical)+'</div><div>'+esc(a.signal_type)+'</div><div><span class="score-ring">'+a.score+'</span><small>F '+a.fit+' · T '+a.trigger+' · C '+a.complexity+' · R '+a.reach+'</small></div><div>'+esc(a.why_now)+'</div><div>'+esc(a.first_move)+'</div><div><a class="source-link" href="'+esc(a.source)+'" target="_blank" rel="noopener">Source</a></div></div>').join('')||'<div class="signal-empty" style="padding:28px">No accounts match this view.</div>');
  qa('[data-account]').forEach(b=>b.addEventListener('click',()=>openBrief(b.dataset.account)));
 }
 function openBrief(id){
  const a=rows.find(x=>x.id===id);if(!a||!brief)return;
  brief.innerHTML='<div class="brief-top"><div class="brief-score">'+a.score+'</div><div><small>'+esc(a.vertical)+' · '+esc(a.signal_type)+'</small><h3>'+esc(a.company)+'</h3><small>'+esc(a.location)+'</small></div><button class="brief-close" id="briefClose">Close</button></div><div class="brief-grid"><div><span>WHY NOW</span><strong>'+esc(a.why_now)+'</strong><p>'+esc(a.hypothesis)+'</p></div><div><span>FIRST MEETING</span><strong>'+esc(a.first_meeting)+'</strong><p>'+esc(a.first_move)+'</p></div><div><span>BUYING GROUP</span><strong>'+esc(a.buyers)+'</strong><p>Economic buyer and champion still require validation.</p></div><div><span>KNOWLEDGE GAPS</span><strong>'+esc(a.gaps)+'</strong><p><a class="source-link" target="_blank" rel="noopener" href="'+esc(a.source)+'">Public evidence</a></p></div></div>';
  brief.classList.add('active');q('#briefClose')?.addEventListener('click',()=>brief.classList.remove('active'));brief.scrollIntoView({behavior:'smooth',block:'nearest'});
 }
 fetch('/bakertilly/accounts.json').then(r=>r.json()).then(d=>{
  rows=d.accounts||[];q('#signalCount').textContent=rows.length;q('#highCount').textContent=rows.filter(x=>x.score>=80).length;render();
 });
 search?.addEventListener('input',render);
 qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;render();}));
}

// quota model
const target=q('#quotaTarget'),deal=q('#avgDeal'),win=q('#winRate');
function quota(){
 if(!target||!deal||!win)return;
 const t=Number(target.value),d=Number(deal.value),w=Number(win.value)/100;
 q('#quotaTargetOut').textContent='$'+(t/1000000).toFixed(1)+'M';
 q('#avgDealOut').textContent='$'+Math.round(d/1000)+'K';
 q('#winRateOut').textContent=Math.round(w*100)+'%';
 const wins=Math.ceil(t/d),pipe=t/w,mql=Math.ceil(wins/w);
 q('#winsNeeded').textContent=wins;
 q('#pipeNeeded').textContent='$'+(pipe/1000000).toFixed(1)+'M';
 q('#qualifiedNeeded').textContent=Math.ceil(wins/w);
 q('#monthlyRun').textContent='$'+Math.round(t/12/1000)+'K';
}
[target,deal,win].forEach(x=>x?.addEventListener('input',quota));quota();
})();