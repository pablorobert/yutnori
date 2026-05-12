# 윷놀이 · Yutnori

> **Korean traditional board game — playable in the browser, no backend, no install.**

![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883?style=flat-square&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.x-fbf0df?style=flat-square&logo=bun&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)

---

## O que é isso?

Yutnori (윷놀이) é um jogo de tabuleiro coreano jogado há séculos, especialmente no Ano Novo Lunar. Quatro bastões semi-cilíndricos são lançados — o resultado determina quantas casas cada peça avança. Quem tirar todas as peças do tabuleiro primeiro vence.

Esta é uma implementação completa rodando 100% no browser, com persistência automática via `localStorage` e interface em Português do Brasil.

---

## Regras em 30 segundos

| Lance | Bastões planos | Casas | Bônus |
|-------|---------------|-------|-------|
| **도 Do** | 1 | 1 | — |
| **개 Gae** | 2 | 2 | — |
| **걸 Geol** | 3 | 3 | — |
| **윷 Yut** | 4 | 4 | +turno extra |
| **모 Mo** | 0 | 5 | +turno extra |

- **Captura**: cair na casa de um adversário manda ele de volta ao início e dá turno extra
- **Stack**: peças do mesmo time na mesma casa andam juntas
- **Atalhos**: cantos NE e NW têm diagonais que encurtam o percurso
- **Vitória**: todas as peças completam o circuito

---

## Features

- 🎋 **Bastões animados** — semi-cilíndricos, lado plano claro / lado redondo escuro
- 🗺️ **SVG board responsivo** — mantém 100 vh sem scroll
- 👥 **2–4 jogadores** com 2–5 peças cada
- ↩️ **Undo** — volte até 10 jogadas atrás
- 💾 **Auto-save** — fecha o browser e continua de onde parou
- ✨ **Animações** de captura, stack e movimentação
- 🏆 **Banner de vitória** com opção de revanche

---

## Stack

```
Vue 3 (Composition API + <script setup>)
TypeScript strict
Bun + Vite
Vue Router (hash history)
CSS custom properties (sem framework de UI)
```

A engine de jogo é completamente desacoplada da UI — `src/engine/` não importa nada de Vue.

---

## Estrutura

```
src/
├── engine/
│   ├── board.ts       # grafo do tabuleiro, rotas, atalhos
│   ├── throw.ts       # simulação dos bastões
│   ├── movement.ts    # cálculo e execução de movimentos
│   ├── rules.ts       # vitória, turno extra, captura
│   └── game.ts        # ciclo de vida da partida
├── stores/
│   └── gameStore.ts   # estado reativo + undo stack
├── components/
│   ├── GameBoard.vue  # SVG board + interação
│   ├── YutSticks.vue  # bastões animados
│   ├── PlayerPanel.vue
│   ├── GameLog.vue
│   └── GameSetup.vue
├── views/
│   ├── HomeView.vue
│   └── GameView.vue
├── models/
│   └── types.ts       # interfaces TypeScript
└── utils/
    └── storage.ts     # localStorage
```

---

## Rodar localmente

```bash
# instalar dependências
bun install

# dev server
bun run dev

# build de produção
bun run build
```

Requer [Bun](https://bun.sh) ≥ 1.0. Também funciona com `npm` / `pnpm` trocando os comandos.

---

## Como jogar

1. Escolha número de jogadores e peças
2. Clique **Lançar Bastões** no turno de cada jogador
3. Selecione uma peça no tabuleiro (ou **Nova peça** pra entrar com uma nova)
4. Clique no destino destacado — ou no **START** pra finalizar uma peça
5. Yut ou Mo = lance de novo. Captura = lance de novo

---

## Licença

MIT — faça o que quiser, mas lembre de trazer makgeolli na próxima partida 🍶
