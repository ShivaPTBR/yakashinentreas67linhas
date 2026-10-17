import { CAST, type Chapter, type Sentence, type Scene, type Mood, type Character, type Library } from './types';
// Segments preserve every original character; offsets refer to the original source.
export function segmentText(text:string): Sentence[] {
 const report='disse|perguntou|respondeu|comentou|gritou|pensou|provocou|concluiu|sugeriu|explicou|exclamou|garantiu|incentivou|retrucou|retorquiu|instruiu|encorajou|afirmou|desafiou|zombou|reclamou|rebateu|rugiu|esbravejou|completou|admitiu|protestou';
 const names='Sr\\. Nakurama|Yakashin|Kaito|Isamu|Takumi|Hirotaka|Hiro|pai|goleiro|garoto|professor';
 const normalize=(name:string):Character=>name==='pai'?'Sr. Nakurama':['goleiro','garoto'].includes(name)?'Takumi':name==='professor'?'Hirotaka':CAST.includes(name as Character)?name as Character:'Narrador';
 const reporting=new RegExp(`^(?:${report})\\b|^(?:O\\s+)?(?:${names})\\s+(?:${report}|sorriu|colocou|inclinou)\\b|^,`,'u');
 const marks=[...text.matchAll(/—\s*/gu)].map(m=>({start:m.index!,end:m.index!+m[0].length,narrative:reporting.test(text.slice(m.index!+m[0].length))}));
 const ranges=marks.filter(m=>!m.narrative).map(m=>{const next=marks.find(n=>n.start>m.start);const end=next?.start??text.length;const after=text.slice(end,end+220);let name=after.match(new RegExp(`(?:${report})\\s+(?:o\\s+)?(${names})`,'u'))?.[1]??after.match(new RegExp(`(${names})\\s+(?:${report})`,'u'))?.[1];if(!name){const before=text.slice(Math.max(0,m.start-320),m.start);const matches=[...before.matchAll(new RegExp(`(${names})`,'gu'))];name=matches.at(-1)?.[1];}return {start:m.start,end,speaker:name?normalize(name):'Narrador'};});
 const boundaries=new Set<number>([0,text.length]);for(const part of new Intl.Segmenter('pt-BR',{granularity:'sentence'}).segment(text)){const end=part.index+part.segment.length;if(!/(?:Sr|Sra|Dr|Dra|Prof)\.\s*$/u.test(part.segment))boundaries.add(end);}for(const m of marks)boundaries.add(m.start);
 const offsets=[...boundaries].sort((a,b)=>a-b);const result:Sentence[]=[];let paragraph=0,size=0;
 for(let i=0;i<offsets.length-1;i++){const start=offsets[i],end=offsets[i+1],chunk=text.slice(start,end);if(!chunk)continue;const range=ranges.find(r=>start>=r.start&&start<r.end);const opening=range?.start===start;if(size>420||opening||chunk.includes('\n\n')){paragraph++;size=0;}result.push({text:chunk,start,end,paragraph,speaker:range?.speaker??'Narrador'});size+=chunk.length;}
 return result;
}
const CUES:[string,string,Mood,string[]][] = [
 ['', 'Um sonho à mesa','calm',['Yakashin','Sr. Nakurama']],
 ['Até que depois de um tempo, Yakashin sentiu um arrepio','Olhares na sala','suspense',['Yakashin','Kaito','Tatsuya','Raiki']],
 ['O sinal tocou, e Hiro','O intervalo','calm',['Yakashin','Hiro']],
 ['De repente, a harmonia foi interrompida','O desafio do rei','suspense',['Yakashin','Kaito']],
 ['Yakashin e Kaito chegaram à quadra','Cinco gols para vencer','tension',['Yakashin','Kaito','Takumi']],
 ['Até que, depois de vários chutes, Kaito finalmente fez o gol.','O primeiro golpe','climax',['Kaito','Takumi']],
 ['O jogo recomeçou e a bola foi direto para Kaito','A muralha de ouro','tension',['Yakashin','Kaito','Takumi']],
 ['Kaito, sentindo a vitória cada vez mais próxima','Um novo desafiante','climax',['Isamu','Kaito','Yakashin']],
 ['A humilhação era evidente.Isamu','À margem da própria partida','tension',['Yakashin','Isamu','Kaito']],
 ['Exausto e desanimado, Yakashin decidiu','A força dos amigos','emotional',['Yakashin','Hiro']],
 ['Com a motivação renovada, Yakashin se lança','De volta à disputa','tension',['Yakashin','Isamu','Kaito']],
 ['Com a bola voltando a rolar novamente, Yakashin','As palavras do pai','emotional',['Yakashin','Sr. Nakurama']],
 ['Yakashin, impulsionado pelas palavras de seu pai','A resposta de Yakashin','climax',['Yakashin','Isamu','Kaito','Takumi']],
 ['Depois disso, a quadra se transformou','Três vontades, um gol','tension',['Yakashin','Kaito','Isamu']],
 ['Yakashin, com sua persistência, conseguiu recuperar','O despertar','climax',['Yakashin','Isamu','Kaito']],
 ['A discussão entre os dois rivais','No limite','tension',['Takumi','Yakashin','Kaito','Isamu']],
 ['No entanto, quando a bola estava prestes a cruzar a linha','A bicicleta e a disputa final','climax',['Yakashin','Kaito','Isamu','Takumi']],
 ['Ao invés de celebrar, Kaito sai da quadra revoltado.','O preço da vitória','emotional',['Kaito','Yakashin','Isamu']],
 ['Yakashin voltou para a sala de aula','Uma chama acesa','emotional',['Yakashin','Hiro']],
 ['Pai, você não vai acreditar no que aconteceu hoje!','De igual para igual','calm',['Yakashin','Sr. Nakurama']],
 ['Foi então que um homem alto','O encontro com Hirotaka','emotional',['Yakashin','Hirotaka']],
 ['Após finalizar o treino de perna','Cada gota de suor','emotional',['Yakashin','Hirotaka']],
 ['Depois de horas intensas de treino','A jornada está só começando','emotional',['Yakashin','Sr. Nakurama']]
];
export function editorialScenes(text:string):Scene[]{
 const found=CUES.map(([anchor,name,mood,characters],i)=>({id:`scene-${i}`,start:anchor?text.indexOf(anchor):0,name,mood,characters,emotion:mood==='emotional'?'superação e esperança':mood==='climax'?'determinação e intensidade':mood==='tension'?'rivalidade':mood==='suspense'?'antecipação':'acolhimento',style:mood==='climax'?'Intenso, firme, sem gritar':'Expressivo, pausas naturais',end:0})).filter(s=>s.start>=0).sort((a,b)=>a.start-b.start);
 return found.map((s,i)=>({...s,end:found[i+1]?.start??text.length}));
}
export function getScene(scenes:Scene[],offset:number){return scenes.find(s=>offset>=s.start&&offset<s.end)??scenes[0];}
export function validateScenes(scenes:Scene[],text:string):boolean {return scenes.length>0&&scenes.length<=120&&scenes[0].start===0&&scenes.at(-1)?.end===text.length&&scenes.every((s,i)=>typeof s.name==='string'&&s.name.length<200&&['calm','suspense','tension','climax','emotional'].includes(s.mood)&&Number.isInteger(s.start)&&Number.isInteger(s.end)&&s.end>s.start&&(i===0||s.start===scenes[i-1].end));}
export function canReadChapter(chapter:Chapter){return chapter.id===3&&chapter.status==='published';}
export const DEFAULT_LIBRARY:Library={tracks:[{id:'5Zzw4t-4mMM',title:'Faixa original · título pendente',categories:[],source:'playlist'}],voices:Object.fromEntries(CAST.map((name,i)=>[name,{browserVoice:'',pronunciation:name,pitch:[0.86,1.05,0.9,0.97,1.16,1.1,0.82,0.88][i]}]))};
