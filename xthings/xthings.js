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
})();