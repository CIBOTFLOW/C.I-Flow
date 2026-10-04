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
     let tier=n>=80?'Tier 1':n>=50?'Tier 2':'Tier 3';
     out.querySelector('strong').textContent=n+' pts';
     out.querySelector('span').textContent=tier+' account. Use the score to prioritize research, not to replace rep judgment.';
   }
 }
 scores.forEach(x=>x.addEventListener('click',()=>{x.classList.toggle('active');updateScore();}));
 updateScore();
})();