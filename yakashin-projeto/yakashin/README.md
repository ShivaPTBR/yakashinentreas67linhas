# YAKASHIN — Road to the World Cup

Aplicação React + TypeScript executada com Vinext e Cloudflare Workers. Interface em português brasileiro, Tailwind CSS, Framer Motion, persistência Cloudflare D1 e player autorizado do YouTube.

## Uso

- `/`: apresentação e seleção de capítulos.
- `/ler/3`: capítulo integral, leitura manual, narração, cinema e trilha.
- `/admin`: Estúdio autenticado; capítulos, cenas, faixas, vozes, revisões e integrações.
- Os demais capítulos são negados por página e API. Mesmo um administrador não pode publicar outro número nesta edição.

A voz normal do navegador é o padrão, sem chave externa. Em **Preferências → Voz em português**, selecione outra voz instalada. A escolha fica salva. Vozes por personagem são opcionais e começam desativadas.

## Texto original

`app/lib/chapter3.ts` contém o texto integral fornecido pelo autor, incluindo repetições, grafia, pontuação e espaços. O leitor cria blocos de apresentação e frases por offsets; não substitui o original. Os testes verificam a reconstrução caractere por caractere. As 23 cenas iniciais foram mapeadas editorialmente com contexto do capítulo completo; são identificadas como direção editorial, não análise de uma API.

## Desenvolvimento local

Requer Node.js 22.13+.

```sh
npm ci
npm run dev
```

O perfil portátil inicia em `http://127.0.0.1:5173`. A autenticação de desenvolvimento usa `/signin-with-chatgpt?return_to=/admin` e o usuário de teste do starter. Essa simulação não entra no build de produção.

Gere e aplique o banco local conforme as instruções do starter: `npm run db:generate` ao alterar o esquema, compile e aplique as migrações novas em `drizzle/` usando Wrangler D1 local com `dist/server/wrangler.json`. Não reaplique migrações já aplicadas. A publicação Sites provisiona o D1 e aplica as migrações de produção.

```sh
npm run typecheck
npm test
npm run build
```

`node scripts/smoke.mjs` verifica a API contra a prévia local, incluindo autenticação, D1, revisões, conflitos, bloqueios e erros de configuração. Cria somente uma fixture local no capítulo 998; essa fixture nunca é publicada.

## Integrações opcionais

Configure valores apenas nos segredos do servidor Sites. Não cole chaves no frontend ou no Git.

| Variável | Finalidade |
| --- | --- |
| `ANTHROPIC_API_KEY` | Análise contextual do capítulo completo |
| `ANTHROPIC_MODEL` | Modelo da análise; padrão configurável no servidor |
| `YOUTUBE_API_KEY` | Títulos e durações da playlist via Data API v3 |
| `ADMIN_EMAILS` | Emails autorizados para o Estúdio, separados por vírgula |
| `ADMIN_MODE` | `owner-private`, exclusivamente na publicação Sites restrita ao dono |

A publicação inicial é privada. Antes de ampliar o público, configure `ADMIN_EMAILS` e remova `ADMIN_MODE=owner-private`. Cada operação administrativa verifica login e autorização no servidor; escritas também verificam a origem. Identidade e isolamento de progresso usam os cabeçalhos autenticados da plataforma.

## Trilha dinâmica

Fonte principal: https://www.youtube.com/watch?v=5Zzw4t-4mMM&list=PLl-vhnGPY7cp1AOHNXwHAuLxJ9e-66fO1

1. No Estúdio, carregue os metadados usando uma chave YouTube, ou adicione IDs de vídeo manualmente.
2. Ouça cada faixa no YouTube e selecione uma ou mais atmosferas.
3. Salve as faixas e, opcionalmente, defina músicas específicas e alternativas por cena.
4. No leitor, abra o player e ative o áudio por interação explícita.

O player permanece visível enquanto está aberto. Fechá-lo pausa e destrói o player. Não há download, extração nem redistribuição de áudio. Nenhuma categoria musical foi inventada: a faixa inicial fica sem classificação até a curadoria. O diretor mantém a música atual quando não há faixa classificada para a cena. Trocas usam fades e eventos reais da narração; não ocorrem enquanto pausada. Diálogos reduzem o volume. Não há crossfade simultâneo com dois vídeos, evitando duplicação de áudio.

## Sincronização e limites verificáveis

- Voz do navegador: eventos reais `boundary` e `end`; retomada por frase e caractere. Os botões ±10 s são explicitamente estimados porque Web Speech não oferece busca temporal exata.
- Atribuição local de falas: indicações e contexto próximo do texto; pode precisar revisão. Perfis e pronúncias podem ser editados. Não é apresentada como identificação infalível por IA.
- Análise contextual por API: botão real no Estúdio, sem alterar o texto. Sem credenciais, retorna erro de configuração e preserva o mapeamento editorial. Não foi executada com credenciais reais nesta entrega.
- Importações: TXT/Markdown preservam caracteres; DOCX/PDF extraem texto e exigem conferência antes de salvar. PDFs escaneados sem texto retornam aviso; OCR não está disponível.
- Progresso: armazenamento local a cada segundo e nas saídas; sincronização D1 por conta a cada cinco segundos. Revisões de texto possuem identificação para evitar retomar offsets incompatíveis.

## Módulos

- **StoryManager:** `app/lib/server.ts`, `app/lib/story.ts`, rotas de capítulo e API.
- **NarrationEngine:** `app/lib/narration.ts`, sessão única com cancelamento de eventos antigos.
- **EmotionAnalyzer:** análise contextual autenticada na API e mapeamento editorial em `story.ts`.
- **MusicDirector:** `app/lib/music.ts`, IFrame Player API, categorias, fades, ducking e alternativas.
- **ReadingSynchronizer:** `Reader.tsx`, offsets, destaque, posição, leitura manual e sincronização de progresso.
- **AdminDashboard:** editor, importação, linha do tempo, vozes, trilhas e revisões.

## Validação

17 testes automatizados de texto, cenas, publicação, pronúncia, controle de narração e transições musicais; 10 verificações de integração local da API. TypeScript e build de produção verificados. A disponibilidade de vídeos e o som final dependem do navegador, da região e das permissões de incorporação do YouTube.

## Alternativas gratuitas pesquisadas

- **Web Speech API**: já integrada. Sem chave nem cobrança por caracteres no aplicativo. Troque a voz em Preferências. Qualidade, disponibilidade e funcionamento offline dependem das vozes do navegador/dispositivo. https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- **Kokoro-82M / Misaki**: perfis brasileiros Dora, Alex e Santa baixados em `models/kokoro-pt-BR/`, incluídos no ZIP. Hashes SHA-256 conferidos. Misaki processa pronúncias; as vozes pertencem ao Kokoro. O motor e os pesos completos ainda são necessários; os perfis ainda não estão integrados ao player. Confira o LEIA-ME da pasta. https://huggingface.co/hexgrad/Kokoro-82M e https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- **Piper**: sintetizador neural local com vozes pt-BR. Requer instalação, modelos e conferência da licença de cada voz. Pesquisado, ainda não integrado. https://github.com/OHF-Voice/piper1-gpl e https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md

Os modelos locais não oferecem hospedagem gratuita automaticamente. A opção ativa continua sendo a voz do navegador; nenhum serviço pago de narração é chamado.
