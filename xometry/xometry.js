(function(){
 const choices=[...document.querySelectorAll('[data-match-group]')];
 const out=document.querySelector('[data-match-output]');
 function update(){
   const groups={};
   choices.filter(x=>x.classList.contains('active')).forEach(x=>groups[x.dataset.matchGroup]=Number(x.dataset.matchScore||0));
   const total=Object.values(groups).reduce((a,b)=>a+b,0);
   if(!out)return;
   let label='Do not route yet';
   let note='Missing capability, certification, confidence or capacity. Find a better-fit partner or resolve the gap before sending the RFQ.';
   if(total>=85){label='Primary route';note='Strong capability, compliance, delivery confidence and available capacity. Send as one of the curated 3-5 partners.';}
   else if(total>=65){label='Backup / validate';note='Potential fit, but one material uncertainty should be confirmed with the estimator before routing.';}
   out.querySelector('strong').textContent=total+' / 100';
   out.querySelector('h3').textContent=label;
   out.querySelector('p').textContent=note;
 }
 choices.forEach(btn=>btn.addEventListener('click',()=>{
   const g=btn.dataset.matchGroup;
   choices.filter(x=>x.dataset.matchGroup===g).forEach(x=>x.classList.remove('active'));
   btn.classList.add('active');update();
 }));
 update();
})();