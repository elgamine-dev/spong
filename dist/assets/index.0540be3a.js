import{k as h}from"./vendor.ceaa6892.js";const f=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function d(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(o){if(o.ep)return;o.ep=!0;const r=d(o);fetch(o.href,r)}};f();const n=h({width:1200,height:500,root:document.getElementById("app")}),c={froggySpeed:200},g={touches:0,wave:1,lives:3,locked:!1,dropzoneSize:0,padSize:190,ballSpeed:400},i=new Proxy(g,{set:function(t,e,d){const l=y(e,d);return w(e,l),t[e]=l,!0}}),m=()=>pos(width()/2-5,height()/2-5);loadSprite("pad","./pad.png");loadSprite("ball","./ball.png");n.scene("welcome",()=>{add([rect(width(),height()),pos(0,0),color(0,0,0)]),add([text("spong",{size:50,font:"sink"}),origin("center"),pos(width()/2,height()/2)]),keyDown("space",()=>{n.go("game")})});n.scene("game",()=>{layers(["background","ui","game"],"game");const t=add([pos(20,180),rect(15,i.padSize),area(),solid(),outline(1),health(3),layer("game"),color(255,255,255),"pad"]),e=add([pos(300,300),solid(),area(),m(),origin("center"),layer("game"),z(200),sprite("ball"),"ball",{dir:vec2(1,-.6),speed:400}]);add([pos(0,497),rect(width(),3),solid(),area(),color(120,120,120),"wall"]),add([pos(0,0),rect(width(),3),solid(),area(),color(120,120,120),"wall"]),add([pos(1197,0),rect(3,height()),solid(),area(),color(120,120,120),"backwall"]),add([pos(0,0),rect(10,height()),solid(),area(),color(0,0,0),"hell"]),add([pos(598,0),rect(4,height()),color(30,30,30),layer("background"),z(-1)]),add([rect(width(),height()),color(0,0,0),layer("background"),z(-100)]);const d=add([rect(i.dropzoneSize,height()),pos(0,0),color(100,0,0),z(-99),layer("background"),"dropzone"]),l=b();keyDown("a",()=>{i.locked||t.move(0,-c.froggySpeed)}),keyDown("q",()=>{i.locked||t.move(0,c.froggySpeed)}),action("ball",o=>{o.move(o.dir.scale(i.ballSpeed)),o.pos.x<i.dropzoneSize&&o.dir.x<0?(i.locked=!0,t.use(color(0,0,255))):(i.locked=!1,t.use(color(255,255,255)))}),collides("ball","pad",(o,r,s)=>{e.dir=vec2(-1*e.dir.x,e.dir.y+(Math.random()-.5)/10),i.touches++,t.use(outline(1)),setTimeout(()=>{t.use(outline(0))},100)}),collides("ball","backwall",(o,r,s)=>{e.dir=vec2(-1*e.dir.x,e.dir.y+(Math.random()-.5)/10),e.speed=e.speed+5}),collides("ball","wall",()=>{e.dir=vec2(e.dir.x,-1*e.dir.y)}),collides("ball","obstacle",(o,r,s)=>{e.dir=vec2(e.dir.x,-1*e.dir.y)}),collides("ball","hell",()=>{shake(10),t.hurt(1),e.moveTo(width()/2-5,height()/2-5),i.lives=t.hp(),i.dropzoneSize=0}),t.on("death",()=>{destroy(t),destroy(e),add([text("GAME OVER",{size:150,font:"sink"}),color(200,20,20),origin("center"),pos(width()/2,height()/2)]),setTimeout(()=>{n.go("welcome")},2e3)}),a("dropzoneSize",o=>{d.use(rect(o,height()))}),a("touches",o=>{i.dropzoneSize+=100}),a("wave",o=>{i.padSize-=15,t.use(rect(15,i.padSize)),i.ballSpeed+=25,l("waves",o)}),a("lives",o=>{l("lives",o)}),a("ballSpeed",o=>{l("speed",o)})});n.go("welcome");focus();const p=[];function a(t,e){p.push({key:t,cb:e})}function w(t,e){p.filter(d=>d.key===t).map(d=>d.cb(e))}let u={dropzoneSize:t=>t>width()/2?(i.wave++,0):Math.min(width()/2,t)};function y(t,e){return typeof u[t]=="function"?u[t](e):e}function b(){add([text("balls",{size:15,font:"sink"}),pos(width()/2-50,20),origin("center"),color(120,120,120),layer("ui")]),add([text("wave",{size:15,font:"sink"}),pos(width()/2+50,20),origin("center"),color(120,120,120),layer("ui")]);const t={lives:add([text(i.lives,{size:50,font:"sink"}),pos(width()/2-50,60),origin("center"),color(120,120,120),layer("ui")]),waves:add([text(i.wave,{size:50,font:"sink"}),pos(width()/2+50,60),origin("center"),color(120,120,120),layer("ui")]),speed:add([text(i.ballSpeed,{size:20,font:"sink"}),pos(570,height()-20),origin("center"),layer("ui"),color(120,120,120)])};return function(d,l){t[d].text=l}}