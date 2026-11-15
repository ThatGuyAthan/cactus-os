const KEY = "cactus-os-v1";
const today = () => new Date().toISOString().slice(0,10);
const dateLabel = d => new Date(d+"T12:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
const initial = {dailyDate:today(),daily:{},watering:[],soilChecks:[],checkins:[],notes:[],reminderTime:"18:00",notificationAsked:false};
let state = load();
function load(){try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...initial}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function ensureDay(){if(state.dailyDate!==today()){state.dailyDate=today();state.daily={};save()}}
function render(){
  ensureDay();
  const checks=Object.values(state.daily).filter(Boolean).length;
  document.getElementById("dailyCount").textContent=`${checks}/4`;
  document.getElementById("dailyProgress").style.width=`${checks/4*100}%`;
  document.querySelectorAll("[data-task]").forEach(el=>el.checked=!!state.daily[el.dataset.task]);
  const last=state.watering[0];
  document.getElementById("lastWater").textContent=last?`Last watered ${dateLabel(last.date)}`:"No watering logged";
  document.getElementById("waterAdvice").textContent=last?"Check soil moisture before watering again.":"Check the soil before deciding.";
  document.getElementById("waterCount").textContent=`${state.watering.length} ${state.watering.length===1?"entry":"entries"}`;
  document.getElementById("waterHistory").innerHTML=state.watering.length?state.watering.slice(0,4).map(x=>`<div class="history-item"><span>Watered · ${dateLabel(x.date)}</span><strong>Logged</strong></div>`).join(""):'<p class="empty">Your watering history will appear here.</p>';
  document.getElementById("reminderTime").value=state.reminderTime||"18:00";
  const lastCheck=state.checkins[0];
  if(lastCheck){const next=new Date(lastCheck+"T12:00:00");next.setDate(next.getDate()+14);const n=next.toISOString().slice(0,10);document.getElementById("nextCheckDate").textContent=dateLabel(n);document.getElementById("nextCheckText").textContent=(n<today()?"Your check-in is due.":"Your next inspection is scheduled in the care calendar.");}
  else {document.getElementById("nextCheckDate").textContent="Start your care cycle";document.getElementById("nextCheckText").textContent="Complete your first check-in to start the 14-day cycle."}
  document.getElementById("journalHistory").innerHTML=state.notes.slice(0,5).map(n=>`<div class="journal-entry"><time>${dateLabel(n.date)}</time>${escapeHtml(n.text)}</div>`).join("");
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.querySelectorAll("[data-task]").forEach(el=>el.addEventListener("change",()=>{state.daily[el.dataset.task]=el.checked;save()}));
document.getElementById("resetDaily").addEventListener("click",()=>{state.daily={};save();toast("Daily checklist reset.")});
document.getElementById("soilCheckBtn").addEventListener("click",()=>document.getElementById("soilDialog").showModal());
document.getElementById("soilForm").addEventListener("submit",e=>{if(e.submitter?.value==="cancel")return;e.preventDefault();const v=new FormData(e.currentTarget).get("soilState");if(!v){toast("Choose a soil condition first.");return}state.soilChecks.unshift({date:today(),state:v});save();document.getElementById("soilDialog").close();toast(`Soil check saved: ${v.toLowerCase()}.`);});
document.getElementById("waterBtn").addEventListener("click",()=>{document.getElementById("waterConfirm").checked=false;document.getElementById("waterError").textContent="";document.getElementById("waterDialog").showModal()});
document.getElementById("confirmWater").addEventListener("click",()=>{if(!document.getElementById("waterConfirm").checked){document.getElementById("waterError").textContent="Please confirm both soil dryness and drainage first.";return}state.watering.unshift({date:today()});save();document.getElementById("waterDialog").close();toast("Watering recorded. Let excess water drain away.")});
document.getElementById("completeCheck").addEventListener("click",()=>{state.checkins.unshift(today());save();toast("Fortnightly check-in completed.")});
document.getElementById("saveNote").addEventListener("click",()=>{const text=document.getElementById("journal").value.trim();if(!text){toast("Write an observation first.");return}state.notes.unshift({date:today(),text});document.getElementById("journal").value="";save();toast("Journal entry saved on this device.")});
document.getElementById("reminderTime").addEventListener("change",e=>{state.reminderTime=e.target.value;save();toast("Reminder time preference saved.")});
document.getElementById("notifyBtn").addEventListener("click",async()=>{if(!("Notification"in window)){toast("This browser does not support notifications.");return}const permission=await Notification.requestPermission();state.notificationAsked=true;save();document.getElementById("notificationStatus").textContent=permission==="granted"?"Notifications are enabled when Cactus OS is open and checks the schedule.":"Notifications were not enabled. In-app reminders remain available.";toast(permission==="granted"?"Notifications enabled.":"Notification permission not granted.")});
function checkReminder(){const last=state.checkins[0];if(!last)return;const due=new Date(last+"T12:00:00");due.setDate(due.getDate()+14);const dueDay=due.toISOString().slice(0,10);if(dueDay<=today()){document.getElementById("nextTitle").textContent="Fortnightly check-in due";document.getElementById("nextDescription").textContent="Inspect soil, plant health, light and drainage. Water only if the soil is dry throughout.";if("Notification"in window&&Notification.permission==="granted"&&sessionStorage.getItem("cactusDueShown")!==dueDay){new Notification("Cactus OS — check-in due",{body:"Inspect your cactus. Check soil moisture; don't water unless it is dry throughout.",icon:"icon.svg"});sessionStorage.setItem("cactusDueShown",dueDay)}}}
let deferredPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;const b=document.getElementById("installBtn");b.hidden=false;b.addEventListener("click",async()=>{deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;b.hidden=true},{once:true})});
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();checkReminder();
