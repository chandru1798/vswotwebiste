/* =============================================
   VSWOT 2.0 — script.js
   ============================================= */
(function(){
'use strict';

/* ---- THEME TOGGLE ---- */
(function(){
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  // Persist across pages via localStorage
  const saved = localStorage.getItem('vswot-theme') || 'light';
  if(saved === 'dark') root.setAttribute('data-theme','dark');

  if(btn){
    btn.addEventListener('click', function(){
      const isDark = root.getAttribute('data-theme') === 'dark';
      if(isDark){
        root.removeAttribute('data-theme');
        localStorage.setItem('vswot-theme','light');
      } else {
        root.setAttribute('data-theme','dark');
        localStorage.setItem('vswot-theme','dark');
      }
    });
  }
})();

/* ---- SCROLL PROGRESS ---- */
const bar = document.getElementById('scroll-bar');
function updateBar(){
  if(!bar) return;
  const p = window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  bar.style.width = Math.min(p,100)+'%';
}

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
function updateNav(){
  if(!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 48);
}

/* ---- MOBILE NAV ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileClose = document.getElementById('mobile-close');
if(hamburger && mobileNav){
  hamburger.addEventListener('click',()=>{
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open')?'hidden':'';
  });
}
if(mobileClose && mobileNav){
  mobileClose.addEventListener('click',()=>{ mobileNav.classList.remove('open'); document.body.style.overflow=''; });
}
if(mobileNav){
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ mobileNav.classList.remove('open'); document.body.style.overflow=''; }));
}

/* ---- FADE-UP OBSERVER ---- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }});
},{threshold:0.1,rootMargin:'0px 0px -32px 0px'});
document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));

/* ---- COUNT-UP ---- */
function countUp(el){
  const target = parseFloat(el.dataset.target);
  const dec = target%1!==0;
  const dur = 1800;
  const start = performance.now();
  function step(now){
    const p = Math.min((now-start)/dur,1);
    const ease = 1-Math.pow(1-p,3);
    el.textContent = dec?(target*ease).toFixed(1):Math.round(target*ease).toLocaleString();
    if(p<1) requestAnimationFrame(step);
    else el.textContent = dec?target.toFixed(1):target.toLocaleString();
  }
  requestAnimationFrame(step);
}
const cio = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting&&!e.target.dataset.counted){ e.target.dataset.counted=1; countUp(e.target); cio.unobserve(e.target); }});
},{threshold:0.5});
document.querySelectorAll('.count-up').forEach(el=>cio.observe(el));

/* ---- FAQ ---- */
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  if(q) q.addEventListener('click',()=>{
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!open) item.classList.add('open');
  });
});

/* ---- CONTACT FORM ---- */
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const succ = document.getElementById('form-success');
    btn.textContent='Sending…'; btn.disabled=true;
    await new Promise(r=>setTimeout(r,1100));
    form.style.display='none';
    if(succ) succ.style.display='block';
  });
}

/* ---- ANIMATED HERO BAR CHART ---- */
const bars = document.querySelectorAll('.dash-bar');
if(bars.length){
  const heights = [30,45,28,60,42,75,52,88,65,95];
  bars.forEach((b,i)=>{ b.style.height = heights[i]+'%'; });
  let idx=0;
  setInterval(()=>{
    bars.forEach(b=>b.classList.remove('active'));
    idx=(idx+1)%bars.length;
    bars[idx].classList.add('active');
  }, 800);
}

/* ---- SCROLL LISTENER ---- */
window.addEventListener('scroll',()=>{ updateBar(); updateNav(); },{passive:true});
updateBar(); updateNav();

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1);
    const el=document.getElementById(id);
    if(el){ e.preventDefault(); window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-76,behavior:'smooth'}); }
  });
});

})();
