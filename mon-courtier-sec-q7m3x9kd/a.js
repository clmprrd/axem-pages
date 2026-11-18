(function(){
'use strict';
var D=document,R=D.documentElement;
function $(s,c){return (c||D).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))}
var G=window.gsap,ST=window.ScrollTrigger;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
if(G&&ST&&!reduce){R.classList.add('js');G.registerPlugin(ST)}
var JS=R.classList.contains('js');
var TOP=56;
var pr=$('.pr');
function prog(){var h=R.scrollHeight-innerHeight;if(pr)pr.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
addEventListener('scroll',prog,{passive:true});prog();
var navs=$$('.top nav a');
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){navs.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
navs.forEach(function(a){var t=$(a.getAttribute('href'));if(t)io.observe(t)});
}
var lb=$('#lb');
$$('[data-zoom]').forEach(function(w){w.addEventListener('click',function(){var i=$('img',w);$('img',lb).src=i.src;$('img',lb).alt=i.alt;$('.t',lb).textContent=w.getAttribute('data-zoom');lb.showModal()})});
$$('[data-close]').forEach(function(b){b.addEventListener('click',function(){b.closest('dialog').close()})});
$$('dialog').forEach(function(d){d.addEventListener('click',function(e){if(e.target===d)d.close()})});
$$('[data-print]').forEach(function(b){b.addEventListener('click',function(){window.print()})});
$$('[data-open]').forEach(function(b){b.addEventListener('click',function(){var d=$(b.getAttribute('data-open'));if(d)d.showModal()})});
$$('a.src').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var d=$('#sources');d.showModal();var t=$('#s'+a.getAttribute('data-n'),d);if(t){t.scrollIntoView({block:'center'});t.style.background='#E8EDFF'}})});
var picks={};
$$('.q').forEach(function(q){$$('.opt',q).forEach(function(o){o.addEventListener('click',function(){$$('.opt',q).forEach(function(x){x.classList.remove('on')});o.classList.add('on');picks[q.getAttribute('data-q')]=o.textContent.trim()})})});
var cp=$('#copier');
if(cp)cp.addEventListener('click',function(){
var lines=['Mes réponses sur la page Mon Courtier :'];
$$('.q').forEach(function(q){var k=q.getAttribute('data-q');lines.push(k+' : '+(picks[k]||'à voir ensemble'))});
var t=lines.join('\n'),done=function(){cp.textContent='Copié, à coller dans votre réponse';setTimeout(function(){cp.textContent='Copier mes réponses, à coller dans le mail'},3200)};
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){prompt('Copiez ce texte :',t)})}else{prompt('Copiez ce texte :',t)}
});
(function(){
var mq=window.matchMedia('(max-width:899px)');
function place(){
var steps=$$('#parcours .stp'),panes=$$('#parcours .pane');
if(!panes.length)return;
if(mq.matches){panes.forEach(function(p,i){var s=steps[i];if(s)$('.std',s).appendChild(p)});}
else{var box=$('#parcours .panes');panes.forEach(function(p){box.appendChild(p)})}
}
place();
if(mq.addEventListener)mq.addEventListener('change',function(){place();if(window.ScrollTrigger)ScrollTrigger.refresh()});
})();
if(!JS)return;
G.from('.hero .rv',{y:26,opacity:0,duration:.7,ease:'expo.out',stagger:.09,delay:.1});
ST.batch('.rv2',{start:'top 88%',once:true,onEnter:function(b){G.fromTo(b,{y:30,opacity:0},{y:0,opacity:1,duration:.7,ease:'expo.out',stagger:.09})}});
G.set('.rv2',{opacity:0});
var mm=G.matchMedia();
mm.add('(min-width:900px)',function(){
(function(){
var sec=$('#parcours');if(!sec)return;
var steps=$$('.stp',sec),panes=$$('.pane',sec),dots=$$('.rail i',sec),doc=$('.doc',sec),rail=$('.rail',sec),n=steps.length,cur=-1;
function place(){dots.forEach(function(d,i){d.style.top=((i+.5)/n*100)+'%'})}
place();
function set(i){if(i===cur)return;cur=i;steps.forEach(function(s,k){s.classList.toggle('on',k===i)});panes.forEach(function(p,k){p.classList.toggle('on',k===i)});dots.forEach(function(d,k){d.classList.toggle('on',k<=i)});
var h=rail.offsetHeight-doc.offsetHeight+10;var y=((i+.5)/n)*rail.offsetHeight-doc.offsetHeight/2-22+14;
G.to(doc,{y:Math.max(0,y),duration:.8,ease:'expo.out'});
}
set(0);
var st=ST.create({trigger:$('.pinwrap',sec),start:'top '+TOP+'px',end:'+='+(n*46)+'%',pin:true,onUpdate:function(s){set(Math.min(n-1,Math.floor(s.progress*n*.999)))}});
steps.forEach(function(s,i){$('.stt',s).addEventListener('click',function(){var y=st.start+(i+.5)/n*(st.end-st.start);window.scrollTo({top:y,behavior:'smooth'})})});
})();
(function(){
var sec=$('#pieces');if(!sec)return;
var grp=$$('.grp',sec),lg=$$('.legend li',sec),n=grp.length,cur=-1;
function set(i){if(i===cur)return;cur=i;grp.forEach(function(g,k){$$('.msg',g).forEach(function(m){m.classList.toggle('on',k<i||(k===i))})});lg.forEach(function(l,k){l.classList.toggle('on',k===i)})}
set(0);
ST.create({trigger:$('.pinwrap',sec),start:'top '+TOP+'px',end:'+='+(n*40)+'%',pin:true,onUpdate:function(s){set(Math.min(n-1,Math.floor(s.progress*n*.999)))}});
})();
(function(){
var sec=$('#pilote');if(!sec||!$('.irisw',sec))return;
var L=$$('.iris',sec),dots=$$('.pdots i',sec);
var cur=-1;
function set(k){if(k===cur)return;cur=k;L.forEach(function(l,j){l.classList.toggle('on',j===k)});dots.forEach(function(d,j){d.classList.toggle('on',j<=k)})}
set(0);
ST.create({trigger:$('.irisw',sec),start:'top '+TOP+'px',end:'+='+(L.length*36)+'%',pin:true,onUpdate:function(s){set(Math.min(L.length-1,Math.floor(s.progress*L.length*.999)))}});
})();
});
(function(){
var fin=$('.fin');if(!fin)return;
if(innerWidth<900){fin.classList.add('lit');G.set('.fin .flood',{clipPath:'inset(0 0 0 0)'});return}
G.fromTo('.fin .flood',{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0 0 0 0)',ease:'none',scrollTrigger:{trigger:fin,start:'top 80%',end:'top 10%',scrub:true,onUpdate:function(s){fin.classList.toggle('lit',s.progress>.55)}}});
})();
addEventListener('load',function(){ST.refresh()});
})();