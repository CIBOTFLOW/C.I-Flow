(function(){
 const scores=[...document.querySelectorAll('[data-score]')];
 const scoreOut=document.querySelector('[data-score-output]');
 function updateScore(){
   const total=scores.filter(x=>x.classList.contains('active')).reduce((a,x)=>a+Number(x.dataset.score||0),0);
   if(scoreOut){
     const tier=total>=80?'Gold candidate':total>=55?'Silver fit':'Low priority';
     scoreOut.querySelector('strong').textContent=total+' / 100';
     scoreOut.querySelector('span').textContent=tier+'. Account IQ should be reweighted after reviewing MedDev Solutions conversion history.';
   }
 }
 scores.forEach(x=>x.addEventListener('click',()=>{x.classList.toggle('active');updateScore();}));
 updateScore();

 const leadChoices=[...document.querySelectorAll('[data-lead-group]')];
 const leadOut=document.querySelector('[data-lead-output]');
 function updateLead(){
   const chosen={};
   leadChoices.filter(x=>x.classList.contains('active')).forEach(x=>chosen[x.dataset.leadGroup]=Number(x.dataset.leadScore||0));
   const total=Object.values(chosen).reduce((a,b)=>a+b,0);
   if(leadOut){
     const msg=total>=75?'Priority contact. Use direct phone, LinkedIn and personalized email.':total>=45?'Relevant contact. Add context or engagement before heavy outreach.':'Low-priority contact. Keep in nurture or find a better stakeholder.';
     leadOut.querySelector('strong').textContent=total+' / 100';
     leadOut.querySelector('span').textContent=msg;
   }
 }
 leadChoices.forEach(btn=>btn.addEventListener('click',()=>{
   const g=btn.dataset.leadGroup;
   leadChoices.filter(x=>x.dataset.leadGroup===g).forEach(x=>x.classList.remove('active'));
   btn.classList.add('active');updateLead();
 }));
 updateLead();
})();