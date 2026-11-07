const Customers=(()=>{
const OPT={gender:['Male','Female','Other'],type:['Education Loan','Insurance (Life)','Insurance (Health)','Insurance (Education)','Insurance (Other)'],status:['Under Process','Follow-up Due','Sanctioned','No Response'],adm:['Not Applied','Applied','Offer Received','Admitted'],src:['Walk-in','Referral','Website','Social Media','Campaign'],emp:['Meena R','Arun K','Kavitha S'],ctry:['USA','UK','Canada','Australia','Germany','Ireland','Other']};
const SEC=[['Basic Information',[['id','Customer ID'],['name','Customer Name *'],['mobile','Mobile Number *'],['alt','Alternate Mobile'],['email','Email Address'],['dob','Date of Birth','date'],['gender','Gender','s',OPT.gender],['city','City'],['state','State'],['pin','Pincode'],['address','Address','t']]],
['Education Information',[['highest','Highest Qualification'],['current','Current Qualification'],['inst','Institution Name'],['course','Course Interested'],['country','Country Interested','s',OPT.ctry],['univ','University Name'],['adm','Admission Status','s',OPT.adm],['intake','Expected Intake']]],
['Reference Information',[['refName','Reference Name'],['refMobile','Reference Mobile'],['src','Lead Source','s',OPT.src],['emp','Assigned Employee','s',OPT.emp]]],
['Additional Information',[['type','Enquiry Type *','s',OPT.type],['status','Status','s',OPT.status],['created','Created Date','date'],['remarks','Remarks','t']]]];
let q='',fs='',ft='',pg=1;const PS=8;
const list=()=>DB.get('customers',[]).map(c=>({gender:'',email:'',city:'',state:'',country:'USA',adm:'Not Applied',src:'Walk-in',created:'2026-10-15',remarks:'',...c}));
const save=l=>DB.set('customers',l);
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fdate=d=>d?new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'-';
const sel=(o,v)=>o.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join('');
function nextId(l){return `CG-${new Date().getFullYear()}-${String(l.reduce((m,c)=>Math.max(m,parseInt(c.id.split('-').pop())||0),0)+1).padStart(5,'0')}`}
function filtered(){const s=q.toLowerCase();return list().filter(c=>(!s||(c.id+c.name+c.mobile+c.email).toLowerCase().includes(s))&&(!fs||c.status===fs)&&(!ft||c.type===ft))}
function renderList(){const f=filtered(),pages=Math.max(1,Math.ceil(f.length/PS));pg=Math.min(pg,pages);const rows=f.slice((pg-1)*PS,pg*PS);
 const cols=[['Customer ID','id'],['Customer Name','name'],['Mobile','mobile'],['Email','email'],['Enquiry Type','type'],['Reference','refName'],['Assigned To','emp'],['Created','created'],['Status','status']];
 return `<div class="head"><div><h1>Customers</h1><p>${f.length} customer${f.length===1?'':'s'} found</p></div><div class="acts"><button class="btn ghost" data-act="csv">Export CSV</button><a class="btn primary" href="#customers/new">+ Add Customer</a></div></div>
 <div class="card"><div class="toolbar"><input class="grow" id="cq" placeholder="Search by ID, name, mobile or email" value="${e(q)}"><select id="cs" aria-label="Status"><option value="">All statuses</option>${sel(OPT.status,fs)}</select><select id="ct" aria-label="Type"><option value="">All enquiry types</option>${sel(OPT.type,ft)}</select></div>
 ${rows.length?`<div class="tbl-wrap rcards"><table><thead><tr>${cols.map(c=>`<th>${c[0]}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${rows.map(c=>`<tr>${cols.map(k=>`<td data-l="${k[0]}">${k[1]==='status'?`<span class="pill ${PILL[c.status]||'blue'}">${e(c.status)}</span>`:k[1]==='created'?fdate(c.created):k[1]==='id'?`<a class="link" href="#customers/${c.id}">${c.id}</a>`:e(c[k[1]])||'-'}</td>`).join('')}<td data-l="Actions"><div class="acts-c"><a class="ib" href="#customers/${c.id}" aria-label="View">👁</a><a class="ib" href="#customers/edit/${c.id}" aria-label="Edit">✎</a><button class="ib del" data-act="del" data-id="${c.id}" aria-label="Delete">🗑</button></div></td></tr>`).join('')}</tbody></table></div>
 <div class="pager"><small class="muted">Page ${pg} of ${pages}</small><div><button class="btn ghost" data-act="pg" data-p="${pg-1}" ${pg<2?'disabled':''}>Previous</button><button class="btn ghost" data-act="pg" data-p="${pg+1}" ${pg>=pages?'disabled':''}>Next</button></div></div>`
 :`<div class="empty"><h2>No customers match</h2><p>Clear the filters or add a new customer.</p></div>`}</div>`}
function renderForm(id){const l=list(),c=id?l.find(x=>x.id===id):{id:nextId(l),created:new Date().toISOString().slice(0,10),status:'Under Process',type:'Education Loan',country:'USA',adm:'Not Applied',src:'Walk-in',emp:OPT.emp[0],gender:''};
 if(!c)return notFound();
 return `<div class="head"><div><h1>${id?'Edit':'Add'} Customer</h1><p>${c.id}</p></div></div><form id="cf" novalidate>${SEC.map(s=>`<div class="card fsec"><h3>${s[0]}</h3><div class="fgrid">${s[1].map(f=>{const[k,l,t,o]=f,w=t==='t'?' wide':'';const inp=t==='s'?`<select name="${k}"><option value=""></option>${sel(o,c[k])}</select>`:t==='t'?`<textarea name="${k}" rows="2">${e(c[k])}</textarea>`:`<input name="${k}" type="${t||'text'}" value="${e(c[k])}" ${k==='id'?'readonly':''}>`;return `<label class="${w}">${l}${inp}<small data-e="${k}"></small></label>`}).join('')}</div></div>`).join('')}
 <div class="fbar"><a class="btn ghost" href="#customers">Cancel</a><button class="btn primary">${id?'Save changes':'Add customer'}</button></div></form>`}
function notFound(){return `<div class="card empty"><h2>Customer not found</h2><a class="btn primary" href="#customers">Back to customers</a></div>`}
function submit(id,form){const d=Object.fromEntries(new FormData(form)),err={};
 if(!d.name?.trim())err.name='Enter the customer name.';if(!/^[6-9]\d{9}$/.test(d.mobile||''))err.mobile='Enter a valid 10-digit mobile number.';
 if(d.email&&!/^\S+@\S+\.\S+$/.test(d.email))err.email='Enter a valid email address.';if(d.pin&&!/^\d{6}$/.test(d.pin))err.pin='Pincode must be 6 digits.';if(!d.type)err.type='Select an enquiry type.';
 form.querySelectorAll('[data-e]').forEach(s=>s.textContent=err[s.dataset.e]||'');if(Object.keys(err).length){toast('Fix the highlighted fields.','err');return}
 const l=list();if(l.some(c=>c.mobile===d.mobile&&c.id!==d.id)){form.querySelector('[data-e=mobile]').textContent='This mobile number already belongs to another customer.';return}
 d.followup=d.followup||'-';if(id){const i=l.findIndex(c=>c.id===id);l[i]={...l[i],...d};toast('Customer updated')}else{l.unshift({...d,followup:'-'});toast('Customer added')}save(l);location.hash='customers'}
function renderProfile(id,tab){const c=list().find(x=>x.id===id);if(!c)return notFound();const T=['Overview','Personal Information','Education Details','Enquiries','Loan Applications','Insurance','Follow-up History','Payments','Remarks / Activity'];
 const kv=a=>`<div class="kv">${a.map(x=>`<div><small>${x[0]}</small><b>${e(x[1])||'-'}</b></div>`).join('')}</div>`,emptyT=(t,m)=>`<div class="empty"><h2>${t}</h2><p>${m}</p></div>`,isIns=c.type.startsWith('Insurance');
 const B=[()=>kv([['Status',c.status],['Enquiry Type',c.type],['Assigned To',c.emp],['Mobile',c.mobile],['Email',c.email],['Created',fdate(c.created)],['Country Interested',c.country],['Next Follow-up',c.followup]]),
 ()=>kv([['Name',c.name],['Mobile',c.mobile],['Alternate',c.alt],['Email',c.email],['Date of Birth',fdate(c.dob)],['Gender',c.gender],['City',c.city],['State',c.state],['Pincode',c.pin],['Address',c.address]]),
 ()=>kv([['Highest Qualification',c.highest],['Current Qualification',c.current],['Institution',c.inst],['Course',c.course],['Country',c.country],['University',c.univ],['Admission Status',c.adm],['Expected Intake',c.intake]]),
 ()=>kv([['Enquiry Type',c.type],['Status',c.status],['Enquiry Date',fdate(c.created)],['Assigned To',c.emp],['Remarks',c.remarks]]),
 ()=>emptyT('No loan applications yet','Bank applications for this customer will appear here once the Loan Applications module is added.'),
 ()=>isIns?kv([['Insurance Type',c.type],['Status',c.status],['Enquiry Date',fdate(c.created)]]):emptyT('No insurance enquiries','This customer has not enquired about insurance.'),
 ()=>emptyT('No follow-up history','Scheduled and completed follow-ups will be listed here.'),
 ()=>emptyT('No payments recorded','Service fees and commissions for this customer will show here.'),
 ()=>`<ul class="tl"><li><b>Customer created</b><small>${fdate(c.created)} · ${e(c.emp)}</small></li><li><b>Enquiry logged: ${e(c.type)}</b><small>Status: ${e(c.status)}</small></li>${c.remarks?`<li><b>Remark</b><small>${e(c.remarks)}</small></li>`:''}</ul>`];
 const n=Math.min(+tab||0,8);
 return `<div class="head"><div><a class="link" href="#customers">← Customers</a></div><div class="acts"><a class="btn ghost" href="#customers/edit/${id}">Edit</a><button class="btn ghost" data-act="del" data-id="${id}">Delete</button></div></div>
 <div class="card pf"><span class="avatar">${e(c.name[0])}</span><div><h2>${e(c.name)}</h2><span class="muted">${c.id} · ${e(c.mobile)}</span></div><span class="pill ${PILL[c.status]||'blue'}">${e(c.status)}</span></div>
 <div class="tabs" role="tablist">${T.map((t,i)=>`<button role="tab" class="${i===n?'on':''}" data-act="tab" data-t="${i}">${t}</button>`).join('')}</div><div class="card" id="tabBody">${B[n]()}</div>`}
function csv(){const f=filtered(),k=['id','name','mobile','email','type','refName','emp','created','status'],esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([[k.join(','),...f.map(c=>k.map(x=>esc(c[x])).join(','))].join('\n')],{type:'text/csv'}));a.download='customers.csv';a.click();toast(`Exported ${f.length} customers`)}
function route(p){let h;const v=document.getElementById('view');
 if(p[1]==='new')h=renderForm();else if(p[1]==='edit')h=renderForm(p[2]);else if(p[1])h=renderProfile(p[1]);else h=renderList();v.innerHTML=h;
 const cf=document.getElementById('cf');if(cf)cf.onsubmit=ev=>{ev.preventDefault();submit(p[1]==='edit'?p[2]:null,cf)};
 const bind=(id,fn)=>{const el=document.getElementById(id);if(el)el.oninput=fn};
 const re=()=>{const pos=document.getElementById('cq').selectionStart;route(['customers']);const el=document.getElementById('cq');el.focus();el.setSelectionRange(pos,pos)};
 bind('cq',ev=>{q=ev.target.value;pg=1;re()});bind('cs',ev=>{fs=ev.target.value;pg=1;route(['customers'])});bind('ct',ev=>{ft=ev.target.value;pg=1;route(['customers'])});
 v.onclick=async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='csv')csv();if(a==='pg'){pg=+b.dataset.p;route(['customers'])}if(a==='tab'){v.innerHTML=renderProfile(p[1],b.dataset.t);route.keepTab=1;}
  if(a==='del'&&await confirmBox('Delete customer?','This permanently removes the customer and cannot be undone.')){save(list().filter(c=>c.id!==b.dataset.id));toast('Customer deleted');location.hash==='#customers'?route(['customers']):location.hash='customers'}}}
return{route}})();
