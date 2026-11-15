import type {Dataset} from '../data/types';
import type {FrameState,DotBuffer} from '../sim/engine';
import {readCameraPath} from '../data/camera-path';
import {phasePlaybackDuration} from '../time/phase-pacing';
import {geographicCameraFrame,populationCameraFrame,type PopulationCameraTarget,type PopulationCameraViewport} from './population-camera';
import {mercX,mercY,mercToLonLat} from '../util/geo';
type Populations=Pick<FrameState,'settlements'|'migrations'>;
export interface NarrativeCameraPathPlan {readonly keyframeCount:number;at(year:number,viewport:PopulationCameraViewport):PopulationCameraTarget|null}
/** Freeze only the initial occupied footprint. Later poses never chase live dots,
 * activation dates, density changes or instantaneous containment corrections. */
export function createNarrativeCameraPathPlan(dataset:Dataset,frameAtYear:(year:number)=>Populations):NarrativeCameraPathPlan|null {
  const path=readCameraPath(dataset.meta.cameraPath,dataset.meta.timeRange);
  if(!path||!dataset.meta.playback?.phases?.length)return null;
  const range=dataset.meta.timeRange,speed=dataset.meta.playback.defaultSpeed;
  const secondsAt=(year:number)=>year<=range[0]?0:phasePlaybackDuration(dataset,[range[0],Math.min(range[1],year)],speed);
  const times=path.map(point=>secondsAt(point.year));
  if(times.some((time,index)=>!Number.isFinite(time)||index>0&&time<=times[index-1]))return null;
  const source=frameAtYear(path[0].year);
  // A live engine may reuse its buffers. The opening cannot drift after a later frame.
  const freeze=(dots:DotBuffer):DotBuffer=>({...dots,xs:dots.xs.slice(0,dots.count),ys:dots.ys.slice(0,dots.count),alphas:dots.alphas.slice(0,dots.count)});
  const opening:Populations={settlements:source.settlements.map(item=>({...item,dots:freeze(item.dots)})),migrations:source.migrations.map(item=>({...item,dots:freeze(item.dots)}))};
  return{keyframeCount:path.length,at(year,viewport){
    if(!Number.isFinite(year))return null;
    const first=populationCameraFrame(opening,viewport);if(!first)return null;
    const poses=[first,...path.slice(1).map(point=>geographicCameraFrame(point.bounds!,viewport))];
    const seconds=secondsAt(year);if(seconds<=times[0])return poses[0];
    for(let index=1;index<times.length;index++){
      if(seconds>times[index])continue;
      const previous=poses[index-1],next=poses[index],u=Math.max(0,Math.min(1,(seconds-times[index-1])/(times[index]-times[index-1])));
      // Quintic interpolation has zero velocity and acceleration at each pose.
      const weight=u*u*u*(10+u*(-15+6*u));
      const delta=((next.center[0]-previous.center[0]+540)%360)-180;
      const center=mercToLonLat(mercX(previous.center[0]+delta*weight),mercY(previous.center[1])+(mercY(next.center[1])-mercY(previous.center[1]))*weight);
      center[0]=((center[0]+180)%360+360)%360-180;
      return{center,zoom:previous.zoom+(next.zoom-previous.zoom)*weight};
    }
    return poses[poses.length-1];
  }};
}
