'use strict'
const {app,BrowserWindow,nativeImage}=require('electron')
const assert=require('node:assert/strict')
const path=require('node:path')
const ocr=require(process.env.NITRIX_OCR_ROOT ? path.join(process.env.NITRIX_OCR_ROOT,'browser-core') : '../browser-core')['backdrop-content']
app.commandLine.appendSwitch('ozone-platform','headless')
const wait=ms=>new Promise(r=>setTimeout(r,ms))
// A confident but false OCR result must not erase photographic texture.
const texture=Buffer.alloc(80*60*4,255)
for(let y=0;y<60;y++)for(let x=0;x<80;x++)for(let c=0;c<3;c++)texture[(y*80+x)*4+c]=(x*37+y*71+c*53)%256
const textureCopy=Buffer.from(texture)
const candidate={confidence:98,bbox:{x0:20,y0:15,x1:55,y1:40}}
assert.equal(ocr.repairGlyphs(texture,80,60,[candidate],[{x:0,y:0,width:1,height:1}]).count,0)
assert.deepEqual(texture,textureCopy,'source picture is never mutated')
const plain=Buffer.alloc(80*60*4,255)
for(let y=15;y<=40;y++)for(let x=30;x<=34;x++)for(let c=0;c<3;c++)plain[(y*80+x)*4+c]=0
const glyph={confidence:98,bbox:{x0:30,y0:15,x1:34,y1:40}}
const edge=ocr.repairGlyphs(plain,80,60,[glyph],[{x:32/80,y:0,width:48/80,height:1}])
assert.ok(edge.count>0,'partially covered edge glyph repaired')
for(let y=0;y<60;y++)for(let x=0;x<80;x++){
  const i=(y*80+x)*4
  if(x<32)assert.equal(edge.bitmap[i+3],0,'outside popup is untouched')
  else if(edge.bitmap[i+3])assert.ok(edge.bitmap[i]>240,'edge fill does not borrow black ink outside popup')
}
assert.equal(ocr.repairGlyphs(plain,80,60,[{...glyph,confidence:40}],[{x:0,y:0,width:1,height:1}]).count,0)
app.whenReady().then(async()=>{
  const win=new BrowserWindow({show:true,width:800,height:650,webPreferences:{sandbox:true}})
  try {
    await win.loadURL('data:text/html,'+encodeURIComponent('<body style="margin:0;background:white"></body>'))
    const wc=win.webContents
    await wc.executeJavaScript(`(()=>{
      const canvas=document.createElement('canvas');canvas.width=600;canvas.height=160;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,600,160);
      ctx.fillStyle='#000000';ctx.font='bold 32px Arial';ctx.fillText('RASTER HELLO',20,55);
      for(let x=0;x<600;x+=10){ctx.fillStyle=x%20?'#00aa00':'#ddd';ctx.fillRect(x,100,10,40)}
      const image=document.createElement('img');image.src=canvas.toDataURL();image.style.cssText='position:absolute;left:30px;top:30px';document.body.appendChild(image);
      const frame=document.createElement('iframe');frame.sandbox='allow-scripts';frame.srcdoc='<body style="margin:0;background:white"><div style="font:32px Arial;color:black">EMBEDDED CONTENT</div></body>';frame.style.cssText='position:absolute;left:50px;top:250px;width:600px;height:70px;border:0';document.body.appendChild(frame);
    })()`)
    await wait(400)
    const source=await wc.capturePage(),size=source.getSize(),original=source.toBitmap()
    const result=await ocr.repair(wc,[{x:0,y:0,width:1,height:1}])
    assert.ok(result?.image && result.count>0,'offline OCR produces a repair overlay')
    const patch=nativeImage.createFromDataURL(result.image).toBitmap()
    function counts(x0,y0,x1,y1){let before=0,after=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      const i=(y*size.width+x)*4
      if(original[i]<80&&original[i+1]<80&&original[i+2]<80)before++
      const b=patch[i+3]?patch:original
      if(b[i]<80&&b[i+1]<80&&b[i+2]<80)after++
    }return {before,after}}
    const raster=counts(40,40,450,100),embedded=counts(40,245,650,310)
    console.log('Raster glyphs:',raster,'Embedded glyphs:',embedded)
    assert.ok(raster.before>100 && raster.after<raster.before*.2,'text inside the image removed')
    assert.ok(embedded.before>100 && embedded.after===embedded.before,'iframe HTML is not treated as an OCR image')
    for(let y=130;y<170;y++)for(let x=30;x<630;x++)assert.equal(patch[(y*size.width+x)*4+3],0,'image pattern is unchanged')
    assert.equal(await wc.executeJavaScript('document.querySelector("img").getAttribute("src").startsWith("data:image/png")'),true)
    const bounded=await ocr.repair(wc,[{x:0,y:0,width:1,height:.3}])
    const small=nativeImage.createFromDataURL(bounded.image).toBitmap()
    for(let y=250;y<320;y++)for(let x=0;x<size.width;x++)assert.equal(small[(y*size.width+x)*4+3],0,'no repair outside the panel')
    const edgeRegions=[{x:100/size.width,y:60/size.height,width:100/size.width,height:25/size.height}]
    const clipped=await ocr.repair(wc,edgeRegions)
    assert.ok(clipped?.count>0,'OCR recognizes lettering cut by popup edges')
    const edgePatch=nativeImage.createFromDataURL(clipped.image).toBitmap()
    for(let y=0;y<size.height;y++)for(let x=0;x<size.width;x++)if(x<100||x>=200||y<60||y>=85)assert.equal(edgePatch[(y*size.width+x)*4+3],0)
    win.setSize(1700,1300)
    await wc.executeJavaScript(`(()=>{const canvas=document.createElement('canvas');canvas.width=450;canvas.height=80;canvas.style.cssText='position:absolute;left:1150px;top:1100px';const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,450,80);ctx.fillStyle='black';ctx.font='bold 32px Arial';ctx.fillText('DISTANT TILE TEXT',10,50);document.body.appendChild(canvas)})()`)
    await wait(300)
    const large=await wc.capturePage(),largeSize=large.getSize()
    const tiled=await ocr.repair(wc,[{x:0,y:0,width:1,height:1}])
    assert.ok(tiled?.image,'large viewport produces a tiled repair')
    const tileBitmap=nativeImage.createFromDataURL(tiled.image).toBitmap()
    let repaired=0
    for(let y=1100;y<1180;y++)for(let x=1150;x<1600;x++)if(tileBitmap[(y*largeSize.width+x)*4+3])repaired++
    assert.ok(repaired>100,'text in a tile beyond both the first row and column is repaired')
    await ocr.release(true)
    console.log('PASS image-only OCR, exclusion of iframe HTML, unchanged image detail, tiling and clipping')
    app.exit(0)
  }catch(error){console.error(error);await ocr.release(true);app.exit(1)}
})
