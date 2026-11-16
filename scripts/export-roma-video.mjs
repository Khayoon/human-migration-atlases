// Local, isolated headless capture. Research and application files are read only.
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import './register-tests.mjs';
const { compileDataset } = await import('../src/data/loader.ts');
const { readEstimateInput } = await import('../src/data/estimate-input.ts');
const { compileAtlasPopulation } = await import('../src/data/atlas-model.ts');
const { attachLedger, transferEvents } = await import('../src/data/population-ledger.ts');
const { advanceNarrativePlayback } = await import('../src/time/clock.ts');
const { phasePlaybackDuration, phaseRateAt } = await import('../src/time/phase-pacing.ts');

const read = async path => JSON.parse(await readFile(path, 'utf8'));
const argument = (name, fallback) => { const index = process.argv.indexOf(name); return index < 0 ? fallback : Number(process.argv[index + 1]); };
const checkOnly = process.argv.includes('--check');
let seconds = argument('--seconds', 0);
const fps = argument('--fps', 24);
if (!(seconds >= 0 && seconds <= 119 && fps >= 6 && fps <= 30)) throw new Error('Export must remain under two minutes');
const width = 1920, height = 1080;
const manifest = await read('public/projects/roma.json');
const raw = await read(`public/${manifest.dataset}`);
const atlas = await read(`public/${manifest.journeys}`);
const population = await read(`public/${manifest.populationModel}`);
const ledger = await read(`public/${manifest.standingLedger}`);
const joined = attachLedger(atlas, readEstimateInput(population).estimates, ledger);
const dataset = compileAtlasPopulation(compileDataset(raw).dataset, joined.atlas, joined.estimates).dataset;
const expectedMigrations=dataset.migrations.length, expectedDotScale=raw.meta.defaultDotScale??1.8;
const range = dataset.meta.timeRange, speed = dataset.meta.playback?.defaultSpeed ?? 2;
const phases=dataset.meta.playback?.phases;
if(phases?.length!==2||phases[1].yearsPerSecond<20||phases[1].yearsPerSecond>50)throw new Error('Roma needs the approved two-phase clock with second-phase rate20–50');
const originalSeconds=phasePlaybackDuration(dataset,range,speed);
if (!seconds) seconds = originalSeconds;
const endHoldSeconds=2, renderSeconds=seconds+endHoldSeconds;
if (renderSeconds + 1 / fps >= 120) throw new Error(`Current atlas pacing is still too slow: ${seconds} seconds`);
const timeScale = originalSeconds / seconds;
if(Math.abs(timeScale-1)>1e-8)throw new Error('Export must use the approved phase clock without further acceleration');
const yearAt=elapsed=>advanceNarrativePlayback(range[0],Math.max(0,Math.min(originalSeconds,elapsed)),range,speed,false,dataset).t;
const fingerprintFiles = ['public/projects/roma.json', ...['dataset','journeys','populationModel','standingLedger','sourceDocument'].map(key => `public/${manifest[key]}`),
  'src/main.ts','src/data/types.ts','src/style.css','src/time/clock.ts','src/time/phase-pacing.ts','src/sim/engine.ts','src/render/overlay.ts','src/render/geographic-clip.ts','src/render/legend-visibility.ts','src/render/legend-destination.ts','src/map/population-camera.ts','src/map/regional-camera.ts','src/map/basemap.ts','src/data/loader.ts','src/data/atlas-model.ts','src/data/population-ledger.ts','src/data/camera-regions.ts','src/data/continuation-cues.ts','src/ui/continuation-cues.ts'];
const fingerprints = Object.fromEntries(await Promise.all(fingerprintFiles.map(async path => [path, createHash('sha256').update(await readFile(path)).digest('hex')])));
const stamp = new Date().toISOString().replaceAll(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
const directory = join(process.cwd(), 'outputs');
const inspection = join(process.cwd(), '.atlas-runtime', `roma-video-${stamp}`);
await mkdir(directory, { recursive: true }); await mkdir(inspection, { recursive: true });
const stem = `Roma-Migrations-Continuous-Journeys-200-2025-${stamp}`;
const viewing = join(directory, `${stem}.mp4`);
const partial = join(directory, `${stem}.partial.mp4`);
const metadataPath = join(directory, `${stem}.json`);
const loadedSourceFingerprints = {};
const cameraTrace = [];
const travelDurations = dataset.migrations.map(migration => {
  const events = transferEvents(migration, 1000);
  const durations = events.map(event => phasePlaybackDuration(dataset, [event.departure, event.arrival], speed));
  return {id:migration.id,from:migration.fromSettlement,to:migration.toSettlement,
    start:migration.start,end:migration.end,travelYears:migration.travelYears,
    minimumSeconds:Math.min(...durations),maximumSeconds:Math.max(...durations),
    minimumFrames:Math.min(...durations)*fps,maximumFrames:Math.max(...durations)*fps};
});
const ffmpeg = process.env.FFMPEG_PATH ?? 'C:/FFmpeg/bin/ffmpeg.exe';
const ffprobe = process.env.FFPROBE_PATH ?? 'C:/FFmpeg/bin/ffprobe.exe';
let puppeteer;
try { puppeteer = (await import('puppeteer')).default; }
catch { puppeteer = (await import(pathToFileURL(join(homedir(), 'node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js')).href)).default; }

const hook = `
window.__romaBasemapErrors=[];map.on('error',event=>window.__romaBasemapErrors.push(event.error?.message??String(event.error)));
window.__romaVideo = {
 ready:()=>!!journeyPackage && !!atlasProjection && styleReady && store.state.dataset.migrations.length===${expectedMigrations},
 setup:()=>{
  if(!window.__romaCaptureDraw){const draw=overlay.draw.bind(overlay);overlay.draw=(frame,state)=>{window.__romaLastFrame=frame;return draw(frame,state);};window.__romaCaptureDraw=true;}
  clock.stop();store.patch({playing:false,panelOpen:false,selected:null,hovered:null,estimateMode:'mid',ppdMultiplier:1,lod:false,dotScale:${raw.meta.defaultDotScale ?? 1.8}});
  automaticEarlyOverview=null;automaticPreparedOverview=true;preparedCameraKey='';
  evidenceMap.setTimelineEnabled(true);map.stop();map.resize();overlay.resize();
  const originalUpdate=annotationLayer.update.bind(annotationLayer);
  annotationLayer.update=(...args)=>{const descriptor=Object.getOwnPropertyDescriptor(performance,'now');Object.defineProperty(performance,'now',{configurable:true,value:()=>window.__romaVideoNow??0});try{return originalUpdate(...args);}finally{if(descriptor)Object.defineProperty(performance,'now',descriptor);else delete performance.now;}};
  store.setTime(${range[0]});resetView();
  window.__romaVideoCanvas=document.createElement('canvas');window.__romaVideoCanvas.width=1920;window.__romaVideoCanvas.height=1080;
  return {title:store.state.dataset.meta.title,range:store.state.range,speed:store.state.speed,peoplePerDot:engine.basePpd,dotScale:store.state.dotScale,dotStyle:store.state.dataset.meta.dotStyle,cameraPath:store.state.dataset.meta.cameraPath,migrations:store.state.dataset.migrations.length};
 },
 restart:()=>{clock.stop();expandingPopulationCamera.reset();automaticPreparedOverview=true;preparedCameraKey='';window.__romaVideoCameraKey=null;store.setTime(${range[0]});resetView();},
 compose:()=>{
  const canvas=window.__romaVideoCanvas,ctx=canvas.getContext('2d');ctx.clearRect(0,0,1920,1080);
  ctx.drawImage(map.getCanvas(),0,0,1920,1080);ctx.drawImage(overlay.canvas,0,0,1920,1080);
  const box=(x,y,w,h)=>{ctx.fillStyle='#fbf9f1';ctx.globalAlpha=.95;ctx.beginPath();ctx.roundRect(x,y,w,h,7);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='#60554233';ctx.stroke();};
  const shorten=(text,width)=>{while(text.length&&ctx.measureText(text).width>width)text=text.slice(0,-1);return text;};
  const legend=evidenceMap.getColorLegendModel(),entries=legend.entries??[],columns=2,rows=Math.ceil(entries.length/columns),height=48+rows*21+(legend.preIslamic?25:0),top=1080-34-height;
  box(24,top,340,height);ctx.textBaseline='top';ctx.fillStyle='#5c503d';ctx.font='600 11px system-ui';
  let labelTop=top+13;if(legend.preIslamic){ctx.fillStyle=legend.preIslamic.color;ctx.fillRect(35,labelTop+3,8,8);ctx.fillStyle='#5c503d';ctx.fillText(legend.preIslamic.label,49,labelTop);labelTop+=25;}
  ctx.fillText(legend.heading||'Populations by destination',35,labelTop);labelTop+=25;ctx.font='10px system-ui';
  entries.forEach((item,index)=>{const x=35+(index%columns)*163,y=labelTop+Math.floor(index/columns)*21;ctx.fillStyle=item.color;ctx.fillRect(x,y+2,8,8);ctx.fillStyle='#74664e';ctx.fillText(shorten(item.label,143),x+14,y);});
  let cueTop=top-46;
  for(const cue of continuationCueLayer.state().filter(item=>item.visible)){
   box(24,cueTop,340,38);ctx.fillStyle='#40392e';let size=13;ctx.font='600 '+size+'px system-ui';while(size>10&&ctx.measureText(cue.text).width>314){size-=.5;ctx.font='600 '+size+'px system-ui';}ctx.fillText(cue.text,37,cueTop+11);cueTop-=46;
  }
  // Current DOM place/event captions remain part of the exported picture.
  for(const node of document.querySelectorAll('.atlas-map-annotations span:not([hidden])')){const style=getComputedStyle(node),rect=node.getBoundingClientRect();if(style.display==='none'||!rect.width||Number(style.opacity)===0)continue;ctx.save();ctx.globalAlpha=Number(style.opacity);ctx.fillStyle=style.backgroundColor;ctx.fillRect(rect.left,rect.top,rect.width,rect.height);ctx.fillStyle=style.color;ctx.font=style.font;ctx.fillText(node.childNodes[0]?.textContent??'',rect.left+7,rect.top+5);const small=node.querySelector('small');if(small){ctx.font=getComputedStyle(small).font;ctx.fillText(small.textContent,rect.left+7,rect.top+23);}ctx.restore();}
  box(1504,930,390,116);ctx.fillStyle='#40392e';ctx.font='600 18px system-ui';ctx.fillText('Roma migrations',1522,947);ctx.font='600 28px system-ui';ctx.fillText(formatYear(store.state.t),1522,978);ctx.font='13px system-ui';ctx.fillText('1 dot = 1,000 people · Central estimate',1522,1018);ctx.fillText('?',1870,1018);
  ctx.font='11px system-ui';ctx.fillStyle='#fbf9f1';ctx.fillRect(10,1058,720,18);ctx.fillStyle='#40392e';ctx.fillText('© OpenMapTiles © OpenStreetMap contributors · Terrain: Mapzen/AWS · Rivers: Natural Earth',15,1061);
  return canvas;
 },
 frame:async(year,elapsed)=>{
  window.__romaVideoNow=elapsed*1000;store.setTime(year);await Promise.resolve();
  dirty=true;lastNow=0;clock.onTick();
  const cameraKey=JSON.stringify([map.getZoom(),map.getCenter().toArray()]);
  const ready=()=>new Promise(resolve=>{map.once('render',resolve);map.triggerRepaint();});
  if(cameraKey!==window.__romaVideoCameraKey||!map.areTilesLoaded()){
   await ready();
   if(!map.areTilesLoaded())await new Promise((resolve,reject)=>{
   const complete=()=>{clearTimeout(timeout);map.off('idle',complete);resolve();};
   const timeout=setTimeout(()=>{map.off('idle',complete);reject(new Error('Basemap did not finish loading at '+year));},45000);
   map.once('idle',complete);map.triggerRepaint();
   });window.__romaVideoCameraKey=cameraKey;
  }
  dirty=true;lastNow=0;clock.onTick();
  const caption=document.getElementById('roma-video-caption');
  caption.querySelector('.video-date').textContent=formatYear(year);
  const model=evidenceMap.getColorLegendModel();
  let cueTop=1080-34-(48+Math.ceil((model.entries??[]).length/2)*21+(model.preIslamic?25:0))-46;
  for(const cue of continuationCueLayer.state().filter(item=>item.visible)){const node=document.querySelector('[data-continuation-id="'+cue.id+'"]');if(node){node.style.left='24px';node.style.top=cueTop+'px';node.style.width='340px';}cueTop-=46;}
  const earlyTravel=[];
  if(year<=1100){const view=overlay.view();for(const item of window.__romaLastFrame?.migrations??[]){
   const dots=item.dots;if(!dots.count)continue;
   const moving=[];for(let index=0;index<dots.count;index++){if(dots.states?.[index]!==1)continue;const x=dots.xs[index],y=dots.ys[index];moving.push({slot:dots.slots?.[index],progress:dots.progress?.[index],x,y,visible:x>=view.minX&&x<=view.maxX&&y>=view.minY&&y<=view.maxY});}
   if(moving.length)earlyTravel.push({id:item.m.id,moving});
  }}
  const basemap={waterFeatures:map.querySourceFeatures('omt',{sourceLayer:'water'}).length,landcoverFeatures:map.querySourceFeatures('omt',{sourceLayer:'landcover'}).length,errors:window.__romaBasemapErrors};
  if(!basemap.waterFeatures&&!basemap.landcoverFeatures)throw new Error('Physical basemap tiles are missing at '+year+': '+JSON.stringify(basemap.errors));
  return {year:store.state.t,dots:overlay.lastDotCount,zoom:map.getZoom(),center:map.getCenter().toArray(),bounds:map.getBounds().toArray(),cameraPath:mapEl.dataset.cameraPath,cameraRegion:mapEl.dataset.cameraRegion,geographicClip:overlay.canvas.dataset.geographicClip,cues:continuationCueLayer.state(),legend:model.entries.map(item=>({id:item.id,label:item.label,color:item.color})),earlyTravel,basemap};
 }
};`;
const server = await createServer({ configFile: false, root: process.cwd(),
  server: { host: '127.0.0.1', port: 0, hmr: false, watch: null },
  plugins: [{ name: 'roma-local-video-hook', enforce: 'pre', configureServer(server){server.middlewares.use('/__roma-video-player',(_request,response)=>{response.setHeader('Content-Type','text/html; charset=utf-8');response.end('<!doctype html><html><body></body></html>');});}, async transform(code, id) {
    const path = id.replaceAll('\\', '/');
    const sourceRoot=process.cwd().replaceAll('\\','/');
    if(path.toLowerCase().startsWith((sourceRoot+'/src/').toLowerCase())&&!path.includes('?')){
      const relative=path.slice(sourceRoot.length+1);
      loadedSourceFingerprints[relative]=createHash('sha256').update(code).digest('hex');
      const copy=join(inspection,'loaded-source',relative);
      await mkdir(dirname(copy),{recursive:true});await writeFile(copy,code);
    }
    if (path.endsWith('/src/main.ts')) return code + hook;
    if (path.endsWith('/src/map/basemap.ts')) return code.replace('container,', 'container,\n    fadeDuration: 0,\n    canvasContextAttributes: { preserveDrawingBuffer: true },');
  } }],
});
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await puppeteer.launch({ headless: true, protocolTimeout: 180000,
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader'],
  defaultViewport: { width, height, deviceScaleFactor: 1 } });
let encoder;
const errors = [], checks = [], networkFailures=[];
const command = async args => {
  const child = spawn(args[0], args.slice(1), { windowsHide: true, stdio: ['ignore','pipe','pipe'] });
  let stdout = '', stderr = ''; child.stdout.on('data', data => stdout += data); child.stderr.on('data', data => stderr += data);
  const [code] = await once(child, 'close'); if (code !== 0) throw new Error(`${args[0]} exited ${code}: ${stderr}`);
  return stdout;
};
const probe = async path => JSON.parse(await command([ffprobe,'-v','error','-select_streams','v:0','-show_entries','stream=codec_name,width,height,pix_fmt,nb_frames,avg_frame_rate,duration:format=duration,size','-of','json',path]));
const cameraMotionSummary=trace=>{
  const mercator=([lon,lat])=>[(lon+180)/360,(1-Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))/Math.PI)/2];
  let maxPanPixelsPerFrame=0,maxZoomPerFrame=0,maxPanAcceleration=0,lastPan=[0,0],maxZoomAcceleration=0,lastZoom=0,zoomInFrames=0,horizontalReversals=0,lastHorizontalSign=0;
  for(let index=1;index<trace.length;index++){
    const previous=trace[index-1],current=trace[index],a=mercator(previous.center),b=mercator(current.center),scale=512*2**current.zoom;
    const longitudeDelta=((b[0]-a[0]+1.5)%1)-.5;
    const pan=[longitudeDelta*scale,(b[1]-a[1])*scale],zoom=current.zoom-previous.zoom;
    maxPanPixelsPerFrame=Math.max(maxPanPixelsPerFrame,Math.hypot(...pan));maxZoomPerFrame=Math.max(maxZoomPerFrame,Math.abs(zoom));
    if(zoom>1e-8)zoomInFrames++;
    if(Math.abs(pan[0])>.001){const sign=Math.sign(pan[0]);if(lastHorizontalSign&&sign!==lastHorizontalSign)horizontalReversals++;lastHorizontalSign=sign;}
    if(index>1){maxPanAcceleration=Math.max(maxPanAcceleration,Math.hypot(pan[0]-lastPan[0],pan[1]-lastPan[1]));maxZoomAcceleration=Math.max(maxZoomAcceleration,Math.abs(zoom-lastZoom));}
    lastPan=pan;lastZoom=zoom;
  }
  return {frames:trace.length,maxPanPixelsPerFrame,maxZoomPerFrame,maxPanAccelerationPixelsPerFrameSquared:maxPanAcceleration,maxZoomAccelerationPerFrameSquared:maxZoomAcceleration,zoomInFrames,horizontalReversals};
};
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => networkFailures.push({url:request.url(),error:request.failure()?.errorText}));
  page.on('response', response => {if(response.status()>=400)networkFailures.push({url:response.url(),status:response.status()});});
  await page.goto(new URL('roma/', base).href, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForFunction(() => window.__romaVideo?.ready(), { timeout: 120000 });
  await page.addStyleTag({ content: `
    #topbar,#panel,#timeline,#inspector,#toast,#legend,.atlas-journey-controls,.evidence-sidebar,.evidence-detail,.maplibregl-control-container,.atlas-narrative {display:none!important}
    :root{--timeline-h:0px!important}#map,#overlay{inset:0!important}
    .atlas-journey-legend{left:24px!important;bottom:34px!important;max-height:272px!important;width:340px!important;overflow:hidden!important}
    #roma-video-caption{position:fixed;right:26px;bottom:34px;width:390px;box-sizing:border-box;padding:14px 18px;background:#fbf9f1f2;border:1px solid #60554233;border-radius:7px;color:#40392e;font-family:system-ui;z-index:9999}
    #roma-video-caption strong{font-size:18px}.video-date{display:block;font-size:28px;font-weight:600;margin:4px 0}.video-unit{font-size:13px}.video-question{float:right}
    #roma-video-credit{position:fixed;left:10px;bottom:5px;background:#fbf9f1e8;color:#40392e;font:11px system-ui;z-index:9999;padding:3px 5px}
  ` });
  await page.evaluate(() => {
    const caption = document.createElement('div'); caption.id = 'roma-video-caption';
    caption.innerHTML = '<strong>Roma migrations</strong><span class="video-date"></span><span class="video-unit">1 dot = 1,000 people · Central estimate</span><span class="video-question">?</span>';
    document.body.append(caption);
    const credit = document.createElement('div'); credit.id = 'roma-video-credit';
    credit.textContent = '© OpenMapTiles © OpenStreetMap contributors · Terrain: Mapzen/AWS · Rivers: Natural Earth';document.body.append(credit);
  });
  const meta = await page.evaluate(() => window.__romaVideo.setup());
  if (meta.peoplePerDot !== 1000 || meta.dotScale !== expectedDotScale || meta.migrations !== expectedMigrations) throw new Error('Wrong Roma display/model configuration');
  if(raw.meta.cameraPath?.length&&meta.cameraPath?.length!==raw.meta.cameraPath.length)throw new Error('Roma smooth camera path was not compiled');
  if(raw.meta.dotStyle&&(meta.dotStyle?.outlineColor!=='#000000'||meta.dotStyle?.minimumRadius<3.6))throw new Error('Roma enlarged black outlined dots are not active');
  console.log(JSON.stringify({ phase: 'prepared', ...meta, phases, originalSeconds, viewingSeconds: seconds, timeScale, fps, viewing }));
  // Inspect geographical and historical milestones before committing a full render.
  for (const year of [200,260,330,420,500,600,675,800,950,1100,1538,1943.95,2025]) {
    const status = await page.evaluate((year) => window.__romaVideo.frame(year, 0), year);
    checks.push(status); await page.screenshot({ path: join(inspection, `preview-${String(year).replace('.', '-')}.png`) });
    const composed=await page.evaluate(()=>window.__romaVideo.compose().toDataURL('image/png').split(',')[1]);
    await writeFile(join(inspection,`composed-${String(year).replace('.', '-')}.png`),Buffer.from(composed,'base64'));
  }
  await writeFile(join(inspection,'preflight.json'),JSON.stringify({meta,checks,errors,networkFailures},null,2));
  if(!checks.find(check=>check.year===1100)?.basemap.waterFeatures)throw new Error('The Europe/Middle East basemap is missing its physical water geometry: '+JSON.stringify({networkFailures,basemap:checks.find(check=>check.year===1100)?.basemap}));
  if(raw.meta.cameraPath?.length&&checks.some(check=>check.cameraPath!=='narrative'))throw new Error('The prepared smooth camera path is not active in the export');
  if(raw.meta.cameraRegions?.length){
    const late=checks.filter(check=>check.year>=1100),reference=late[0];
    if(!late.length||late.some(check=>!check.cameraRegion||!check.geographicClip||Math.abs(check.zoom-reference.zoom)>1e-7||check.center.some((value,index)=>Math.abs(value-reference.center[index])>1e-7)))throw new Error('Later export camera must remain on the requested Europe/Middle East region');
    const offMapLegend=late.flatMap(check=>check.legend.filter(item=>/Punjab|Ganga|Brazil|Bahia|US coastal|Latin America/i.test(item.label)).map(item=>({year:check.year,...item})));
    if(offMapLegend.length)throw new Error('Off-map homelands or overseas populations leaked into the regional legend: '+JSON.stringify(offMapLegend));
    if(!checks.find(check=>check.year===1538)?.cues.some(cue=>cue.visible&&/Brazil/.test(cue.text)))throw new Error('Overseas direction caption is missing from the regional export');
  }
  await page.evaluate(() => window.__romaVideo.restart());
  if (checkOnly) {
    await writeFile(join(inspection, 'check.json'), JSON.stringify({meta,originalSeconds,seconds,timeScale,fingerprints,checks,errors},null,2));
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(JSON.stringify({ phase: 'check-complete', inspection }));
  } else {
    encoder = spawn(ffmpeg, ['-n','-hide_banner','-loglevel','warning','-f','h264','-r',String(fps),'-i','pipe:0','-an','-c:v','copy','-movflags','+faststart',partial], { windowsHide:true, stdio:['pipe','ignore','pipe'] });
    let diagnostics = ''; encoder.stderr.on('data', data => diagnostics += data); encoder.stdin.on('error',()=>{});
    const completion = once(encoder,'close');
    const total = Math.ceil(renderSeconds * fps);
    await page.evaluate(async fps=>{
      const config={codec:'avc1.640028',width:1920,height:1080,bitrate:10000000,framerate:fps,avc:{format:'annexb'},latencyMode:'realtime'};
      if(!(await VideoEncoder.isConfigSupported(config)).supported)throw new Error('H264 video encoding unavailable');
      window.__romaChunks=[];window.__romaEncoderError=null;
      window.__romaEncoder=new VideoEncoder({output:chunk=>{const bytes=new Uint8Array(chunk.byteLength);chunk.copyTo(bytes);window.__romaChunks.push(bytes);},error:error=>window.__romaEncoderError=error.message});window.__romaEncoder.configure(config);
    },fps);
    for (let offset=0;offset<total;offset+=24) {
      const frames=Array.from({length:Math.min(24,total-offset)},(_,index)=>{const frame=offset+index,elapsed=Math.min(renderSeconds,frame/fps);return {frame,elapsed,year:frame===total-1?range[1]:yearAt(Math.min(seconds,elapsed))};});
      const batch=await page.evaluate(async ({frames,fps})=>{
        let status;const motion=[];for(const item of frames){status=await window.__romaVideo.frame(item.year,item.elapsed);motion.push({...item,zoom:status.zoom,center:status.center,dots:status.dots,earlyTravel:status.earlyTravel});const canvas=window.__romaVideo.compose();const frame=new VideoFrame(canvas,{timestamp:Math.round(item.frame*1000000/fps),duration:Math.round(1000000/fps)});window.__romaEncoder.encode(frame,{keyFrame:item.frame%(fps*5)===0});frame.close();if(window.__romaEncoder.encodeQueueSize>6)await window.__romaEncoder.flush();}
        await window.__romaEncoder.flush();if(window.__romaEncoderError)throw new Error(window.__romaEncoderError);
        const size=window.__romaChunks.reduce((sum,chunk)=>sum+chunk.length,0),bytes=new Uint8Array(size);let cursor=0;for(const chunk of window.__romaChunks){bytes.set(chunk,cursor);cursor+=chunk.length;}window.__romaChunks=[];
        let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return {data:btoa(binary),status,motion};
      },{frames,fps});
      cameraTrace.push(...batch.motion);
      if(!encoder.stdin.write(Buffer.from(batch.data,'base64')))await once(encoder.stdin,'drain');
      const last=frames.at(-1);console.log(JSON.stringify({phase:'rendering',...last,total,dots:batch.status.dots,zoom:batch.status.zoom,cameraRegion:batch.status.cameraRegion,cues:batch.status.cues.filter(cue=>cue.visible).map(cue=>cue.text)}));
      await writeFile(join(inspection,'progress.json'),JSON.stringify({...last,total,partial}));
      if (errors.length) throw new Error(errors.join('\n'));
    }
    await page.evaluate(()=>window.__romaEncoder.close());
    encoder.stdin.end(); const [code] = await completion;
    if (code !== 0) throw new Error(diagnostics);
    await rename(partial,viewing);
    const videos = { viewing: await probe(viewing) };
    for (const [name,path] of [['viewing',viewing]]) {
      const stream=videos[name].streams[0];
      if (stream.codec_name !== 'h264' || stream.width !== width || stream.height !== height || stream.pix_fmt !== 'yuv420p' || Number(stream.nb_frames) !== total) throw new Error('Invalid completed video '+name);
      if(Number(videos[name].format.duration)>=120||Math.abs(Number(videos[name].format.duration)-total/fps)>.15)throw new Error('Video duration does not meet the under-two-minute target');
      await command([ffmpeg,'-v','error','-i',path,'-f','null','-']);
    }
    const playback = await browser.newPage(); await playback.goto(new URL('__roma-video-player',base).href);
    const playbackChecks = [];
    for (const path of [viewing]) {
      const url = new URL('outputs/'+path.split(/[\\/]/).at(-1),base).href;
      playbackChecks.push(await playback.evaluate(async url => {
        const video = document.createElement('video');video.muted=true;video.preload='auto';video.src=url;document.body.replaceChildren(video);
        await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=()=>reject(new Error('Video metadata failed'));});
        const samples=[];for(const fraction of [.001,.5,.999]){video.currentTime=video.duration*fraction;await new Promise((resolve,reject)=>{video.onseeked=resolve;video.onerror=()=>reject(new Error('Video seek failed'));});samples.push({time:video.currentTime,readyState:video.readyState,width:video.videoWidth,height:video.videoHeight});}
        video.currentTime=0;await new Promise(resolve=>video.onseeked=resolve);await video.play();await new Promise(resolve=>setTimeout(resolve,900));video.pause();
        if(video.currentTime<=0)throw new Error('Video playback did not advance');return {url,duration:video.duration,samples,playbackAdvanced:video.currentTime};
      },url));
    }
    for (const [label,time] of [['opening',0],['opening-2s',2],['opening-5s',5],['opening-10s',10],['opening-15s',15],['opening-20s',20],['opening-25s',25],['opening-30s',30],['middle',seconds/2],['ending',renderSeconds-.1]])
      await command([ffmpeg,'-n','-hide_banner','-loglevel','error','-ss',String(time),'-i',viewing,'-frames:v','1',join(inspection,`${label}.png`)]);
    const cameraMotion=cameraMotionSummary(cameraTrace);
    await writeFile(join(inspection,'camera-motion.json'),JSON.stringify({fps,summary:cameraMotion,frames:cameraTrace},null,2));
    const routeFrames=new Map();
    for(const frame of cameraTrace)for(const route of frame.earlyTravel??[]){
      const row=routeFrames.get(route.id)??{id:route.id,frames:0,visibleFrames:0,visibleDotFrames:0,slots:new Map()};
      row.frames++;if(route.moving.some(dot=>dot.visible))row.visibleFrames++;
      for(const dot of route.moving){if(dot.visible)row.visibleDotFrames++;const slot=row.slots.get(dot.slot)??{slot:dot.slot,frames:0,visibleFrames:0,minProgress:1,maxProgress:0};slot.frames++;if(dot.visible)slot.visibleFrames++;slot.minProgress=Math.min(slot.minProgress,dot.progress??0);slot.maxProgress=Math.max(slot.maxProgress,dot.progress??0);row.slots.set(dot.slot,slot);}routeFrames.set(route.id,row);
    }
    const earlyRouteMotion=[...routeFrames.values()].map(row=>({...row,seconds:row.frames/fps,visibleSeconds:row.visibleFrames/fps,slots:[...row.slots.values()]}));
    await writeFile(join(inspection,'journey-motion.json'),JSON.stringify({fps,travelDurations,earlyRouteMotion},null,2));
    const earlyJourneys=travelDurations.filter(route=>route.start>=range[0]&&route.end<=1100);
    const earlyMotionFailures=[];
    for(const journey of earlyJourneys){
      const sampled=earlyRouteMotion.find(route=>route.id===journey.id),leading=sampled?.slots.find(slot=>slot.slot===0);
      if(journey.minimumSeconds<1.5||!leading||leading.frames<24||leading.minProgress>.08||leading.maxProgress<.92||leading.visibleFrames/leading.frames<.98)
        earlyMotionFailures.push({journey,sampled});
    }
    if(earlyMotionFailures.length)throw new Error('Early journeys must visibly traverse their complete corridors over multiple frames: '+JSON.stringify(earlyMotionFailures));
    if(raw.meta.cameraPath){
      const step=24/fps;
      if(cameraMotion.maxPanPixelsPerFrame>=8*step||cameraMotion.maxZoomPerFrame>=.012*step||cameraMotion.maxPanAccelerationPixelsPerFrameSquared>=.15*step*step||cameraMotion.zoomInFrames||cameraMotion.horizontalReversals)throw new Error('The rendered camera did not meet the smooth continuous opening requirements: '+JSON.stringify(cameraMotion));
    }
    await writeFile(join(inspection,'loaded-source-fingerprints.json'),JSON.stringify(loadedSourceFingerprints,null,2));
    const currentFingerprints = Object.fromEntries(await Promise.all(fingerprintFiles.map(async path=>[path,createHash('sha256').update(await readFile(path)).digest('hex')])));
    const changedDuringExport = fingerprintFiles.filter(path=>fingerprints[path]!==currentFingerprints[path]);
    const loadedSourceChangedDuringExport=[];
    for(const [path,loadedHash] of Object.entries(loadedSourceFingerprints)){
      if(createHash('sha256').update(await readFile(path)).digest('hex')!==loadedHash)loadedSourceChangedDuringExport.push(path);
    }
    await writeFile(metadataPath,JSON.stringify({schemaVersion:1,edition:'roma',title:meta.title,manifest,range,speed,phases,phaseRates:phases.map(p=>({from:p.from,to:p.to,rate:phaseRateAt(p.from,phases)})),peoplePerDot:1000,dotScale:expectedDotScale,dotStyle:meta.dotStyle,cameraPath:raw.meta.cameraPath,cameraRegions:raw.meta.cameraRegions,continuationCues:raw.meta.continuationCues,estimate:'central',resolution:[width,height],fps,frames:total,originalSeconds,timelineSeconds:seconds,endHoldSeconds,durationSeconds:total/fps,timeScale,
      temporalSampling:'The complete video follows the corrected app clock at the configured frame rate; app and video use identical default pacing. Early journey motion is recorded at every actual encoded frame.',travelDurations,earlyRouteMotion,
      sourceFingerprints:fingerprints,loadedSourceFingerprints,loadedSourceDirectory:join(inspection,'loaded-source'),changedDuringExport,loadedSourceChangedDuringExport,cameraMotion,inspection,checks,videos,playbackChecks,errors},null,2)+'\n');
    if(changedDuringExport.length||loadedSourceChangedDuringExport.length)throw new Error('Prepared Roma inputs changed during capture: '+JSON.stringify({changedDuringExport,loadedSourceChangedDuringExport,metadataPath}));
    console.log(JSON.stringify({phase:'complete',viewing,metadataPath,inspection,changedDuringExport,loadedSourceChangedDuringExport,cameraMotion}));
  }
} finally {
  if (encoder && encoder.exitCode === null) encoder.kill();
  await browser.close();await server.close();
}
