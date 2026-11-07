const USER={u:'admin@capitalgrow.co.in',p:'Admin@123'};
function isAuthed(){return sessionStorage.getItem('cg_auth')==='1'||localStorage.getItem('cg_remember')==='1'}
function initLogin(){
 pwToggle.onclick=()=>{const s=lPass.type==='password';lPass.type=s?'text':'password';pwToggle.textContent=s?'Hide':'Show'};
 forgot.onclick=e=>{e.preventDefault();toast('Password reset is simulated here. Use the demo credentials.','err')};
 loginForm.onsubmit=e=>{e.preventDefault();lErr.textContent='';
  if(!lUser.value.trim()||!lPass.value){lErr.textContent='Enter both your username and password.';return}
  if(lUser.value.trim().toLowerCase()!==USER.u||lPass.value!==USER.p){lErr.textContent='Username or password is incorrect.';return}
  sessionStorage.setItem('cg_auth','1');lRemember.checked?localStorage.setItem('cg_remember','1'):localStorage.removeItem('cg_remember');showApp();toast('Welcome back, Admin');simulateReminder()}}
async function logout(){if(await confirmBox('Log out?','You will need to sign in again to continue.')){sessionStorage.removeItem('cg_auth');localStorage.removeItem('cg_remember');location.hash='';showLogin()}}
