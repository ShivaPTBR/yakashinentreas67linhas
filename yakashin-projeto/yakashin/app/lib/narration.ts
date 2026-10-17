import type { Chapter, Library, Preferences, Sentence } from './types';
import { segmentText } from './story';
export type Position={index:number;char:number;audioTime:number};
export class NarrationEngine {
 private generation=0;private utterance:SpeechSynthesisUtterance|null=null;private active=false;
 sentences:Sentence[];position:Position={index:0,char:0,audioTime:0};
 constructor(private chapter:Chapter,private prefs:()=>Preferences,private lib:()=>Library,private onPosition:(p:Position)=>void,private onState:(s:'playing'|'paused'|'loading'|'ended')=>void,private onError:(message:string)=>void){this.sentences=segmentText(chapter.text);}
 setPosition(p:Position){this.position={index:Math.max(0,Math.min(this.sentences.length-1,p.index)),char:Math.max(0,p.char),audioTime:p.audioTime};}
 private publish(){this.onPosition({...this.position});}
 async play(){this.halt(false);this.active=true;const token=this.generation;await this.speak(token);}
 private async speak(token:number):Promise<void>{
  if(!this.active||token!==this.generation)return;
  const s=this.sentences[this.position.index];if(!s){this.finish();return;}
  const pref=this.prefs();
  if(!('speechSynthesis' in window)){this.pause();this.onError('Este navegador não oferece síntese de voz. Use um navegador com Web Speech e vozes instaladas.');return;}
  const available=speechSynthesis.getVoices();const pt=available.filter(v=>v.lang.toLowerCase().startsWith('pt'));
  if(!pt.length){this.pause();this.onError('Nenhuma voz portuguesa instalada. Instale uma voz pt-BR no dispositivo e tente novamente.');return;}
  const voiceData=this.lib().voices[pref.multiVoice?s.speaker:'Narrador'];
  const chosen=available.find(v=>v.voiceURI===(pref.multiVoice?voiceData?.browserVoice:'')||v.voiceURI===pref.voiceURI)||pt.find(v=>v.lang==='pt-BR')||pt[0];
  const offset=this.position.char;const {spoken,map}=pronounce(s.text.slice(offset),this.lib());const u=new SpeechSynthesisUtterance(spoken);this.utterance=u;u.lang='pt-BR';u.voice=chosen;u.rate=pref.rate;u.volume=pref.voiceVolume;u.pitch=pref.multiVoice?(voiceData?.pitch??1):1;
  u.onstart=()=>{if(token===this.generation)this.onState('playing');};
  u.onboundary=(event)=>{if(token!==this.generation||!this.active)return;this.position.char=offset+(map[event.charIndex]??event.charIndex);this.position.audioTime=event.elapsedTime;this.publish();};
  u.onend=()=>this.advance(token);u.onerror=(event)=>{if(token!==this.generation||event.error==='canceled'||event.error==='interrupted')return;this.pause();this.onError(`A voz foi interrompida (${event.error}). Tente reproduzir novamente.`);};
  speechSynthesis.speak(u);
 }
 private advance(token:number){if(token!==this.generation||!this.active)return;this.position={index:this.position.index+1,char:0,audioTime:0};if(this.position.index>=this.sentences.length){this.finish();return;}this.publish();if(!this.prefs().automatic){this.pause();return;}void this.speak(token);}
 private finish(){this.halt(false);this.position={index:this.sentences.length-1,char:this.sentences.at(-1)?.text.length??0,audioTime:0};this.publish();this.onState('ended');}
 private halt(notify=true){this.generation++;this.active=false;if(typeof window!=='undefined'&&'speechSynthesis'in window)speechSynthesis.cancel();this.utterance=null;if(notify)this.onState('paused');}
 pause(){this.halt();}
 seek(index:number,char=0){const was=this.active;this.halt();this.position={index:Math.min(Math.max(index,0),this.sentences.length-1),char,audioTime:0};this.publish();if(was)void this.play();}
 // Web Speech has no time seeking API: navigation is explicitly approximate.
 async seekSeconds(delta:number){const target=this.position.char+Math.round(delta*14*this.prefs().rate);let i=this.position.index,c=target;while(c<0&&i>0)c+=this.sentences[--i].text.length;while(c>=this.sentences[i].text.length&&i<this.sentences.length-1)c-=this.sentences[i++].text.length;this.seek(i,Math.max(0,Math.min(c,this.sentences[i].text.length-1)));}
 update(){if(this.utterance)this.utterance.volume=this.prefs().voiceVolume;}
 dispose(){this.halt(false);}
}
export function pronounce(text:string,lib:Library){const replacements=Object.entries(lib.voices).filter(([k,v])=>v.pronunciation&&k!==v.pronunciation).sort((a,b)=>b[0].length-a[0].length);let spoken='',map:number[]=[];for(let i=0;i<text.length;){const match=replacements.find(([name])=>text.startsWith(name,i));if(match){const [name,v]=match;for(let j=0;j<v.pronunciation.length;j++){spoken+=v.pronunciation[j];map.push(i+Math.min(name.length-1,Math.floor(j*name.length/v.pronunciation.length)));}i+=name.length;}else{spoken+=text[i];map.push(i++);}}return {spoken,map};}
