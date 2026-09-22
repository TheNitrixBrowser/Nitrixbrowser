'use strict'
const {app,BrowserWindow}=require('electron')
const assert=require('node:assert/strict')
const {setTextMask}=require('../browser-core')["backdrop-content"]
app.commandLine.appendSwitch('ozone-platform','headless')
app.whenReady().then(async()=>{
  const win=new BrowserWindow({show:true,width:800,height:600,webPreferences:{sandbox:true}})
  try {
    await win.loadURL('data:text/html,'+encodeURIComponent('<body style="margin:0;background:white"><p style="position:absolute;left:100px;top:100px;margin:0;color:black;font:24px sans-serif">MASK ME</p><div style="position:absolute;left:100px;top:160px;width:200px;height:20px;background:repeating-linear-gradient(90deg,green 0 5px,white 5px 10px)"></div></body>'))
    const wc=win.webContents
    await new Promise(r=>setTimeout(r,300))
    const before=(await wc.capturePage({x:100,y:100,width:200,height:30})).toBitmap()
    await setTextMask(wc,[{x:0,y:0,width:1,height:1}])
    await new Promise(r=>setTimeout(r,150))
    const after=(await wc.capturePage({x:100,y:100,width:200,height:30})).toBitmap()
    const dark=b=>{let n=0;for(let i=0;i<b.length;i+=4)if(b[i]<80&&b[i+1]<80&&b[i+2]<80)n++;return n}
    console.log('dark pixels',dark(before),dark(after))
    assert.ok(dark(before)>30)
    assert.ok(dark(after)<dark(before)/5)
    await setTextMask(wc,[])
    await new Promise(r=>setTimeout(r,100))
    assert.equal(dark((await wc.capturePage({x:100,y:100,width:200,height:30})).toBitmap()),dark(before))
    const edgeRegion=await wc.executeJavaScript(`(()=>{const r=document.createRange();r.setStart(document.querySelector('p').firstChild,0);r.setEnd(document.querySelector('p').firstChild,1);const b=r.getBoundingClientRect();return {x:(b.left+b.width/2)/innerWidth,y:b.top/innerHeight,width:(innerWidth-b.left-b.width/2)/innerWidth,height:b.height/innerHeight}})()`)
    await setTextMask(wc,[edgeRegion])
    await new Promise(r=>setTimeout(r,100))
    assert.ok(dark((await wc.capturePage({x:100,y:100,width:200,height:30})).toBitmap())<dark(before)/5,'letters touching the popup edge are concealed too')
    await setTextMask(wc,[])
    await wc.executeJavaScript(`(()=>{const button=document.createElement('input');button.type='submit';button.value='Szukaj w Google';button.id='google-submit';button.style.cssText='position:absolute;left:100px;top:210px;width:250px;height:45px;border:1px solid #888;background:white;color:black;font:22px Arial';document.body.appendChild(button)})()`)
    await new Promise(r=>setTimeout(r,100))
    const controlRect={x:105,y:215,width:240,height:32}
    const controlBefore=dark((await wc.capturePage(controlRect)).toBitmap())
    assert.ok(controlBefore>30)
    await setTextMask(wc,[{x:0,y:0,width:1,height:1}])
    await new Promise(r=>setTimeout(r,100))
    assert.ok(dark((await wc.capturePage(controlRect)).toBitmap())<controlBefore/5,'submit control lettering is concealed')
    assert.equal(await wc.executeJavaScript('document.getElementById("google-submit").value'),'Szukaj w Google')
    await setTextMask(wc,[])
    await new Promise(r=>setTimeout(r,100))
    assert.equal(dark((await wc.capturePage(controlRect)).toBitmap()),controlBefore,'submit lettering restored without changing value')
    await wc.executeJavaScript(`(()=>{
      const fragment=document.createDocumentFragment();
      for(let i=0;i<6500;i++){const span=document.createElement('span');span.textContent='offscreen';span.style.cssText='position:absolute;top:2000px';fragment.appendChild(span)}
      const p=document.createElement('p');p.id='late-text';p.textContent='LAST TEXT';p.style.cssText='position:absolute;left:100px;top:310px;margin:0;font:24px Arial;color:black';fragment.appendChild(p);
      document.body.appendChild(fragment);
    })()`)
    const stressRect={x:100,y:310,width:200,height:30}
    await new Promise(r=>setTimeout(r,200))
    const stressBefore=dark((await wc.capturePage(stressRect)).toBitmap())
    assert.ok(stressBefore>30)
    await setTextMask(wc,[{x:0,y:0,width:0.9,height:0.9}])
    await new Promise(r=>setTimeout(r,1500))
    assert.ok(dark((await wc.capturePage(stressRect)).toBitmap())<stressBefore/5,'partial mask scans beyond 6000 nodes')
    await setTextMask(wc,[{x:0,y:0,width:1,height:1}])
    await wc.executeJavaScript(`document.getElementById('late-text').textContent='DYNAMIC TEXT';document.getElementById('late-text').style.webkitTextFillColor='black'`)
    await new Promise(r=>setTimeout(r,150))
    assert.equal(dark((await wc.capturePage(stressRect)).toBitmap()),0,'full mask covers dynamically changed text and explicit text fill')
    await setTextMask(wc,[])
    await new Promise(r=>setTimeout(r,100))
    assert.ok(dark((await wc.capturePage(stressRect)).toBitmap())>30,'dynamic text restored')
    await wc.executeJavaScript(`(()=>{
      const host=document.createElement('div');host.id='shadow-fixture';host.style.cssText='position:absolute;left:100px;top:380px';
      host.attachShadow({mode:'open'}).innerHTML='<style>span{font:24px Arial;color:black}span::before{content:"PREFIX "}</style><span>SHADOW TEXT</span>';
      document.body.appendChild(host);
    })()`)
    await new Promise(r=>setTimeout(r,150))
    const shadowRect={x:100,y:380,width:400,height:30}
    const shadowBefore=dark((await wc.capturePage(shadowRect)).toBitmap())
    assert.ok(shadowBefore>30)
    await setTextMask(wc,[{x:0,y:0,width:0.95,height:0.95}])
    await new Promise(r=>setTimeout(r,100))
    assert.equal(dark((await wc.capturePage(shadowRect)).toBitmap()),0,'Shadow DOM and CSS-generated text hidden without OCR')
    await setTextMask(wc,[])
    await new Promise(r=>setTimeout(r,100))
    assert.equal(dark((await wc.capturePage(shadowRect)).toBitmap()),shadowBefore,'shadow text and pseudo content restored')
    await wc.executeJavaScript(`(()=>{
      const div=document.createElement('div');div.style.cssText='position:absolute;left:20px;top:440px;width:740px;color:black;font:20px Arial';
      div.innerHTML='<span class="ytAttributedStringHost ytAttributedStringWhiteSpacePreWrap" dir="auto" role="text" style="display:block;-webkit-text-fill-color:black!important">Stare reklamy Plusa  ͜+</span><yt-formatted-string class="title style-scope ytd-guide-entry-renderer" style="display:block;-webkit-text-fill-color:black!important">Shorts</yt-formatted-string>';
      document.body.appendChild(div);
    })()`)
    await new Promise(r=>setTimeout(r,100))
    const ytRect={x:20,y:440,width:350,height:60}
    const ytBefore=dark((await wc.capturePage(ytRect)).toBitmap())
    assert.ok(ytBefore>30)
    const ytRegion=await wc.executeJavaScript('({x:0,y:430/innerHeight,width:370/innerWidth,height:70/innerHeight})')
    await setTextMask(wc,[ytRegion])
    await new Promise(r=>setTimeout(r,100))
    assert.equal(dark((await wc.capturePage(ytRect)).toBitmap()),0,'YouTube text hidden even when its block extends past the panel and overrides text fill')
    await setTextMask(wc,[{x:0,y:0,width:1,height:1}])
    await setTextMask(wc,[])
    await new Promise(r=>setTimeout(r,100))
    assert.equal(dark((await wc.capturePage(ytRect)).toBitmap()),ytBefore,'return from full-page panel restores YouTube text')
    console.log('PASS DOM concealment, YouTube elements and restoration')
    app.exit(0)
  } catch(e) {console.error(e);app.exit(1)}
})
