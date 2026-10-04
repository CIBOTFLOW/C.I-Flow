(function(){
  const filterBtns=[...document.querySelectorAll('[data-filter]')];
  const rows=[...document.querySelectorAll('[data-account-type]')];
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
    const f=btn.dataset.filter;
    filterBtns.forEach(x=>x.classList.toggle('active',x===btn));
    rows.forEach(r=>r.style.display=(f==='all'||r.dataset.accountType===f)?'grid':'none');
  }));

  const tabs=[...document.querySelectorAll('[data-case]')];
  const panels=[...document.querySelectorAll('[data-case-panel]')];
  function showCase(name){
    const valid=panels.some(p=>p.dataset.casePanel===name)?name:'tp';
    tabs.forEach(b=>b.classList.toggle('active',b.dataset.case===valid));
    panels.forEach(p=>p.classList.toggle('active',p.dataset.casePanel===valid));
    if(history.replaceState) history.replaceState(null,'','#'+valid);
  }
  tabs.forEach(b=>b.addEventListener('click',()=>showCase(b.dataset.case)));
  if(tabs.length) showCase((location.hash||'#tp').slice(1));
})();