(function(){
var root=document.documentElement;
root.classList.add('js');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var stat=reduce||location.hash==='#statique';
if(stat)root.classList.add('static');
var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var fmt=function(v,d){return (d?v.toFixed(d):Math.round(v)).toString().replace('.',',')};

/* Citations : liste a focus */
var qs=$('.q'),ims=$('.impl');
function setQ(i){qs.forEach(function(q,k){q.classList.toggle('on',k===i);q.setAttribute('aria-expanded',k===i)});ims.forEach(function(m,k){m.classList.toggle('on',k===i)})}
qs.forEach(function(q,i){q.addEventListener('click',function(){setQ(i)});});
setQ(0);

/* Compteurs */
function counters(){
 $('[data-count]').forEach(function(el){
  var to=parseFloat(el.getAttribute('data-count')),d=parseInt(el.getAttribute('data-dec')||'0',10);
  if(stat||!window.gsap){el.textContent=fmt(to,d);return}
  var o={v:0};el.textContent=fmt(0,d);
  ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:function(){
   gsap.to(o,{v:to,duration:1.6,ease:'expo.out',onUpdate:function(){el.textContent=fmt(o.v,d)}});
  }});
 });
}

if(!window.gsap||stat){
 counters();
 $('.rv').forEach(function(e){e.style.opacity=1;e.style.transform='none'});
 return;
}
gsap.registerPlugin(ScrollTrigger);
var mm=gsap.matchMedia();

/* Revelations */
ScrollTrigger.batch('.rv',{start:'top 90%',once:true,onEnter:function(b){
 gsap.to(b,{opacity:1,y:0,duration:.8,ease:'expo.out',stagger:.09,overwrite:true});
}});

/* Hero : entree en deux plans */
gsap.from('.hero h1',{y:40,opacity:0,duration:1.1,ease:'expo.out',delay:.1});
gsap.from('.player',{y:60,opacity:0,duration:1.2,ease:'expo.out',delay:.35});
gsap.to('.halo',{y:120,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.player',{y:-30,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

counters();

mm.add('(min-width: 1001px)',function(){
 /* Citations epinglees */
 var stage=document.querySelector('.q-stage');
 if(stage&&qs.length){
  ScrollTrigger.create({trigger:stage,start:'top 84px',end:'+='+(qs.length*55)+'%',pin:true,anticipatePin:1,
   onUpdate:function(s){var i=Math.min(qs.length-1,Math.floor(s.progress*qs.length));setQ(i)}});
 }
 /* Pipe horizontal epingle */
 var wrap=document.querySelector('.pipe-wrap'),track=document.querySelector('.pipe-track'),rail=document.querySelector('.rail i'),rs=$('.rouage');
 if(wrap&&track){
  var dist=function(){return Math.max(0,track.scrollWidth-window.innerWidth+40)};
  var tw=gsap.to(track,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:wrap,start:'top 12%',end:function(){return '+='+(dist()+200)},pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true,
   onUpdate:function(s){
    if(rail)rail.style.width=(s.progress*100)+'%';
    var idx=Math.min(rs.length-1,Math.round(s.progress*(rs.length-1)));
    rs.forEach(function(r,k){r.classList.toggle('on',k===idx)});
   }}});
 }
});
mm.add('(max-width: 1000px)',function(){
 /* Mobile : le pipe se lit en carrousel tactile */
 var view=document.querySelector('.pipe-view');
 if(view){view.style.overflowX='auto';view.style.webkitOverflowScrolling='touch'}
 var rs=$('.rouage');rs.forEach(function(r){r.classList.add('on')});
});

/* Tableaux de bord : dessines au defilement */
$('.bar').forEach(function(b,i){gsap.set(b,{transformOrigin:'0 50%'});
 gsap.from(b,{scaleX:0,duration:1.1,ease:'expo.out',delay:(i%2)*.12,scrollTrigger:{trigger:b.closest('svg'),start:'top 80%',once:true}});});
$('.bl').forEach(function(t,i){gsap.from(t,{opacity:0,duration:.6,delay:.9+(i%6)*.05,ease:'expo.out',scrollTrigger:{trigger:t.closest('svg'),start:'top 80%',once:true}});});
$('.vbar').forEach(function(b,i){gsap.set(b,{transformBox:'fill-box',transformOrigin:'50% 100%'});
 gsap.from(b,{scaleY:0,duration:1,ease:'expo.out',delay:i*.05,scrollTrigger:{trigger:b.closest('svg'),start:'top 80%',once:true}});});
$('.dot').forEach(function(d,i){gsap.set(d,{transformBox:'fill-box',transformOrigin:'50% 50%'});
 gsap.from(d,{scale:0,opacity:0,duration:.8,ease:'expo.out',delay:i*.08,scrollTrigger:{trigger:d.closest('svg'),start:'top 80%',once:true}});});
$('.sg').forEach(function(s,i){gsap.from(s,{scaleX:0,transformOrigin:'0 50%',duration:1,ease:'expo.out',delay:i*.07,scrollTrigger:{trigger:s.closest('.seg'),start:'top 85%',once:true}});});
$('.risk').forEach(function(r,i){gsap.from(r,{x:-24,opacity:0,duration:.7,ease:'expo.out',delay:i*.06,scrollTrigger:{trigger:r.parentNode,start:'top 85%',once:true}});});
$('.logo').forEach(function(l,i){gsap.from(l,{y:20,opacity:0,duration:.7,ease:'expo.out',delay:i*.05,scrollTrigger:{trigger:l.parentNode,start:'top 88%',once:true}});});

window.addEventListener('load',function(){ScrollTrigger.refresh()});
})();
