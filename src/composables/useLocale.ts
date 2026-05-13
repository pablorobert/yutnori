import { ref, computed } from 'vue'

export type Locale = 'pt' | 'ko'

const STORAGE_KEY = 'yutnori_locale'

const locale = ref<Locale>(
  (localStorage.getItem(STORAGE_KEY) as Locale) ?? 'pt'
)

const strings = {
  pt: {
    // Home
    subtitle:        'Yutnori · Jogo de Tabuleiro Coreano Tradicional',
    newGame:         'Novo Jogo',
    continueGame:    'Continuar Partida',
    howToPlay:       'Como Jogar',
    rule1Title:      'Lance os Bastões',
    rule1Body:       'Jogue 4 bastões de yut. Cada um tem um lado plano (claro) e um arredondado (escuro).',
    rule2Title:      'Mova as Peças',
    rule2Body:       'Do=1, Gae=2, Geol=3, Yut=4, Mo=5. Yut e Mo dão uma jogada extra!',
    rule3Title:      'Capturas',
    rule3Body:       'Caia sobre uma peça inimiga para mandá-la de volta ao início. Você ganha mais uma jogada!',
    rule4Title:      'Vitória',
    rule4Body:       'O primeiro jogador a levar todas as peças ao redor do tabuleiro e de volta ao início vence!',
    // Setup
    setupTitle:      'Configurar Partida',
    back:            '← Voltar',
    players:         'Jogadores',
    piecesPerPlayer: 'Peças por Jogador',
    playerNames:     'Nomes dos Jogadores',
    startGame:       'Iniciar Partida',
    playerDefault:   'Jogador',
    // Game
    turnThrow:       'lance os bastões!',
    turnSelect:      'escolha uma peça',
    turnOf:          'Vez de',
    turnOfSuffix:    '',
    throwBtn:        '🎋 Lançar Bastões',
    newPiece:        '🏠 Nova peça',
    confirmPiece:    '🏠 Confirmar',
    extraTurn:       '+turno',
    step:            'casa',
    steps:           'casas',
    undo:            '↩ Voltar',
    restart:         'Reiniciar',
    menu:            'Menu',
    won:             'venceu!',
    playAgain:       'Jogar Novamente',
    // Log
    logTitle:        'Histórico',
    logCapture:      'captura!',
    logNoMoves:      'sem movimentos',
    // Player panel
    turnBadge:       'VEZ',
    stateHome:       'início',
    stateBoard:      'jogo',
    stateFinished:   'fim',
  },
  ko: {
    // Home
    subtitle:        '윷놀이 · 전통 한국 보드게임',
    newGame:         '새 게임',
    continueGame:    '계속하기',
    howToPlay:       '게임 방법',
    rule1Title:      '윷을 던지세요',
    rule1Body:       '윷가락 4개를 던집니다. 각각 평평한 면(밝은색)과 둥근 면(어두운색)이 있습니다.',
    rule2Title:      '말을 이동하세요',
    rule2Body:       '도=1, 개=2, 걸=3, 윷=4, 모=5. 윷과 모는 한 번 더 던집니다!',
    rule3Title:      '잡기',
    rule3Body:       '상대 말 위에 올라가면 상대 말이 출발점으로 돌아갑니다. 한 번 더 던집니다!',
    rule4Title:      '승리',
    rule4Body:       '자신의 말을 모두 보드 한 바퀴 돌려 출발점으로 먼저 보낸 플레이어가 승리합니다!',
    // Setup
    setupTitle:      '게임 설정',
    back:            '← 돌아가기',
    players:         '플레이어 수',
    piecesPerPlayer: '말 수',
    playerNames:     '플레이어 이름',
    startGame:       '게임 시작',
    playerDefault:   '플레이어',
    // Game
    turnThrow:       '윷을 던지세요!',
    turnSelect:      '말을 선택하세요',
    turnOf:          '',
    turnOfSuffix:    '의 차례',
    extraTurn:       '+턴',
    throwBtn:        '🎋 윷 던지기',
    newPiece:        '🏠 새 말',
    confirmPiece:    '🏠 확인',
    step:            '칸',
    steps:           '칸',
    undo:            '↩ 되돌리기',
    restart:         '다시 시작',
    menu:            '메뉴',
    won:             '승리!',
    playAgain:       '다시 하기',
    // Log
    logTitle:        '기록',
    logCapture:      '잡기!',
    logNoMoves:      '이동 없음',
    // Player panel
    turnBadge:       '차례',
    stateHome:       '대기',
    stateBoard:      '진행',
    stateFinished:   '완료',
  },
} as const

export function useLocale() {
  function setLocale(l: Locale) {
    locale.value = l
    localStorage.setItem(STORAGE_KEY, l)
  }

  function t(key: keyof typeof strings.pt): string {
    const dict = strings[locale.value] as Record<string, string>
    return dict[key] ?? (strings.pt as Record<string, string>)[key] ?? key
  }

  const isKo = computed(() => locale.value === 'ko')

  return { locale, setLocale, t, isKo }
}
