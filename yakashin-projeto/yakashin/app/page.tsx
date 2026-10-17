import Landing from './components/Landing';
import { ORIGINAL_CHAPTER_3 } from './lib/chapter3';
const words=ORIGINAL_CHAPTER_3.split(/\s+/).length;
export default function Home(){return <Landing wordCount={words} minutes={Math.ceil(words/190)}/>;}
