Crie um jogo completo de Yutnori (윷놀이) utilizando:

Vue 3
TypeScript
Bun
Vite
Sem backend
Persistência local via localStorage (preferencialmente) ou IndexedDB se necessário
UI moderna, limpa, agradável e responsiva
Arquitetura organizada e extensível para multiplayer/backend futuro

O projeto deve parecer um jogo real e polido, não apenas um protótipo técnico.

Objetivo

Implementar uma versão jogável de Yutnori no navegador com suporte para:

1 a 4 jogadores
Possibilidade de definir quantas peças cada jogador tem antes do início do jogo
Jogador humano inicialmente
Estrutura preparada para IA simples e multiplayer futuro
Regras tradicionais coreanas do Yutnori
Persistência automática de estado
Experiência intuitiva mesmo para quem nunca jogou
Stack obrigatória
Vue 3
TypeScript strict mode
Bun
Vite
Composition API
Sem Vuex/Pinia inicialmente (usar composables/store leve)
CSS moderno (pode usar Tailwind se fizer sentido)
Nenhum backend
Requisitos de arquitetura

Organize o projeto com separação clara:

src/
  components/
  composables/
  engine/
  models/
  stores/
  utils/
  views/

A lógica principal do jogo NÃO deve ficar nos componentes Vue.

Toda regra do jogo deve ficar em uma engine desacoplada da UI.

A UI deve apenas refletir o estado da engine.

Regras do jogo (IMPORTANTÍSSIMO)

Implemente as regras reais do Yutnori.

Resultado dos bastões

O jogo usa 4 bastões virtuais.

Resultados possíveis:

Resultado	Movimento
Do (도)	1
Gae (개)	2
Geol (걸)	3
Yut (윷)	4 + turno extra
Mo (모)	5 + turno extra

Implementar probabilidades realistas baseadas em bastões.

NÃO usar dado tradicional.

Tabuleiro

Implementar:

Caminho externo tradicional
Caminhos diagonais/atalhos
Centro compartilhado
Nós de interseção corretos
Movimento baseado em nós conectados

O tabuleiro NÃO deve ser tratado como array linear simples.

Criar um sistema de grafo/nodes para permitir:

atalhos
cruzamentos
múltiplos caminhos
expansibilidade futura
Peças

Cada jogador possui múltiplas peças.

Implementar:

movimentação individual
pilha de peças aliadas
captura de peças inimigas
retorno ao início após captura
Regras de pilha

Peças aliadas podem ocupar mesma posição.

Quando agrupadas:

movem juntas
compartilham movimento
podem ser capturadas juntas
Captura

Ao cair em peça inimiga:

captura imediatamente
inimigo volta ao início
jogador ganha turno extra
Vitória

Vence quem levar todas as peças até o final primeiro.

Fluxo de turno

Implementar:

Jogador lança bastões
Resultado é exibido visualmente
Jogador escolhe qual peça mover
Engine valida movimento
Estado atualiza
Verificar:
captura
turno extra
vitória
UI/UX

A interface deve ser:

clean
moderna
agradável
minimalista
inspirada em jogos mobile modernos
responsiva
funcional em desktop e mobile

Evitar aparência “enterprise dashboard”.

Elementos visuais importantes

Implementar:

animação dos bastões
feedback visual de captura
destaque de movimentos válidos
indicação clara do jogador atual
histórico de jogadas
animações suaves
transições leves
Estado do jogo

Persistir automaticamente:

jogadores
tabuleiro
turno atual
histórico
peças
progresso da partida

Usar:

localStorage
IndexedDB apenas se necessário

O usuário deve conseguir:

atualizar página
fechar navegador
continuar partida
Modelagem

Criar tipos fortes para:

Player
Piece
BoardNode
Move
ThrowResult
GameState
TurnState

Evitar any.

Engine

Criar engine desacoplada contendo:

geração de jogadas
cálculo de caminhos
regras
captura
pilha
vitória
turnos
validações

A engine deve ser facilmente reutilizável em:

multiplayer futuro
backend futuro
IA futura
Multiplayer futuro (IMPORTANTE)

Mesmo sem backend agora, estruturar pensando em:

sincronização futura
websocket futuro
multiplayer online
replay de partidas
espectador

Evitar acoplamento forte com browser/UI.

IA futura

Estruturar para permitir:

bots simples
heurísticas
IA estratégica futuramente
Qualidade do código

Quero:

código limpo
nomes claros
comentários apenas onde necessário
baixa complexidade
componentes reutilizáveis
sem overengineering exagerado
Entregáveis esperados

Claude deve gerar:

estrutura completa do projeto
arquivos principais
engine funcional
UI funcional
persistência
README
instruções Bun
scripts de execução
Scripts esperados
bun install
bun run dev
bun run build
Extras desejáveis (se houver tempo)
efeitos sonoros leves
tema claro/escuro
replay local
seed reproduzível
modo debug da engine
testes unitários da engine
NÃO FAZER
Não usar backend
Não usar Firebase
Não usar Supabase
Não usar dependências pesadas desnecessárias
Não colocar lógica do jogo dentro de componentes Vue
Não simplificar regras tradicionais do Yutnori
Prioridade máxima
Engine correta
Regras corretas
Arquitetura limpa
UX agradável
Persistência local
Visual bonito

O objetivo é parecer um jogo indie moderno de verdade.
