import { notFound } from 'next/navigation';
import { chapter } from '../../lib/server';
import { canReadChapter } from '../../lib/story';
import Reader from '../../components/Reader';
export const dynamic='force-dynamic';
export default async function ReadingPage({params}:{params:Promise<{id:string}>}){const{id}=await params;if(id!=='3')notFound();const c=await chapter(3);if(!c||!canReadChapter(c))notFound();return <Reader chapter={c}/>;}
