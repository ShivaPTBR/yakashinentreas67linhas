# Vozes brasileiras — Kokoro / Misaki

Arquivos oficiais baixados do modelo `hexgrad/Kokoro-82M`:

| Arquivo | Voz | Idioma |
| --- | --- | --- |
| `pf_dora.pt` | Dora, feminina | Português brasileiro |
| `pm_alex.pt` | Alex, masculina | Português brasileiro |
| `pm_santa.pt` | Santa, masculina | Português brasileiro |

Alex é a sugestão inicial para o narrador. As outras duas vozes foram incluídas para permitir a troca posteriormente.

**Misaki é o mecanismo de pronúncia, não o nome de uma voz.** Ele converte texto em fonemas para o Kokoro. As vozes brasileiras correspondem ao idioma `p` e à pronúncia `pt-br` do espeak-ng.

Este pacote contém os perfis de voz, os documentos oficiais e a licença Apache-2.0. Os três arquivos binários foram conferidos por tamanho e SHA-256 contra os metadados oficiais. A revisão e os hashes completos estão em `manifest.json`.

Os arquivos `.pt` não são gravações MP3 e não funcionam sozinhos. Para sintetizar áudio, ainda são necessários o motor Kokoro, os pesos do modelo Kokoro-82M e as dependências de pronúncia. Esses componentes não foram instalados nem incluídos neste download. O player do site continua usando a voz do navegador; as vozes baixadas ainda não foram integradas ao player.

Fontes:

- https://github.com/hexgrad/misaki
- https://huggingface.co/hexgrad/Kokoro-82M
- https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md

Nenhuma API paga ou chave é necessária para baixar estes perfis. O uso local do motor exige instalação e recursos do computador.
