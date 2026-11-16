import type {Dataset,Settlement} from '../data/types';
import {growPopulation,ledgerEvents} from '../data/population-ledger';

export interface SlotTransfer { fromSlot:number; toSlot:number }
/** Biological occupation/birth year stays separate from an inherited local
 * dispersal epoch; a birth is never reclassified as an immigrant credit. */
export interface StandingSlotOrigin { readonly year:number; readonly kind:'initial'|'arrival'|'growth'; readonly dispersionFrom?:number }
interface SlotOperation {year:number; changes:[number,number][]; origins:[number,StandingSlotOrigin|null][]; balance:number; nextSlot:number}
interface SlotPlan {initial:Map<number,number>; initialOrigins:Map<number,StandingSlotOrigin>; operations:SlotOperation[]; maxSlot:number}
export interface StandingSlots {stocks:Map<string,SlotPlan>; transfers:Map<string,SlotTransfer>; unit:number}
export const transferKey=(migrationId:string,index:number)=>`${migrationId}:${index}`;

/** The callback observes only genuinely new occupations, including reused IDs. */
function addPeople(slots:Map<number,number>,people:number,unit:number,next:number,changes:Map<number,number>,fresh=false,created?:(id:number,addedBefore:number)=>void):number {
  if(people<=1e-8)return next;
  const total=people;
  if(!fresh)for(const [id,value] of slots){if(value>=unit||people<=1e-8)continue;const take=Math.min(unit-value,people);slots.set(id,value+take);changes.set(id,value+take);people-=take;}
  let id=0;
  while(people>1e-8){while(slots.has(id))id++;created?.(id,total-people);const take=Math.min(unit,people);slots.set(id,take);changes.set(id,take);people-=take;next=Math.max(next,id+1);}
  return next;
}

/** Invert the same logistic curve used by ledger balances. A new slot starts
 * when preceding partial slots are full, rather than at the next ledger event. */
function growthOriginYear(initial:number,target:number,start:number,end:number,rate:number,capacity:number):number {
  if(target<=initial+1e-8)return start;
  if(!(rate>0&&initial>0&&initial<capacity&&target<capacity))return end;
  const elapsed=Math.log((target*(capacity-initial))/(initial*(capacity-target)))/rate;
  return Number.isFinite(elapsed)?Math.max(start,Math.min(end,start+elapsed)):end;
}

/** Young arrivals pass their current settlement-front age to new local births.
 * Any surviving established local lineage keeps its regional mature placement. */
function growthDispersionFrom(origins:Map<number,StandingSlotOrigin>):number|undefined {
 let earliest=Infinity;
 for(const origin of origins.values()){
  if(origin.kind==='initial'||origin.kind==='growth'&&origin.dispersionFrom===undefined)return undefined;
  const epoch=origin.kind==='arrival'?origin.year:origin.dispersionFrom;
  if(epoch!==undefined&&Number.isFinite(epoch))earliest=Math.min(earliest,epoch);
 }
 return Number.isFinite(earliest)?earliest:undefined;
}
/** Assign lifetime slot numbers before rendering. A debit vacates its named
 * slot; its travelling dot begins there, and fills a named arrival slot. */
export function buildStandingSlots(dataset:Dataset,unit:number,mode:'mid'|'low'|'high'='mid'):StandingSlots {
 const out:StandingSlots={stocks:new Map(),transfers:new Map(),unit},events=ledgerEvents(dataset,unit,mode);
 for(const s of dataset.settlements){if(!s.ledger)continue;
  const slots=new Map<number,number>(),origins=new Map<number,StandingSlotOrigin>();
  let next=addPeople(slots,s.ledger.initial,unit,0,new Map(),false,id=>origins.set(id,{year:s.start,kind:'initial'})),v=s.ledger.initial,t=s.start;
  const plan:SlotPlan={initial:new Map(slots),initialOrigins:new Map(origins),operations:[],maxSlot:next};
  for(const e of events.get(s.id)??[]){
   const grown=growPopulation(v,e.year-t,s.ledger.annualRate,s.ledger.capacity),changes=new Map<number,number>(),originChanges=new Map<number,StandingSlotOrigin|null>();
   const dispersionFrom=growthDispersionFrom(origins);
   next=addPeople(slots,Math.max(0,grown-v),unit,next,changes,false,(id,addedBefore)=>{
    const origin:StandingSlotOrigin={year:growthOriginYear(v,v+addedBefore,t,e.year,s.ledger!.annualRate,s.ledger!.capacity),kind:'growth',...(dispersionFrom!==undefined?{dispersionFrom}:{})};
    origins.set(id,origin);originChanges.set(id,origin);
   });
   const key=transferKey(e.migrationId,e.index),link=out.transfers.get(key)??{fromSlot:-1,toSlot:-1};
   if(e.delta<0){
    let needed=-e.delta;
    const order=[...slots].sort((a,b)=>(b[1]>=needed?1:0)-(a[1]>=needed?1:0)||a[0]-b[0]);
    for(const [id,value] of order){if(needed<=1e-6)break;const take=Math.min(value,needed);if(link.fromSlot<0)link.fromSlot=id;
     if(value-take<1e-6){slots.delete(id);origins.delete(id);originChanges.set(id,null);}else slots.set(id,value-take);
     changes.set(id,Math.max(0,value-take));needed-=take;
    }
    if(needed>.01)throw new Error(`${s.id}: stable slots cannot fund ${e.migrationId} at ${e.year}`);
   }else{
    if(e.descendantSupport&&!origins.size)throw new Error(`${s.id}: descendant support ${e.migrationId} requires a surviving resident lineage at ${e.year}`);
    const inherited=e.descendantSupport?growthDispersionFrom(origins):undefined;
    let id=0;while(slots.has(id))id++;link.toSlot=id;
    next=addPeople(slots,e.delta,unit,next,changes,true,slot=>{
     const origin:StandingSlotOrigin={year:e.year,kind:e.descendantSupport?'growth':e.kind==='addition'?'initial':'arrival',...(inherited!==undefined?{dispersionFrom:inherited}:{})};
     origins.set(slot,origin);originChanges.set(slot,origin);
    });
   }
   if(!e.kind)out.transfers.set(key,link);v=grown+e.delta;t=e.year;
   plan.operations.push({year:e.year,changes:[...changes],origins:[...originChanges],balance:v,nextSlot:next});
  }
  plan.maxSlot=next;out.stocks.set(s.id,plan);
 }
 return out;
}

function stateAt(plan:StandingSlots,s:Settlement,t:number,includeOrigins:boolean):{slots:Map<number,number>;origins:Map<number,StandingSlotOrigin>} {
 const stock=plan.stocks.get(s.id)!;const slots=new Map(stock.initial),origins=includeOrigins?new Map(stock.initialOrigins):new Map<number,StandingSlotOrigin>();
 let balance=s.ledger!.initial,year=s.start,next=stock.initial.size;
 for(const op of stock.operations){if(op.year>t)break;
  for(const [id,value]of op.changes){if(value<1e-6)slots.delete(id);else slots.set(id,value);}
  if(includeOrigins)for(const [id,origin]of op.origins){if(origin)origins.set(id,origin);else origins.delete(id);}
  balance=op.balance;year=op.year;next=op.nextSlot;
 }
 const grown=growPopulation(balance,Math.max(0,t-year),s.ledger!.annualRate,s.ledger!.capacity);
 const dispersionFrom=includeOrigins?growthDispersionFrom(origins):undefined;
 addPeople(slots,Math.max(0,grown-balance),plan.unit,next,new Map(),false,includeOrigins?(id,addedBefore)=>origins.set(id,{year:growthOriginYear(balance,balance+addedBefore,year,t,s.ledger!.annualRate,s.ledger!.capacity),kind:'growth',...(dispersionFrom!==undefined?{dispersionFrom}:{})}):undefined);
 return {slots,origins};
}

export function standingSlotsAt(plan:StandingSlots,s:Settlement,t:number):Map<number,number> {
 return stateAt(plan,s,t,false).slots;
}

/** Resolve weights and their current lineage together for dynamic settlements. */
export function standingSlotStateAt(plan:StandingSlots,s:Settlement,t:number):{slots:Map<number,number>;origins:Map<number,StandingSlotOrigin>} {
 const state=stateAt(plan,s,t,true),firstOperation=plan.stocks.get(s.id)?.operations[0]?.year??Infinity;
 if(t<s.start&&t<firstOperation)state.origins.clear();
 return state;
}

/** Creation time belongs to the current occupation of a slot, not its first
 * historical use. Query just before a debit to locate the departing people. */
export function standingSlotOriginsAt(plan:StandingSlots,s:Settlement,t:number):Map<number,StandingSlotOrigin> {
 return standingSlotStateAt(plan,s,t).origins;
}


