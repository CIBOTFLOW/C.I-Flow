(function(){
 const tabs=[...document.querySelectorAll('[data-proof]')];
 const panels=[...document.querySelectorAll('[data-proof-panel]')];
 function showProof(name){
   tabs.forEach(b=>b.classList.toggle('active',b.dataset.proof===name));
   panels.forEach(p=>p.classList.toggle('active',p.dataset.proofPanel===name));
 }
 tabs.forEach(b=>b.addEventListener('click',()=>showProof(b.dataset.proof)));
 if(tabs.length) showProof(tabs[0].dataset.proof);

 const scores=[...document.querySelectorAll('[data-score]')];
 const out=document.querySelector('[data-score-output]');
 function updateScore(){
   const n=scores.filter(x=>x.classList.contains('active')).reduce((a,x)=>a+Number(x.dataset.score||0),0);
   if(out){
     const tier=n>=80?'Tier 1':n>=50?'Tier 2':'Tier 3';
     out.querySelector('strong').textContent=n+' pts';
     out.querySelector('span').textContent=tier+' account. Use the score to prioritize research, then apply Gold or Silver organizational judgment.';
   }
 }
 scores.forEach(x=>x.addEventListener('click',()=>{x.classList.toggle('active');updateScore();}));
 updateScore();

 const leadChoices=[...document.querySelectorAll('[data-lead-group]')];
 const leadOut=document.querySelector('[data-lead-output]');
 function updateLead(){
   const groups={};
   leadChoices.filter(x=>x.classList.contains('active')).forEach(x=>groups[x.dataset.leadGroup]=Number(x.dataset.leadScore||0));
   const n=Object.values(groups).reduce((a,b)=>a+b,0);
   if(leadOut){
     let msg='Low-priority lead. Build context or wait for a stronger reason to engage.';
     if(n>=80) msg='Priority lead. Strong persona plus behavior / intent. Move into focused rep outreach.';
     else if(n>=50) msg='Developing lead. Good relevance, but add context or a stronger trigger before heavy outreach.';
     leadOut.querySelector('strong').textContent=n+' / 100';
     leadOut.querySelector('span').textContent=msg;
   }
 }
 leadChoices.forEach(btn=>btn.addEventListener('click',()=>{
   const group=btn.dataset.leadGroup;
   leadChoices.filter(x=>x.dataset.leadGroup===group).forEach(x=>x.classList.remove('active'));
   btn.classList.add('active');
   updateLead();
 }));
 updateLead();
})();