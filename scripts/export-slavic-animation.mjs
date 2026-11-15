import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, rename, access, readdir } from 'node:fs/promises';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
let puppeteer;
try { puppeteer=(await import('puppeteer')).default; }
catch { puppeteer=(await import(pathToFileURL(join(homedir(),'node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js')).href)).default; }
const fps=24,width=1280,height=1440,mapWidth=1280,endHold=2;
const output='outputs/Slavic-Dispersals-western-balkan-routes-quick-opening-2026-11-15.mp4';
const partial=output.replace('.mp4','.partial.mp4'),metadata=output.replace('.mp4','.json');
const ffmpeg=process.env.FFMPEG_PATH||(process.platform==='win32'?'C:/FFmpeg/bin/ffmpeg.exe':'ffmpeg');
const check=process.argv.includes('--check');
await mkdir('outputs',{recursive:true});
if(!check){try{await access(output);throw Error('Finished export already exists; preserve it and choose a new output name.');}catch(error){if(error.code!=='ENOENT')throw error;}}
const files=['public/projects/slavs.json','public/data/research/slavic-dispersals.atlas.json','public/data/research/slavic-dispersals.journeys.json','public/data/research/slavic-dispersals.ledger.json','public/data/research/slavic-dispersals.population.json','public/data/research/slavic-dispersals.annotations.json','src/main.ts','src/ui/map-annotations.ts','src/render/overlay.ts','src/map/population-camera.ts','src/map/basemap.ts','src/sim/engine.ts','src/time/activity-pacing.ts','src/time/phase-pacing.ts','src/time/clock.ts','src/data/loader.ts','src/ui/evidence-map.ts'];
const fingerprints=async()=>Object.fromEntries(await Promise.all(files.map(async path=>[path,createHash('sha256').update(await readFile(path)).digest('hex')])));
// Freeze local modules and Slavic model responses for a coherent private render.
const frozenSource=new Map(),frozenPublic=new Map();
const key=path=>resolve(path).replaceAll('\\','/').toLowerCase();
async function freezeSource(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=join(dir,item.name);if(item.isDirectory())await freezeSource(path);else if(/\.(ts|css)$/.test(path))frozenSource.set(key(path),(await readFile(path)).toString('utf8'));}}
await freezeSource('src');
for(const path of files.filter(path=>path.startsWith('public/')))frozenPublic.set(path.slice(7),await readFile(path));
const inputs=Object.fromEntries(await Promise.all(files.map(async path=>[path,createHash('sha256').update(path.startsWith('public/')?frozenPublic.get(path.slice(7)):frozenSource.get(key(path))??await readFile(path)).digest('hex')])));
const hook=String.raw`
import { phasePlaybackDuration, advancePhasePlayback, phaseRateAt } from './time/phase-pacing';
import { insidePolygon as videoInsidePolygon } from './data/geography-policy';
import { mercToLonLat as videoLonLat } from './util/geo';
const videoRoundRect=(x,y,w,h,r=5)=>{const ctx=window.slavicCanvas.getContext('2d');ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
const videoWrap=(ctx,text,max)=>{const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>max){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
function videoOverlayLayout(){
 const ctx=window.slavicCanvas.getContext('2d'),model=evidenceMap.getColorLegendModel(),width=480,columns=2,columnWidth=218,rows=[];ctx.font='14px system-ui';
 for(let i=0;i<model.entries.length;i+=columns){const pair=model.entries.slice(i,i+columns).map(entry=>({...entry,lines:videoWrap(ctx,entry.label,194)}));rows.push({entries:pair,height:Math.max(24,...pair.map(entry=>entry.lines.length*18+7))});}
 const height=20+(model.preIslamic?30:0)+(rows.length?29+rows.reduce((n,row)=>n+row.height,0):0);
 return{title:{left:968,top:40,width:288,height:116},legend:{left:776,top:1440-28-height,width,height},model,rows};
}
window.__slavicVideo={
 ready:()=>!!atlasProjection&&!!journeyPackage&&styleReady&&store.state.dataset.migrations.length>0,
 setup:()=>{
  clock.stop();store.patch({playing:false,panelOpen:false,selected:null,dotScale:2.6});
  evidenceMap.setTimelineEnabled(true);automaticEarlyOverview=null;automaticPreparedOverview=true;
  preparedCameraKey='';journeySelection={groupId:null,regionId:null};store.state.focusGroups.clear();store.state.hiddenGroups.clear();
  window.__slavicVideoExport=true;
  map.stop();map.setPadding({top:0,bottom:0,left:0,right:0});map.resize();overlay.resize();
  annotationLayer.setData(readMapAnnotations(raw.mapAnnotations));annotationLayer.setVisible(true);
  window.slavicCanvas=document.createElement('canvas');window.slavicCanvas.width=1280;window.slavicCanvas.height=1440;
  window.slavicLastCamera='';window.slavicCameraRenders=0;window.slavicCaptionAudit={};window.slavicFirstMotionSeconds=null;
  for(const name of ['title','legend']){const box=document.createElement('div');box.className='atlas-video-'+name;box.style.position='absolute';box.style.pointerEvents='none';document.getElementById('app').append(box);window['slavic'+name+'Box']=box;}
  const ds=store.state.dataset,range=[...ds.meta.timeRange];
  window.slavicRange=range;window.slavicRate=ds.meta.playback.defaultSpeed;
  window.slavicDuration=phasePlaybackDuration(ds,range);
  return {title:ds.meta.title,range,contextRange:ds.meta.timeRange,duration:window.slavicDuration,peoplePerDot:engine.basePpd,dotScale:store.state.dotScale,dotStyle:ds.meta.dotStyle,cameraRegions:ds.meta.cameraRegions,presentationMask:raw.meta.presentationMask,playback:ds.meta.playback,sourceHash:raw.agentPreparation?.inputs?.[0]?.sha256,journeys:ds.migrations.map(m=>({id:m.journeyId,start:m.start,end:m.end})),cameraContext:raw.meta.cameraContextBounds};
 },
 frame:async(seconds)=>{
  clock.stop();window.__slavicVideoTime=seconds*1000;
  const ds=store.state.dataset,step=advancePhasePlayback(window.slavicRange[0],Math.min(seconds,window.slavicDuration),window.slavicRange,window.slavicRate,false,ds);
  store.setTime(step.t);dirty=true;lastNow=0;clock.onTick();
  const layout=videoOverlayLayout();
  for(const name of ['title','legend']){const r=layout[name];Object.assign(window['slavic'+name+'Box'].style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});}
  const key=JSON.stringify([map.getCenter().toArray(),map.getZoom()]);
  if(key!==window.slavicLastCamera){
   await new Promise(resolve=>{map.once('render',resolve);map.triggerRepaint();});
   if(!map.areTilesLoaded())await new Promise((resolve,reject)=>{
    let timeout;const ready=()=>{clearTimeout(timeout);map.off('idle',ready);resolve();};
    timeout=setTimeout(()=>{map.off('idle',ready);reject(Error('Basemap tiles did not finish loading'));},60000);map.once('idle',ready);map.triggerRepaint();
   });
   window.slavicLastCamera=key;window.slavicCameraRenders++;
  }
  // Map resize/tile work may clear the overlay while awaiting the basemap.
  dirty=true;lastNow=0;clock.onTick();
  if(seconds===0){const pixels=overlay.ctx.getImageData(0,0,overlay.canvas.width,overlay.canvas.height).data;let painted=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])painted++;if(painted<100)throw Error('Opening population canvas is empty');}
  const canvas=window.slavicCanvas,ctx=canvas.getContext('2d');ctx.clearRect(0,0,1280,1440);ctx.drawImage(map.getCanvas(),0,0,1280,1440);ctx.drawImage(overlay.canvas,0,0,1280,1440);
  const captions=[];
  for(const label of document.querySelectorAll('.atlas-place-label,.atlas-event-label')){
   if(label.hidden)continue;const style=getComputedStyle(label),rect=label.getBoundingClientRect();if(!rect.width||!rect.height||Number(style.opacity)<=0)continue;
   const id=label.dataset.placeId||label.dataset.eventId;
   captions.push({id,text:label.innerText,x:rect.x,y:rect.y,opacity:Number(style.opacity),fontSize:parseFloat(style.fontSize)});
   const frameIndex=Math.round(seconds*24);if(!window.slavicCaptionAudit[id])window.slavicCaptionAudit[id]={first:seconds,last:seconds,frames:0,lastFrame:frameIndex-1,gapFrames:0};const audit=window.slavicCaptionAudit[id];audit.gapFrames+=Math.max(0,frameIndex-audit.lastFrame-1);audit.last=seconds;audit.lastFrame=frameIndex;audit.frames++;
   ctx.save();ctx.globalAlpha=Number(style.opacity);ctx.fillStyle=style.backgroundColor;videoRoundRect(rect.x,rect.y,rect.width,rect.height,3);
   let y=rect.y+parseFloat(style.paddingTop||0),x=rect.x+parseFloat(style.paddingLeft||0),max=rect.width-parseFloat(style.paddingLeft||0)-parseFloat(style.paddingRight||0);
   ctx.textBaseline='top';ctx.fillStyle=style.color;ctx.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
   if(label.classList.contains('atlas-place-label')){ctx.shadowColor='#fff';ctx.shadowBlur=4;}
   const main=[...label.childNodes].filter(node=>node.nodeType===3).map(node=>node.textContent).join('');
   const lineHeight=parseFloat(style.lineHeight)||14;
   for(const line of videoWrap(ctx,main,max)){ctx.fillText(line,x,y);y+=lineHeight;}
   const small=label.querySelector('small');if(small){const sub=getComputedStyle(small);ctx.font=sub.fontWeight+' '+sub.fontSize+' '+sub.fontFamily;for(const line of videoWrap(ctx,small.textContent,max)){ctx.fillText(line,x,y);y+=parseFloat(sub.lineHeight)||12;}}
   ctx.restore();
  }
  ctx.save();ctx.textBaseline='top';ctx.fillStyle='#fbf9f1ef';videoRoundRect(layout.title.left,layout.title.top,layout.title.width,layout.title.height,6);ctx.strokeStyle='#b7ac9855';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='#40392e';ctx.font='600 22px system-ui';ctx.fillText('Slavic dispersals',984,53);ctx.font='600 32px system-ui';ctx.fillText(formatYear(step.t),984,83);ctx.font='14px system-ui';ctx.fillStyle='#716650';ctx.fillText('1 dot = '+engine.basePpd.toLocaleString('en-US')+' people',984,128);ctx.fillText('?',1232,128);
  const legend=layout.model;ctx.fillStyle='#fbf9f1ef';videoRoundRect(layout.legend.left,layout.legend.top,layout.legend.width,layout.legend.height,6);ctx.strokeStyle='#b7ac9855';ctx.stroke();let row=layout.legend.top+11;
  if(legend.preIslamic){ctx.fillStyle=legend.preIslamic.color;ctx.fillRect(790,row+3,10,10);ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(790,row+3,10,10);ctx.fillStyle='#4f4637';ctx.font='14px system-ui';ctx.fillText(legend.preIslamic.label,810,row);row+=30;}
  if(layout.rows.length){ctx.font='600 13px system-ui';ctx.fillStyle='#5c503d';ctx.fillText(legend.heading,790,row);row+=29;for(const r of layout.rows){r.entries.forEach((entry,index)=>{const x=790+index*218;ctx.fillStyle=entry.color;ctx.fillRect(x,row+3,10,10);ctx.strokeStyle='#000';ctx.strokeRect(x,row+3,10,10);ctx.fillStyle='#5c503d';ctx.font='14px system-ui';entry.lines.forEach((line,i)=>ctx.fillText(line,x+20,row+i*18));});row+=r.height;}}
  ctx.fillStyle='#fbf9f1db';ctx.fillRect(0,1416,1280,24);ctx.fillStyle='#40392e';ctx.font='10px system-ui';ctx.fillText('© OpenMapTiles © OpenStreetMap contributors · Terrain: Mapzen/AWS Terrain Tiles · Rivers: Natural Earth',12,1424);ctx.restore();
  const full=engine.frame(step.t,populationCameraView(overlay.view()),{group:()=>true});let people=0,offscreenPopulationDots=0,occludedPopulationDots=0;
  for(const item of [...full.settlements,...full.migrations])for(let i=0;i<item.dots.count;i++){people+=item.dots.alphas[i]*item.peoplePerDot;if(item.dots.alphas[i]<=0)continue;const point=map.project(videoLonLat(item.dots.xs[i],item.dots.ys[i]));if(point.x<0||point.x>1280||point.y<0||point.y>1440)offscreenPopulationDots++;for(const box of [layout.title,layout.legend])if(point.x>=box.left&&point.x<=box.left+box.width&&point.y>=box.top&&point.y<=box.top+box.height)occludedPopulationDots++;}
  if(offscreenPopulationDots||occludedPopulationDots)throw Error('Overlay/view obscures population: '+JSON.stringify({seconds,year:step.t,offscreenPopulationDots,occludedPopulationDots}));
  const travellingJourneys=full.migrations.filter(item=>item.dots.states?.some((state,index)=>index<item.dots.count&&state===1&&item.dots.alphas[index]>0)).map(item=>item.m.journeyId);if(travellingJourneys.length&&window.slavicFirstMotionSeconds===null)window.slavicFirstMotionSeconds=seconds;if(seconds>=2&&window.slavicFirstMotionSeconds===null)throw Error('No visible motion within the first two seconds');
  return {seconds,year:step.t,travellingJourneys,yearsPerSecond:seconds>=window.slavicDuration?0:phaseRateAt(step.t,ds.meta.playback.phases),endHold:seconds>=window.slavicDuration,offscreenPopulationDots,occludedPopulationDots,layout:{title:layout.title,legend:layout.legend},visibleDots:overlay.lastDotCount,totalDots:full.totalDots,people,center:map.getCenter().toArray(),zoom:map.getZoom(),captions,legend:layout.model.entries.map(entry=>entry.label),basemapRenders:window.slavicCameraRenders};
 }
};`;
const server=await createServer({configFile:false,root:process.cwd(),cacheDir:'.atlas-runtime/slavic-phase-video-vite-cache',server:{host:'127.0.0.1',port:0,hmr:false,watch:null},plugins:[{name:'private-slavic-export',enforce:'pre',load(id){return frozenSource.get(key(id.split('?')[0]));},configureServer(server){server.middlewares.use((req,res,next)=>{const path=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).slice(1),data=frozenPublic.get(path);if(!data)return next();res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(data);});},transform(code,id){const path=id.replaceAll('\\','/');if(path.endsWith('/src/main.ts'))return code.replace('function fitPadding(): PaddingOptions {','function fitPadding(): PaddingOptions { if ((globalThis as any).__slavicVideoExport) return {top:20,bottom:28,left:20,right:20};')+hook;if(path.endsWith('/src/map/basemap.ts'))return code.replace('container,','container,\n    canvasContextAttributes: { preserveDrawingBuffer: true },');if(path.endsWith('/src/ui/map-annotations.ts'))return code.replace('const now=performance.now();','const now=(globalThis as any).__slavicVideoTime ?? performance.now();');}}]});
await server.listen();
const browser=await puppeteer.launch({headless:true,protocolTimeout:300000,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader'],defaultViewport:{width,height,deviceScaleFactor:1}});
let encoder;
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',error=>{errors.push(error.message);console.error(error.message);});
 await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/slavs/',{waitUntil:'networkidle2',timeout:120000});
 await page.waitForFunction(()=>window.__slavicVideo?.ready(),{timeout:120000});
 await page.addStyleTag({content:'#topbar,#panel,#timeline,#inspector,#toast,#legend,.atlas-journey-controls,.evidence-sidebar,.evidence-detail,.maplibregl-control-container,.evidence-card,.evidence-caption{display:none!important}.atlas-journey-legend{display:none!important}:root{--timeline-h:0px!important}#map{left:0!important;top:0!important;right:auto!important;bottom:auto!important;width:1280px!important;height:1440px!important}#overlay{left:0!important;top:0!important;right:auto!important;bottom:auto!important}'});
 const meta=await page.evaluate(()=>window.__slavicVideo.setup());if(meta.peoplePerDot!==1000||meta.dotScale!==2.6||meta.range[0]!==-200||meta.range[1]!==1000)throw Error('Unexpected Slavic model settings');
 const duration=meta.duration+endHold;let total=Math.ceil(duration*fps)+1;const expectedEvents=JSON.parse(frozenPublic.get('data/research/slavic-dispersals.annotations.json').toString()).events;
 if(total/fps>=120)throw Error('Encoded video must be strictly under120seconds including all holds');
 if(meta.playback.phases.length!==2||meta.playback.phases[0].yearsPerSecond!==500||meta.playback.phases[1].yearsPerSecond!==10)throw Error('Expected quick 500-year/second context opening and ten-year/second dispersal');
 console.log(JSON.stringify({...meta,output,fps,total,duration}));
 if(check){
  const samples=[];for(const time of [0,.5,1.25,1.75,2.25,3.25,5.25,9.25,18,32,45,53,meta.duration]){const sample=await page.evaluate(t=>window.__slavicVideo.frame(t),time);samples.push(sample);await writeFile('outputs/Slavic-western-routes-preview-'+time+'.png',await page.evaluate(()=>{const b=atob(window.slavicCanvas.toDataURL('image/png').split(',')[1]);return Array.from(b,c=>c.charCodeAt(0));}).then(bytes=>Buffer.from(bytes)));console.log(JSON.stringify(sample));}
  if(!samples[0].captions.some(c=>c.id==='pripyat-marshes')||samples.find(s=>s.seconds===9.25).captions.some(c=>c.id==='pripyat-marshes'))throw Error('Introductory label timing failed');
  if(samples.some(s=>Math.abs(s.people-1400000)>.1||s.visibleDots!==1400))throw Error('Population changed');
  if(errors.length)throw Error(errors.join('\n'));await writeFile('outputs/Slavic-western-routes-export-check.json',JSON.stringify({meta,samples,errors},null,2)+'\n');
 }else{
  encoder=spawn(ffmpeg,['-n','-hide_banner','-loglevel','warning','-f','h264','-r',String(fps),'-i','pipe:0','-an','-c:v','copy','-movflags','+faststart',partial],{stdio:['pipe','ignore','pipe'],windowsHide:true});let diagnostics='';encoder.stderr.on('data',data=>diagnostics+=data);encoder.stdin.on('error',()=>{});const done=once(encoder,'close');
  await page.evaluate(({fps,width,height})=>{window.videoChunks=[];window.videoError=null;window.videoEncoder=new VideoEncoder({output:chunk=>{const bytes=new Uint8Array(chunk.byteLength);chunk.copyTo(bytes);window.videoChunks.push(bytes);},error:e=>window.videoError=e.message});window.videoEncoder.configure({codec:'avc1.640028',width,height,bitrate:10000000,framerate:fps,avc:{format:'annexb'}});},{fps,width,height});
  const samples=[];
  for(let offset=0;offset<total;){
   const count=Math.min(24,total-offset),batch=await page.evaluate(async({offset,count,fps})=>{let status;const labels=[];for(let j=0;j<count;j++){const index=offset+j;status=await window.__slavicVideo.frame(index/fps);if(index===0||index%120===0)labels.push(status);const frame=new VideoFrame(window.slavicCanvas,{timestamp:Math.round(index*1000000/fps),duration:Math.round(1000000/fps)});window.videoEncoder.encode(frame,{keyFrame:index%120===0});frame.close();if(window.videoEncoder.encodeQueueSize>6)await window.videoEncoder.flush();}await window.videoEncoder.flush();if(window.videoError)throw Error(window.videoError);const size=window.videoChunks.reduce((sum,b)=>sum+b.length,0),bytes=new Uint8Array(size);let p=0;for(const b of window.videoChunks){bytes.set(b,p);p+=b.length;}window.videoChunks=[];let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return{base64:btoa(binary),status,labels};},{offset,count,fps});
   if(!encoder.stdin.write(Buffer.from(batch.base64,'base64')))await once(encoder.stdin,'drain');samples.push(...batch.labels);console.log(JSON.stringify({frame:offset+count,total,seconds:batch.status.seconds,year:batch.status.year,dots:batch.status.visibleDots,camera:batch.status.zoom}));
   if(offset+count>=total){const audit=await page.evaluate(()=>window.slavicCaptionAudit);if(expectedEvents.some(event=>(audit[event.id]?.frames??0)<8*fps)){if(Object.values(audit).some(item=>item.gapFrames))throw Error('Caption gaps during ending reading hold');total+=fps;if(total/fps>=120)throw Error('Caption completion would exceed two-minute limit');}}
   offset+=count;
  }
  await page.evaluate(()=>window.videoEncoder.close());encoder.stdin.end();const [code]=await done;if(code!==0)throw Error(diagnostics);if(errors.length)throw Error(errors.join('\n'));
  const captionAudit=await page.evaluate(()=>window.slavicCaptionAudit);for(const event of expectedEvents){const audit=captionAudit[event.id];if(!audit||audit.frames<8*fps||audit.gapFrames)throw Error('Incomplete continuous caption hold: '+JSON.stringify({id:event.id,audit}));}
  const finalInputs=await fingerprints();const changed=files.filter(path=>inputs[path]!==finalInputs[path]);if(changed.length)console.warn('Files changed during export: '+changed.join(', '));
  await rename(partial,output);await writeFile(metadata,JSON.stringify({...meta,output,fps,frames:total,durationSeconds:total/fps,endHoldSeconds:Math.max(0,(total-1)/fps-meta.duration),minimumEndHoldSeconds:endHold,resolution:[width,height],mapViewport:[mapWidth,height],mapOverlays:{title:'small top-right box',legend:'bottom-right over Anatolia'},inputs,frozenModuleSnapshot:true,changedDuringExport:changed,samples,errors,captionClock:'Deterministic video time; event captions 17px, dates 14px and continuous eight-second reading holds; six-second Pripyat label',captionAudit,captionValidation:{events:expectedEvents.length,minimumVisibleFrames:8*fps,minimumVisibleSeconds:8,maximumGapFrames:0},firstMotionSeconds:await page.evaluate(()=>window.slavicFirstMotionSeconds),openingSeconds:(meta.playback.phases[0].to-meta.playback.phases[0].from)/meta.playback.phases[0].yearsPerSecond,endingPolicy:'At least two seconds; complete already queued eight-second captions without delaying historical movement',camera:'Brief Pripyat opening, smooth eight-second widening to Eastern Europe; full-map title/key overlays',method:'Private local Vite hook, exact app engine and basemap composited with passive captions, colour legend and year; H264/MP4; no desktop capture'},null,2)+'\n');console.log('VIDEO COMPLETE '+output);
 }
}finally{if(encoder&&encoder.exitCode===null)encoder.kill();await browser.close();await server.close();}
