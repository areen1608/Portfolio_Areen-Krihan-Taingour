const filters=document.querySelectorAll('.filter');const cards=document.querySelectorAll('.project-card');filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');const filter=button.dataset.filter;cards.forEach(card=>card.hidden=filter!=='all'&&!card.dataset.categories.split(' ').includes(filter))}));const menu=document.querySelector('#menuButton');const nav=document.querySelector('.site-header nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));const progress=document.querySelector('#progress');function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=(total>0?scrollY/total*100:0)+'%'}addEventListener('scroll',updateProgress,{passive:true});updateProgress();document.querySelector('#year').textContent=new Date().getFullYear();


// Stack: staggered chips, scroll reveal, logo marquee
const stack=document.querySelector('#stack');
const toolRows=stack.querySelectorAll('.tool-row');
toolRows.forEach(row=>row.querySelectorAll('.chip').forEach((chip,i)=>chip.style.setProperty('--i',i)));

const track=stack.querySelector('.marquee-track');
const items=[...stack.querySelectorAll('.tool-row .chip')].map(chip=>{
  const span=document.createElement('span');
  const icon=chip.querySelector('i');
  if(icon){const i=document.createElement('i');i.className=icon.className.replace(' colored','');span.append(i);}
  span.append(chip.lastChild.textContent.trim());
  return span;
});
track.append(...items,...items.map(s=>s.cloneNode(true)));

if('IntersectionObserver' in window){
  stack.classList.add('reveal-ready');
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
  }),{threshold:.25});
  toolRows.forEach(r=>io.observe(r));
}

// Experience: scroll-filled line + reveal
const exp=document.querySelector('#experience');
if(exp){
  const expTrack=exp.querySelector('.exp-track');
  function updateExp(){
    const r=expTrack.getBoundingClientRect();
    const p=Math.min(Math.max((innerHeight*.6-r.top)/r.height,0),1);
    expTrack.style.setProperty('--p',p.toFixed(3));
  }
  addEventListener('scroll',updateExp,{passive:true});updateExp();

  if('IntersectionObserver' in window){
    exp.classList.add('exp-ready');
    const expIO=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');expIO.unobserve(e.target);}
    }),{threshold:.2});
    exp.querySelectorAll('.exp-item').forEach(i=>expIO.observe(i));
  }
}

// Hero: rotating word, Jaipur clock, mouse parallax
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

const swap=document.querySelector('#swap');
if(swap&&!calm&&swap.animate){
  const words=['data','signals','models','patterns'];let w=0;
  setInterval(()=>{
    swap.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-25%)'}],{duration:300,easing:'ease-in'}).onfinish=()=>{
      w=(w+1)%words.length;swap.textContent=words[w];
      swap.animate([{opacity:0,transform:'translateY(25%)'},{opacity:1,transform:'none'}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)'});
    };
  },2800);
}

const clock=document.querySelector('#clock');
if(clock){
  const fmt=new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Kolkata'});
  const tick=()=>clock.textContent=fmt.format(new Date())+' IST';
  tick();setInterval(tick,30000);
}

const hero=document.querySelector('.hero');
if(hero&&!calm&&matchMedia('(pointer:fine)').matches){
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    hero.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));
    hero.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));
  });
  hero.addEventListener('mouseleave',()=>{hero.style.setProperty('--mx',0);hero.style.setProperty('--my',0)});
}


// About: code typing reveal, counters, fact cards
const about=document.querySelector('#about');
if(about&&'IntersectionObserver' in window){
  about.classList.add('about-ready');
  about.querySelectorAll('.code-card .ln').forEach((l,i)=>l.style.setProperty('--l',i));
  about.querySelectorAll('.fact').forEach((f,i)=>f.style.setProperty('--f',i));

  const countUp=el=>{
    const end=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),pad=dec?0:2,t0=performance.now(),dur=1400;
    const step=now=>{
      const p=Math.min((now-t0)/dur,1),v=end*(1-Math.pow(1-p,3));
      el.textContent=dec?v.toFixed(dec):String(Math.round(v)).padStart(pad,'0');
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const aboutIO=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(!e.isIntersecting)return;
    if(e.target.classList.contains('about-stats'))e.target.querySelectorAll('[data-count]').forEach(countUp);
    else e.target.classList.add('in');
    aboutIO.unobserve(e.target);
  }),{threshold:.3});
  about.querySelectorAll('.code-card,.fact,.about-stats').forEach(el=>aboutIO.observe(el));
}else{
  document.querySelectorAll('#about [data-count]').forEach(el=>el.textContent=el.dataset.count);
}


// Contact: reveal, copy email, clock, magnetic button, orbit parallax
const contact=document.querySelector('#contact');
if(contact){
  contact.querySelectorAll('.contact-list li').forEach((li,i)=>li.style.setProperty('--n',i));
  if('IntersectionObserver' in window){
    contact.classList.add('contact-ready');
    const cIO=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){contact.classList.add('in');cIO.disconnect();}
    }),{threshold:.2});
    cIO.observe(contact);
  }

  const copyBtn=contact.querySelector('#copyMail');
  copyBtn?.addEventListener('click',async()=>{
    const label=copyBtn.querySelector('.copy-text');
    try{await navigator.clipboard.writeText(copyBtn.dataset.mail);label.textContent='✓ COPIED';}
    catch{label.textContent=copyBtn.dataset.mail;}
    copyBtn.classList.add('done');
    setTimeout(()=>{label.textContent='COPY EMAIL';copyBtn.classList.remove('done');},2000);
  });

  const cClock=contact.querySelector('#contactClock');
  if(cClock){
    const f=new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Kolkata'});
    const t=()=>cClock.textContent=f.format(new Date());t();setInterval(t,30000);
  }

  if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const mag=contact.querySelector('.magnetic');
    mag?.addEventListener('mousemove',e=>{
      const r=mag.getBoundingClientRect();
      mag.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;
    });
    mag?.addEventListener('mouseleave',()=>mag.style.transform='');

    contact.addEventListener('mousemove',e=>{
      const r=contact.getBoundingClientRect();
      contact.style.setProperty('--cx',((e.clientX-r.left)/r.width-.5).toFixed(3));
      contact.style.setProperty('--cy',((e.clientY-r.top)/r.height-.5).toFixed(3));
    });
  }
}

// Work: filter count, in-view animations, tilt + GitHub cursor
const work=document.querySelector('#work');
if(work){
  const wCards=[...work.querySelectorAll('.project-card')];
  const pad=n=>String(n).padStart(2,'0');
  const wCount=work.querySelector('#workCount');
  work.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{
    if(wCount)wCount.textContent=`SHOWING ${pad(wCards.filter(c=>!c.hidden).length)} / ${pad(wCards.length)}`;
  }));

  work.querySelectorAll('.loan-bars i').forEach((b,i)=>b.style.setProperty('--b',i));
  if('IntersectionObserver' in window){
    work.classList.add('work-ready');
    const wIO=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');wIO.unobserve(e.target);}
    }),{threshold:.25});
    wCards.forEach(c=>wIO.observe(c));
  }

  // clicking the artwork opens the repo
  wCards.forEach(card=>{
    const url=card.dataset.github;
    if(!url)return;
    card.querySelector('.art').addEventListener('click',()=>window.open(url,'_blank','noopener'));
  });

  if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const bubble=document.createElement('div');
    bubble.className='view-cursor';bubble.textContent='GITHUB ↗';document.body.append(bubble);
    work.querySelectorAll('.art').forEach(art=>{
      art.addEventListener('mousemove',e=>{
        const r=art.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        art.style.setProperty('--ry',(x*7).toFixed(2)+'deg');
        art.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');
        bubble.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
        bubble.classList.add('show');
      });
      art.addEventListener('mouseleave',()=>{
        art.style.setProperty('--rx','0deg');art.style.setProperty('--ry','0deg');
        bubble.classList.remove('show');
      });
    });
  }
}