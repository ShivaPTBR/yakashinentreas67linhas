import { isAdmin, identity } from '../lib/server';
import AdminDashboard from '../components/AdminDashboard';
import { LockKeyhole,ArrowLeft,LogIn } from 'lucide-react';
export const dynamic='force-dynamic';
export default async function AdminPage(){if(!await isAdmin()){const user=await identity();return <main className="error-page"><LockKeyhole size={38}/><span className="eyebrow gold">ESTÚDIO YAKASHIN</span><h1>Histórias merecem<br/>um espaço seguro.</h1><p>{user?'Seu acesso não inclui o Estúdio. Configure ADMIN_EMAILS no servidor.':'Entre com sua conta para acessar o painel administrativo.'}</p>{!user&&<a className="button primary" href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top"><LogIn size={18}/> Entrar com ChatGPT</a>}<a className="text-link" href="/"><ArrowLeft size={15}/> Voltar à experiência</a></main>;}return <AdminDashboard/>;}
