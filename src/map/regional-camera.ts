import type {CameraRegionRule} from '../data/camera-regions';
import {cameraRegionAt} from '../data/camera-regions';
import {geographicCameraFrame,type PopulationCameraTarget,type PopulationCameraViewport} from './population-camera';
import {mercX,mercY,mercToLonLat} from '../util/geo';
export interface RegionalCameraFrame {camera:PopulationCameraTarget;rule:CameraRegionRule;progress:number}
/** A display focus overrides only the default overview, never selected populations. */
export function regionalCameraFrame(year:number,rules:readonly CameraRegionRule[],viewport:PopulationCameraViewport,occupied:PopulationCameraTarget|null,hasSelection=false):RegionalCameraFrame|null {
  if(hasSelection)return null;
  const rule=cameraRegionAt(year,rules);if(!rule)return null;
  const target=geographicCameraFrame(rule.bounds,viewport);
  const progress=rule.transitionYears?Math.max(0,Math.min(1,(year-rule.from)/rule.transitionYears)):1;
  if(progress>=1)return{camera:target,rule,progress};
  const previous=rules[rules.indexOf(rule)-1];
  if(rule.transitionFromPrevious&&previous)occupied=geographicCameraFrame(previous.bounds,viewport);
  if(!occupied)return{camera:target,rule,progress};
  const longitudeDelta=((target.center[0]-occupied.center[0]+540)%360)-180;
  const x=mercX(occupied.center[0]+longitudeDelta*progress),y=mercY(occupied.center[1])+(mercY(target.center[1])-mercY(occupied.center[1]))*progress;
  const center=mercToLonLat(x,y);center[0]=((center[0]+180)%360+360)%360-180;
  return{camera:{center,zoom:occupied.zoom+(target.zoom-occupied.zoom)*progress},rule,progress};
}
