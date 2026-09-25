document.addEventListener('DOMContentLoaded',function(){
  var data=(window.EUROPE_AI_TARGETS||[]).slice();
  var body=document.getElementById('accountRows');
  var count=document.getElementById('visibleCount');
  var search=document.getElementById('accountSearch');
  var country=document.getElementById('countryFilter');
  var market=document.getElementById('marketFilter');
  var lane=document.getElementById('laneFilter');
  var employees=document.getElementById('employeeFilter');
  var revenue=document.getElementById('revenueFilter');
  var tier=document.getElementById('tierFilter');
  var reset=document.getElementById('resetFilters');
  var exportBtn=document.getElementById('exportAccounts');
  var sortKey='rank',sortDir=1;

  function bestLane(x){
    var m=x.market||'';
    if(m==='Financial Services')return 'Finance + Procurement AI';
    if(m==='Retail & Consumer'||m==='Travel & Hospitality'||m==='Telecom & Media')return 'Customer Service / Contact Center AI';
    if(m==='Software & IT')return 'AI Security / Cybersecurity';
    if(m==='Construction & Real Estate'||m==='Food & Beverage')return 'Finance + Procurement AI';
    return 'Enterprise Agents / Workflow AI';
  }
  data=data.map(function(x){var y=Object.assign({},x);y.bestLane=bestLane(x);return y});

  if(!data.length){
    if(count)count.textContent='Account data failed to load';
    if(body)body.innerHTML='<tr><td colspan="8" style="padding:28px;color:#9da5ae">The European AI account dataset did not load. Refresh the page; if this persists, the data asset is unavailable.</td></tr>';
    return;
  }

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]})}
  function addOptions(el,vals){vals.forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)})}
  addOptions(country,Array.from(new Set(data.map(function(x){return x.country}))).sort());
  addOptions(market,Array.from(new Set(data.map(function(x){return x.market}))).sort());

  function filtered(){
    var q=(search.value||'').trim().toLowerCase();
    return data.filter(function(x){
      if(country.value&&x.country!==country.value)return false;
      if(market.value&&x.market!==market.value)return false;
      if(lane&&lane.value&&x.bestLane!==lane.value)return false;
      if(employees.value&&x.employeeRange!==employees.value)return false;
      if(revenue.value&&x.revenueBand!==revenue.value)return false;
      if(tier.value&&x.tier!==tier.value)return false;
      if(q){
        var hay=[x.company,x.group,x.city,x.country,x.market,x.industry,x.bestLane].join(' ').toLowerCase();
        if(hay.indexOf(q)===-1)return false;
      }
      return true;
    }).sort(function(a,b){
      var av=a[sortKey],bv=b[sortKey];
      if(typeof av==='string'){av=av.toLowerCase();bv=String(bv).toLowerCase()}
      if(av<bv)return -1*sortDir;if(av>bv)return 1*sortDir;return a.rank-b.rank;
    });
  }
  function render(){
    var rows=filtered();
    count.textContent=rows.length.toLocaleString()+' accounts';
    body.innerHTML=rows.map(function(x){
      var group=x.group?'<small>'+esc(x.group)+'</small>':'';
      return '<tr>'+
        '<td class="rank-cell">'+esc(x.rank)+'</td>'+
        '<td class="company-cell"><strong>'+esc(x.company)+'</strong>'+group+'</td>'+
        '<td>'+esc(x.country)+'<small>'+esc(x.city)+'</small></td>'+
        '<td><span class="market-chip">'+esc(x.market)+'</span><small>'+esc(x.industry)+'</small></td>'+
        '<td class="num-cell">'+Number(x.employees).toLocaleString()+'<small>'+esc(x.employeeRange)+'</small></td>'+
        '<td class="num-cell">'+esc(x.revenue)+'<small>'+esc(x.revenueBand)+'</small></td>'+
        '<td><span class="lane-chip">'+esc(x.bestLane)+'</span></td>'+
        '<td><span class="tier tier-'+esc(x.tier.toLowerCase())+'">Tier '+esc(x.tier)+'</span></td>'+
      '</tr>';
    }).join('');
  }

  [search,country,market,lane,employees,revenue,tier].filter(Boolean).forEach(function(el){el.addEventListener(el===search?'input':'change',render)});
  reset.addEventListener('click',function(){search.value='';country.value='';market.value='';if(lane)lane.value='';employees.value='';revenue.value='';tier.value='';sortKey='rank';sortDir=1;render()});
  document.querySelectorAll('th[data-sort]').forEach(function(th){th.addEventListener('click',function(){var k=th.getAttribute('data-sort');if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=1}render()})});
  exportBtn.addEventListener('click',function(){
    var rows=filtered();
    var cols=['rank','company','group','country','city','market','industry','employees','employeeRange','revenue','revenueBand','bestLane','tier'];
    function csv(v){v=String(v==null?'':v);return '"'+v.replace(/"/g,'""')+'"'}
    var out=[cols.join(',')].concat(rows.map(function(r){return cols.map(function(c){return csv(r[c])}).join(',')})).join('\n');
    var blob=new Blob([out],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='CI-Flow-European-AI-1000.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  });
  render();
});