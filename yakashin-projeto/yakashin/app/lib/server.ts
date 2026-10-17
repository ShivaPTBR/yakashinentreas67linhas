import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
import { ORIGINAL_CHAPTER_3 } from './chapter3';
import { editorialScenes, DEFAULT_LIBRARY } from './story';
import type { Chapter } from './types';
export function runtime(){return env as unknown as {DB?:D1Database;ADMIN_EMAILS?:string;ADMIN_MODE?:string;ANTHROPIC_API_KEY?:string;ANTHROPIC_MODEL?:string;YOUTUBE_API_KEY?:string};}
export async function identity(){return getChatGPTUser();}
export async function isAdmin(){const user=await identity();if(!user)return false;const e=runtime();return e.ADMIN_EMAILS?.split(',').map(s=>s.trim().toLowerCase()).includes(user.email.toLowerCase())??(e.ADMIN_MODE==='owner-private'||(import.meta.env.DEV&&user.userId==='local_seedy'));}
export async function readDocument<T>(id:string,fallback:T):Promise<T>{const db=runtime().DB;if(!db)return fallback;const row=await db.prepare('SELECT payload FROM documents WHERE id = ?').bind(id).first<{payload:string}>();return row?JSON.parse(row.payload):fallback;}
export async function writeDocument(id:string,payload:unknown){const db=runtime().DB;if(!db)throw new Error('Armazenamento permanente indisponível');await db.prepare('INSERT INTO documents (id,payload,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at').bind(id,JSON.stringify(payload),Date.now()).run();}
export const INITIAL_CHAPTER:Chapter={id:3,title:'O Trio de Ouro e o Desafio da Academia',description:'Três talentos. Uma quadra. O primeiro passo de uma rivalidade que vai mudar tudo.',text:ORIGINAL_CHAPTER_3,status:'published',cover:'/stadium.webp',scenes:editorialScenes(ORIGINAL_CHAPTER_3),revision:1,analysis:'editorial'};
export async function chapter(id:number):Promise<Chapter|null>{return readDocument<Chapter|null>(`chapter:${id}`,id===3?INITIAL_CHAPTER:null);}
export async function library(){const saved=await readDocument('library',DEFAULT_LIBRARY);return {...saved,voices:Object.fromEntries(Object.entries(saved.voices).map(([name,v])=>[name,{browserVoice:v.browserVoice,pronunciation:v.pronunciation,pitch:v.pitch}]))};}
