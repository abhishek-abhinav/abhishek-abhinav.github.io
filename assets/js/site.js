
(() => {
 const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

 // Theme preference: light by default, with a persistent dark-mode option.
 const root=document.documentElement;
 const savedTheme=localStorage.getItem('abhishek-portfolio-theme');
 root.dataset.theme=savedTheme==='dark'?'dark':'light';

 const nav=document.querySelector('.site-header .nav');

 if(nav && !document.getElementById('themeToggle')){
   const toggle=document.createElement('button');
   toggle.type='button';
   toggle.id='themeToggle';
   toggle.className='theme-toggle';
   toggle.setAttribute('aria-label','Switch to dark theme');

   const paintToggle=()=>{
     const dark=root.dataset.theme==='dark';
     toggle.innerHTML=dark?'☀ <span>Light</span>':'☾ <span>Dark</span>';
     toggle.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
     toggle.setAttribute('aria-pressed',String(dark));
   };

   toggle.addEventListener('click',()=>{
     const next=root.dataset.theme==='dark'?'light':'dark';
     root.dataset.theme=next;
     try{localStorage.setItem('abhishek-portfolio-theme',next)}catch(e){}
     paintToggle();
   });

   const cta=nav.querySelector('.nav-cta');
   const brand=nav.querySelector('.brand-logo');

   if(brand) brand.insertAdjacentElement('afterend',toggle);
   else if(cta) nav.insertBefore(toggle,cta);
   else nav.appendChild(toggle);

   paintToggle();
 }

 const projects=window.PORTFOLIO_PROJECTS||[];

 const featured=[
   'meta-lead-nurture',
   'instagram-analytics-dashboard',
   'content-intelligence',
   'analytics-ai-agent',
   'social-media-auto-posting',
   'whatsapp-task-assistant'
 ];

 const makeCard=p=>`
 <a class="card project-card reveal" href="projects/${p.slug}.html" aria-label="Open case study: ${p.title}">
   <div class="card-top">
     <span class="pill">${p.category}</span>
     <span class="muted">CASE STUDY ↗</span>
   </div>
   <h3>${p.title}</h3>
   <p>${p.summary}</p>
   <div class="tags">
     ${p.stack.split(',').slice(0,3).map(t=>`<span>${t.trim()}</span>`).join('')}
   </div>
   <span class="card-link">Explore detailed case study →</span>
 </a>`;

 const featuredEl=$('#featuredProjects');

 if(featuredEl){
   featuredEl.innerHTML=featured
     .map(s=>projects.find(p=>p.slug===s))
     .filter(Boolean)
     .map(makeCard)
     .join('');
 }

 const allEl=$('#allProjects');
 const filters=$('#filters');

 if(allEl&&filters){
   const cats=['All',...new Set(projects.map(p=>p.category))];
   let active='All';

   filters.innerHTML=cats.map((c,i)=>
     `<button class="filter-btn ${i===0?'active':''}" data-cat="${c}">${c}</button>`
   ).join('');

   const render=()=>{
     allEl.innerHTML=projects
       .filter(p=>active==='All'||p.category===active)
       .map(makeCard)
       .join('')||'<p class="empty-note">No projects in this category.</p>';

     observeReveals();
   };

   render();

   $$('.filter-btn',filters).forEach(b=>
     b.addEventListener('click',()=>{
       active=b.dataset.cat;
       $$('.filter-btn',filters).forEach(x=>
         x.classList.toggle('active',x===b)
       );
       render();
     })
   );
 }

 const start=new Date(2024,3,1);

 function updateExperience(){
   const now=new Date();

   let months=Math.max(
     0,
     (now.getFullYear()-start.getFullYear())*12+
     now.getMonth()-start.getMonth()
   );

   if(now.getDate()<start.getDate()) months--;

   const y=Math.floor(months/12);
   const m=months%12;

   const label=`${y} year${y===1?'':'s'}${m?` ${m} month${m===1?'':'s'}`:''}`;

   const hero=$('#heroExperience');
   const exact=$('#experienceExact');
   const decimal=$('#experienceDecimal');

   if(hero) hero.textContent=label;
   if(exact) exact.textContent=label;
   if(decimal) decimal.textContent=(months/12).toFixed(1)+' years';
 }

 updateExperience();

 const year=$('#year');
 if(year) year.textContent=new Date().getFullYear();

 const menu=$('#menuBtn');
 const links=$('#navLinks');

 if(menu&&links){
   menu.addEventListener('click',()=>{
     const open=links.classList.toggle('open');
     menu.setAttribute('aria-expanded',String(open));
   });
 }

 $$('.nav-links a').forEach(a=>
   a.addEventListener('click',()=>{
     links?.classList.remove('open');
     menu?.setAttribute('aria-expanded','false');
   })
 );

 function observeReveals(){
   const els=$$('.reveal:not(.is-visible)');

   if(!('IntersectionObserver'in window)){
     els.forEach(e=>e.classList.add('is-visible'));
     return;
   }

   const io=new IntersectionObserver(entries=>
     entries.forEach(e=>{
       if(e.isIntersecting){
         e.target.classList.add('is-visible');
         io.unobserve(e.target);
       }
     }),
     {threshold:.12}
   );

   els.forEach(e=>io.observe(e));
 }

 observeReveals();

 const modal=$('#showreelModal');
 const frame=$('#showreelFrame');
 const open=$('#showreelOpen');
 const close=$('#showreelClose');

 function showModal(){
   if(!modal)return;

   modal.classList.add('open');
   modal.setAttribute('aria-hidden','false');

   frame.referrerPolicy='strict-origin-when-cross-origin';
   frame.src=frame.dataset.src;

   document.body.style.overflow='hidden';
 }

 function hideModal(){
   if(!modal)return;

   modal.classList.remove('open');
   modal.setAttribute('aria-hidden','true');

   frame.src='';
   document.body.style.overflow='';
 }

 open?.addEventListener('click',showModal);
 close?.addEventListener('click',hideModal);

 modal?.querySelectorAll('[data-close-modal]').forEach(x=>
   x.addEventListener('click',hideModal)
 );

 document.addEventListener('keydown',e=>{
   if(e.key==='Escape')hideModal();
 });

})();
