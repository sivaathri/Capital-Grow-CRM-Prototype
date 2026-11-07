const NAV=[['dashboard','Dashboard','home'],['customers','Customers','users'],['enquiries','Enquiries','file',[['education-loan','Education Loan'],['insurance','Insurance']]],['applications','Loan Applications','file'],['banks','Bank Management','bank'],['followups','Follow-ups & Reminders','clock'],['payments','Payments','card'],['reports','Reports','chart'],['users','User Management','users'],['settings','Settings','gear']];
const TITLES={};NAV.forEach(n=>{TITLES[n[0]]=n[1];(n[3]||[]).forEach(s=>TITLES[s[0]]=n[1]+' – '+s[1])});
let openSub=null;
function showLogin(){app.classList.add('hidden');login.classList.remove('hidden')}
function showApp(){login.classList.add('hidden');app.classList.remove('hidden');route()}
function buildNav(cur){nav.innerHTML=NAV.map(n=>{const sub=n[3],act=cur===n[0]||(sub&&sub.some(s=>s[0]===cur)),open=sub&&(act||openSub===n[0]);
 return `<button class="nav-item ${act&&!sub?'active':''} ${open?'open':''}" data-nav="${n[0]}"><svg class="i"><use href="#i-${n[2]}"/></svg><span>${n[1]}</span>${sub?'<svg class="i sm chev"><use href="#i-chev"/></svg>':''}</button>${sub?`<div class="sub ${open?'open':''}">${sub.map(s=>`<a href="#${s[0]}" class="${cur===s[0]?'active':''}">${s[1]}</a>`).join('')}</div>`:''}`}).join('')+''}
function route(){if(!isAuthed()){showLogin();return}const full=(location.hash||'#dashboard').slice(1),parts=full.split('/'),cur=parts[0];buildNav(cur);document.body.classList.remove('nav-open');
 if(cur==='dashboard')view.innerHTML=renderDashboard();else if(cur==='customers')Customers.route(parts);else if(cur==='education-loan'||cur==='enquiries')EducationLoan.route(parts);else{const t=TITLES[cur]||'Page';view.innerHTML=`<div class="head"><div><h1>${t}</h1></div></div><div class="card empty"><h2>${t} arrives in the next build phase</h2><p>Login, the app shell and the dashboard are live. This module is next in the phase plan.</p><br><a class="btn primary" href="#dashboard">Back to dashboard</a></div>`}
 document.title=(TITLES[cur]||'Dashboard')+' · Capital Grow CRM';scrollTo(0,0)}
document.addEventListener('click',e=>{const t=e.target;
 const nb=t.closest('[data-nav]');if(nb){const n=NAV.find(x=>x[0]===nb.dataset.nav);if(n[3]){openSub=openSub===n[0]?null:n[0];buildNav((location.hash||'#dashboard').slice(1).split('/')[0])}else location.hash=n[0]}
 const g=t.closest('[data-go]');if(g){const m={enquiry:'education-loan',customer:'customers/new',application:'applications',insurance:'insurance',followup:'followups'};location.hash=m[g.dataset.go]}
 const v=t.closest('[data-view]');if(v)location.hash='customers/'+v.dataset.view;
 const c=t.closest('[data-call]');if(c)toast('Calling '+c.dataset.call+'… (simulated)');
 if(!t.closest('.pos')){notifPanel.classList.add('hidden');profMenu.classList.add('hidden')}
 if(!t.closest('.search'))sResults.classList.add('hidden')});
function initShell(){burger.onclick=()=>{innerWidth>1024?document.body.classList.toggle('collapsed'):document.body.classList.add('nav-open')};scrim.onclick=()=>document.body.classList.remove('nav-open');
 bellBtn.onclick=()=>{renderNotifs();notifPanel.classList.toggle('hidden');bellDot.classList.add('hidden')};profBtn.onclick=()=>profMenu.classList.toggle('hidden');msgBtn.onclick=()=>toast('No new messages');
 logoutBtn.onclick=e=>{e.preventDefault();profMenu.classList.add('hidden');logout()};
 gSearch.oninput=()=>{const q=gSearch.value.trim().toLowerCase();if(!q){sResults.classList.add('hidden');return}const r=DB.get('customers',[]).filter(c=>(c.id+c.name+c.mobile).toLowerCase().includes(q)).slice(0,6);
  sResults.innerHTML=r.length?r.map(c=>`<a href="#customers/${c.id}" class="dd"><b>${c.name}</b><small>${c.id} · ${c.mobile}</small></a>`).join(''):'<div class="dd muted">No customers match your search.</div>';sResults.classList.remove('hidden')}}
seed();initLogin();initShell();addEventListener('hashchange',route);
if(isAuthed()){showApp();simulateReminder()}else showLogin();
