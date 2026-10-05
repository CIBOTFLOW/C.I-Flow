(function(){
 const scores=[...document.querySelectorAll('[data-score]')];
 const scoreOut=document.querySelector('[data-score-output]');
 function updateScore(){
   const total=scores.filter(x=>x.classList.contains('active')).reduce((a,x)=>a+Number(x.dataset.score||0),0);
   if(scoreOut){
     const tier=total>=80?'Gold candidate':total>=55?'Silver fit':'Low priority';
     const isHe=localStorage.getItem('meddevLang')==='he';
     const heTier=total>=80?'מועמד ל-Gold':total>=55?'התאמה ל-Silver':'עדיפות נמוכה';
     scoreOut.querySelector('strong').textContent=total+' / 100';
     scoreOut.querySelector('span').textContent=isHe
       ? heTier+'. יש לכייל מחדש את Account IQ לאחר בדיקת היסטוריית ההמרה של MedDev Solutions.'
       : tier+'. Account IQ should be reweighted after reviewing MedDev Solutions conversion history.';
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
     const isHe=localStorage.getItem('meddevLang')==='he';
     const msg=total>=75?'Priority contact. Use direct phone, LinkedIn and personalized email.':total>=45?'Relevant contact. Add context or engagement before heavy outreach.':'Low-priority contact. Keep in nurture or find a better stakeholder.';
     const heMsg=total>=75?'איש קשר בעדיפות גבוהה. להשתמש בטלפון ישיר, LinkedIn ואימייל אישי.':total>=45?'איש קשר רלוונטי. להוסיף הקשר או מעורבות לפני outreach משמעותי.':'איש קשר בעדיפות נמוכה. להשאיר ב-nurture או למצוא stakeholder מתאים יותר.';
     leadOut.querySelector('strong').textContent=total+' / 100';
     leadOut.querySelector('span').textContent=isHe?heMsg:msg;
   }
 }
 leadChoices.forEach(btn=>btn.addEventListener('click',()=>{
   const g=btn.dataset.leadGroup;
   leadChoices.filter(x=>x.dataset.leadGroup===g).forEach(x=>x.classList.remove('active'));
   btn.classList.add('active');updateLead();
 }));
 updateLead();

 // Research console
 const table=document.getElementById('researchTable');
 if(table){
   let reviewed=[],candidates=[],filter='reviewed';
   const search=document.getElementById('accountSearch');
   const meta=document.getElementById('researchMeta');
   const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
   const sourceLinks=a=>(a.evidence||[]).slice(0,3).map((e,i)=>'<a target="_blank" rel="noopener" href="'+esc(e.url)+'">'+esc(e.label||('Source '+(i+1)))+'</a>').join('');
   function reviewedRow(a){
     const isHe=localStorage.getItem('meddevLang')==='he';
     const confidence=isHe?(a.he_confidence||a.confidence):(a.confidence+' confidence');
     const segment=isHe?(a.he_segment||a.segment):a.segment;
     const stage=isHe?(a.he_stage||a.stage):a.stage;
     const signal=isHe?(a.he_signal||a.signal):a.signal;
     const stakeholder=isHe?(a.he_stakeholder||a.stakeholder):a.stakeholder;
     const nextAction=isHe?(a.he_next_action||a.next_action):a.next_action;
     return '<div class="research-row reviewed">'+
       '<div><span class="account-name">'+esc(a.company)+'</span><span class="account-sub">'+esc(confidence)+'</span><div class="source-links">'+sourceLinks(a)+'</div></div>'+
       '<div>'+esc(a.hq)+'</div><div>'+esc(segment)+'</div><div>'+esc(stage)+'</div>'+
       '<div><b>'+esc(a.account_iq)+'</b><br><span class="tier-badge '+String(a.tier).toLowerCase()+'">'+esc(a.tier)+'</span></div>'+
       '<div>'+esc(signal)+'</div><div>'+esc(stakeholder)+'</div><div><b>'+esc(a.lead_iq)+'</b></div><div>'+esc(nextAction)+'</div></div>';
   }
   function candidateRow(a){
     return '<div class="research-row candidate">'+
       '<div><span class="account-name">'+esc(a.name)+'</span><span class="account-sub">'+esc(a.domain||a.source||'Candidate discovery')+'</span></div>'+
       '<div>Pending</div><div>Candidate</div><div>Pending</div><div>Not scored</div><div>Evidence review pending</div><div>Pending</div><div>Pending</div><div>Review ICP + public evidence</div></div>';
   }
   function render(){
     const q=(search?.value||'').trim().toLowerCase();
     let rows=[];
     if(filter==='reviewed'||filter==='gold'||filter==='silver'||filter==='nurture'){
       rows=reviewed.filter(a=>filter==='reviewed'||String(a.tier).toLowerCase()===filter);
       if(q) rows=rows.filter(a=>JSON.stringify(a).toLowerCase().includes(q));
       rows.sort((a,b)=>b.account_iq-a.account_iq);
       table.querySelectorAll('.research-row:not(:first-child),.table-loading,.empty-row').forEach(x=>x.remove());
       table.insertAdjacentHTML('beforeend',rows.map(reviewedRow).join('')||'<div class="empty-row">No reviewed accounts match this filter.</div>');
       if(meta) meta.textContent=lang==='he'?'מוצגים '+rows.length+' חשבונות שנבדקו':'Showing '+rows.length+' evidence-reviewed account'+(rows.length===1?'':'s');
       if(lang==='he') translateNode(table,'he');
     }else{
       rows=candidates;
       if(q) rows=rows.filter(a=>((a.name||'')+' '+(a.domain||'')+' '+(a.source||'')).toLowerCase().includes(q));
       table.querySelectorAll('.research-row:not(:first-child),.table-loading,.empty-row').forEach(x=>x.remove());
       const shown=rows.slice(0,q?300:150);
       table.insertAdjacentHTML('beforeend',shown.map(candidateRow).join('')||'<div class="empty-row">No candidates match this search.</div>');
       if(meta) meta.textContent=lang==='he'?'מוצגים '+shown.length+' מתוך '+rows.length+' חשבונות מועמדים':'Showing '+shown.length+' of '+rows.length+' candidate accounts'+(rows.length>shown.length?' · refine search to narrow':'');
       if(lang==='he') translateNode(table,'he');
     }
   }
   Promise.all([
     fetch('/meddev/reviewed-accounts.json').then(r=>r.json()),
     fetch('/meddev/accounts.json').then(r=>r.json())
   ]).then(([rv,cv])=>{
     reviewed=rv.accounts||[];candidates=cv.accounts||[];
     const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v;};
     set('candidateCount',cv.candidate_count||candidates.length);
     set('reviewedCount',reviewed.length);
     set('goldCount',reviewed.filter(x=>x.tier==='Gold').length);
     set('silverCount',reviewed.filter(x=>x.tier==='Silver').length);
     render();
   }).catch(()=>{table.querySelector('.table-loading').textContent='Research data could not be loaded.';});
   document.querySelectorAll('[data-account-filter]').forEach(btn=>btn.addEventListener('click',()=>{
     document.querySelectorAll('[data-account-filter]').forEach(x=>x.classList.remove('active'));
     btn.classList.add('active');filter=btn.dataset.accountFilter;render();
   }));
   search?.addEventListener('input',render);
 }

 // EN / HE toggle. Company names, regulatory acronyms and evidence records remain in their source language.
 const he={
 "MEDDEV SOLUTIONS · SENIOR BUSINESS DEVELOPMENT MANAGER":"MEDDEV SOLUTIONS · מנהל/ת פיתוח עסקי בכיר/ה",
 "BUILDING U.S. MEDTECH PIPELINE AROUND REAL REGULATORY NEED":"בניית צבר מכירות בארה״ב סביב צורך רגולטורי אמיתי",
 "OVERVIEW":"סקירה","MARKET":"שוק","INTELLIGENCE":"מודיעין","ENGAGEMENT":"פנייה לשוק","LAND + EXPAND":"כניסה והתרחבות","SALES SYSTEM":"מערכת מכירות","ACCOUNT RESEARCH LAB":"מעבדת מחקר חשבונות",
 "U.S. BUSINESS DEVELOPMENT":"פיתוח עסקי בארה״ב",
 "Build pipeline around real regulatory need.":"לבנות צבר מכירות סביב צורך רגולטורי אמיתי.",
 "Find medical-device companies at the moment software, quality, cybersecurity or regulatory work becomes commercially urgent. Win the first project, then expand into the rest of the product lifecycle.":"לאתר חברות מכשור רפואי ברגע שבו תוכנה, איכות, סייבר או רגולציה הופכים לצורך עסקי דחוף. לזכות בפרויקט הראשון ואז להתרחב לאורך מחזור חיי המוצר.",
 "THE ROLE":"התפקיד","Own the commercial path from first signal to signed engagement.":"להוביל את המסלול המסחרי מהסיגנל הראשון ועד לחוזה חתום.",
 "WHAT MEDDEV SELLS":"מה MedDev מוכרת","One partner across the regulated software lifecycle.":"שותף אחד לאורך מחזור החיים של תוכנה רפואית מפוקחת.",
 "THE COMMERCIAL MODEL":"המודל המסחרי","Signal → problem → first project → expansion.":"סיגנל → בעיה → פרויקט ראשון → התרחבות.",
 "Create demand.":"לייצר ביקוש.","Find the real gap.":"למצוא את הפער האמיתי.","Shape the engagement.":"לעצב את ההתקשרות.","Compress the path.":"לקצר את הדרך לעסקה.",
 "Medical software development":"פיתוח תוכנה רפואית","SQA + V&V":"SQA + V&V","Secure the device":"לאבטח את המכשיר","Get to market":"להגיע לשוק",
 "Choose account":"בחירת חשבון","Find urgency":"איתור דחיפות","Find person":"איתור האדם הנכון","Land project":"זכייה בפרויקט ראשון","Expand":"התרחבות",
 "NEXT":"הבא","Market + Account IQ":"שוק + Account IQ","Intent + Lead IQ":"כוונת קנייה + Lead IQ","Gold + Silver Engagement":"פנייה ל-Gold + Silver","Land + Expand":"כניסה והתרחבות","Qualification + Deal System":"הסמכה + מערכת עסקה","U.S. Account Research Lab":"מעבדת מחקר חשבונות בארה״ב",
 "WHO TO GO AFTER":"למי לפנות","Build the U.S. market around capability gaps, not generic MedTech lists.":"לבנות את השוק האמריקאי סביב פערי יכולת, לא סביב רשימות MedTech כלליות.",
 "PRIMARY + SECONDARY ICP":"ICP ראשי ומשני","70% focus where MedDev is most differentiated.":"70% מיקוד במקום שבו ל-MedDev יש את הבידול החזק ביותר.",
 "PRIMARY · ~70% FOCUS":"ראשי · כ-70% מיקוד","AI/ML diagnostics + imaging innovators":"חדשני AI/ML באבחון והדמיה","SECONDARY":"משני","SaMD + scaling device companies":"SaMD + חברות מכשור בצמיחה",
 "U.S. SEARCH MAP":"מפת חיפוש בארה״ב","Start where target-company density is highest.":"להתחיל היכן שצפיפות חברות היעד הגבוהה ביותר.",
 "ACCOUNT IQ":"ACCOUNT IQ","Score fit before spending selling time.":"לדרג התאמה לפני שמשקיעים זמן מכירה.",
 "WHAT THE RECORD NEEDS":"מה כל רשומה צריכה","One schema across 1,000+ accounts.":"סכמה אחת ליותר מ-1,000 חשבונות.",
 "TIMING MATTERS":"לתזמון יש משמעות","Good fit is not enough. Find the moment the gap becomes expensive.":"התאמה טובה אינה מספיקה. צריך למצוא את הרגע שבו הפער הופך ליקר.",
 "INTENT HIERARCHY":"היררכיית כוונת קנייה","Rank signals by urgency.":"לדרג סיגנלים לפי דחיפות.",
 "SIGNAL → SOURCE → ACTION":"סיגנל → מקור → פעולה","Build a system that tells me why to call.":"לבנות מערכת שמסבירה למה להתקשר עכשיו.",
 "LEAD IQ":"LEAD IQ","Rank the people inside the account.":"לדרג את האנשים בתוך החשבון.",
 "HOW I WOULD WORK THE MARKET":"איך הייתי עובד את השוק","Gold gets personal attention. Silver gets disciplined scale.":"Gold מקבל טיפול אישי. Silver מקבל סקייל ממושמע.",
 "GOLD LIST":"רשימת GOLD","SILVER LIST":"רשימת SILVER","GOLD TOUCH MODEL":"מודל נגיעות GOLD","Human first, automation later.":"אדם קודם, אוטומציה אחר כך.",
 "CAMPAIGN DEVELOPMENT":"פיתוח קמפיינים","Use current customers to make outreach sharper.":"להשתמש בלקוחות קיימים כדי לחדד את הפנייה.",
 "FIELD + COMMUNITY":"שטח וקהילה","Make Bay Area presence commercially useful.":"להפוך נוכחות באזור המפרץ ליתרון מסחרי.",
 "COMMERCIAL STRATEGY":"אסטרטגיה מסחרית","Land on the urgent problem. Expand across the path to market.":"להיכנס דרך הבעיה הדחופה ולהתרחב לאורך הדרך לשוק.",
 "EXPANSION LADDER":"סולם התרחבות","Map the lifecycle before the first proposal is signed.":"למפות את מחזור החיים לפני החתימה על ההצעה הראשונה.",
 "COMMON LANDING JOBS":"פרויקטי כניסה נפוצים","Four doors into a longer relationship.":"ארבע דלתות לקשר ארוך יותר.",
 "COMMERCIAL SHAPES":"מודלי התקשרות","Match the engagement to the risk the customer wants to transfer.":"להתאים את ההתקשרות לסיכון שהלקוח רוצה להעביר.",
 "FROM DISCOVERY TO CONTRACT":"מגילוי לצורך ועד לחוזה","Sell the right scope, protect value, and remove delay.":"למכור את ההיקף הנכון, לשמור על הערך ולהסיר עיכובים.",
 "60-90 DAY SALES CYCLE":"מחזור מכירה של 60-90 יום","Keep each step moving toward a decision.":"להזיז כל שלב לכיוון החלטה.",
 "QUALIFICATION":"הסמכה","Use BANT for reality. Use MEDDPICC for control.":"להשתמש ב-BANT לבדיקת מציאות וב-MEDDPICC לשליטה בתהליך.",
 "DEAL COMPRESSION":"קיצור עסקה","Know what is really blocking the signature.":"לדעת מה באמת חוסם את החתימה.",
 "SUNNYVALE + ISRAEL":"SUNNYVALE + ISRAEL","Keep commercial ownership local and technical depth close.":"לשמור בעלות מסחרית מקומית ועומק טכני קרוב.",
 "FIRST 90 DAYS":"90 הימים הראשונים","Learn the proof. Build the market. Start converting it.":"ללמוד את ההוכחות. לבנות את השוק. להתחיל להמיר.",
 "RESEARCH WORKSPACE":"מרחב מחקר","1,018 U.S. candidate accounts. Evidence first.":"1,018 חשבונות מועמדים בארה״ב. קודם ראיות.",
 "The universe is built. Reviewed accounts are scored only after checking public regulatory, product, funding, leadership and timing evidence. Database matches remain candidates until that review is complete.":"היקום נבנה. חשבונות שנבדקו מקבלים ציון רק לאחר אימות רגולציה, מוצר, מימון, הנהלה ותזמון ממקורות פומביים. התאמות ממאגר נשארות מועמדות עד לסיום הבדיקה.",
 "PHASE ONE RESEARCH":"מחקר שלב ראשון","Candidate universe + evidence-reviewed cohort.":"יקום מועמדים + קבוצה שנבדקה על בסיס ראיות.",
 "CANDIDATE UNIVERSE":"יקום מועמדים","EVIDENCE REVIEWED":"נבדקו ראיות","GOLD":"GOLD","SILVER":"SILVER",
 "RESEARCH SCHEMA":"סכמת מחקר","What each row will contain.":"מה כל שורה תכיל.","SCORING OUTPUT":"פלט דירוג","The table should produce action, not just rankings.":"הטבלה צריכה לייצר פעולה, לא רק דירוג.",
 "ABOUT ME":"עליי","See my broader GTM work.":"לצפייה בעבודת ה-GTM הרחבה שלי.","View profile →":"צפייה בפרופיל ←",
 "Company":"חברה","HQ":"מטה","Segment":"סגמנט","Stage":"שלב","Top signal":"סיגנל מוביל","Top stakeholder":"בעל עניין מוביל","Next action":"הפעולה הבאה",
 "Reviewed":"נבדקו","All 1,018 candidates":"כל 1,018 המועמדים","Nurture":"Nurture","Pending":"ממתין לבדיקה","Candidate":"מועמד","Not scored":"טרם דורג","Evidence review pending":"ממתין לבדיקת ראיות","Review ICP + public evidence":"בדיקת ICP + ראיות פומביות","High confidence":"ביטחון גבוה","Medium confidence":"ביטחון בינוני"
 };
 let lang=localStorage.getItem('meddevLang')||'en';
 const originalTitle=document.title;
 const originals=new WeakMap();
 function translateNode(root,language){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   let n;while(n=walker.nextNode()){
     if(!n.parentElement||['SCRIPT','STYLE'].includes(n.parentElement.tagName))continue;
     if(!originals.has(n)) originals.set(n,n.nodeValue);
     const en=originals.get(n);
     const trimmed=en.trim();
     if(language==='he'&&he[trimmed]){
       const prefix=en.match(/^\s*/)[0],suffix=en.match(/\s*$/)[0];
       n.nodeValue=prefix+he[trimmed]+suffix;
     }else if(language==='en') n.nodeValue=en;
   }
 }
 function setLang(next){
   lang=next;localStorage.setItem('meddevLang',lang);
   document.documentElement.lang=lang==='he'?'he':'en';
   document.documentElement.dir=lang==='he'?'rtl':'ltr';
   document.title=lang==='he'?(he[originalTitle]||originalTitle):originalTitle;
   translateNode(document.body,lang);
   document.querySelectorAll('.lang-toggle button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
   const searchInput=document.getElementById('accountSearch');if(searchInput)searchInput.placeholder=lang==='he'?'חיפוש חברה, סגמנט, סיגנל או בעל עניין':'Search company, segment, signal or stakeholder';
   if(typeof render==='function' && document.getElementById('researchTable')) { try{render();}catch(e){} }
 }
 const nav=document.querySelector('.nav');
 if(nav){
   const box=document.createElement('div');box.className='lang-toggle';
   box.innerHTML='<button data-lang="en">EN</button><button data-lang="he">HE</button>';
   nav.insertBefore(box,nav.querySelector('.stage'));
   box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
 }
 setLang(lang);
 fetch('/meddev/he.json').then(r=>r.json()).then(extra=>{
   Object.assign(he,extra);
   setLang(lang);
 }).catch(()=>{});
})();