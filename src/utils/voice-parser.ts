const dictionary: { [x: string]: string } = {
  'app': 'f', // Replace 'app' with 'f' for file
  "see": "c",
  "sea": "c",
  "seas": "c",
  "head": "h",
  "heck": "h",
  "tech": "takes",
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "sick": "6",
}

export function translateSpokenMove(spokenText: string): string {

  let move = spokenText.toLocaleLowerCase().trim();

  for (const key in dictionary) {
    if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
      const value = dictionary[key];
      move = move.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
    }
  }

  let tokens = move.split(' ').filter(Boolean);

  // Replace 'app' with 'f' for file
  tokens = tokens.map(token => token === 'app' ? 'f' : token);

  // Remove trailing words that are not part of the move
  const trailingWords = [
    'check', 'equals', 'queen', 'promote', 'to', 'mate', 'with', 'by', 'pawn', 'rook', 'bishop', 'knight', 'king', 'castle', 'castles', 'takes', 'capture', 'captures', 'and', 'then', 'plus', 'equals queen', 'equals rook', 'equals bishop', 'equals knight', 'equals king', 'equals pawn',
  ];
  while (tokens.length > 0 && trailingWords.includes(tokens[tokens.length - 1])) {
    tokens.pop();
  }

  // Only consider the last 5 tokens for safety
  tokens = tokens.slice(-5);

  // Special handling for castling
  const joined = tokens.join(' ');
  if (
    tokens.length === 1 && (tokens[0] === 'castle' || tokens[0] === 'castles')
  ) {
    return 'O-O'; // Default to kingside
  }
  if (
    joined.includes('queen') || joined.includes('queenside') || joined.includes('long')
  ) {
    return 'O-O-O';
  }
  if (
    joined.includes('king') || joined.includes('kingside') || joined.includes('short')
  ) {
    return 'O-O';
  }
  if (joined === 'castle queenside' || joined === 'castles queenside') return 'O-O-O';
  if (joined === 'castle kingside' || joined === 'castles kingside') return 'O-O';

  // Parse from right to left
  let square = '';
  let piece = '';
  let isCapture = false;
  let pawnFile = '';

  const pieceMap: { [key: string]: string } = {
    bishop: 'B',
    rook: 'R',
    queen: 'Q',
    king: 'K',
    knight: 'N',
    nai: 'N',
    '9': 'N',
    n: 'N',
    nice: 'N',
    night: 'N',
    nite: 'N',
    knite: 'N',
    knit: 'N',
  };

  const captureWords = ['take', 'takes', 'capture', 'captures', 'x'];
  const squareRegex = /^[a-h][1-8]$/;
  const fileRegex = /^[a-h]$/;

  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    if (!square && squareRegex.test(token)) {
      square = token;
      continue;
    }
    if (!piece && token in pieceMap) {
      piece = pieceMap[token];
      continue;
    }
    if (!isCapture && captureWords.includes(token)) {
      isCapture = true;
      // Check for pawn file before capture word
      if (i > 0 && fileRegex.test(tokens[i - 1])) {
        pawnFile = tokens[i - 1];
      }
      continue;
    }
  }

  // If no square found, fallback to join tokens
  if (!square) return tokens.join('');

  // If no piece, it's a pawn move
  let result = '';
  if (piece) {
    result += piece;
  } else if (pawnFile && isCapture) {
    result += pawnFile;
  }
  if (isCapture) {
    result += 'x';
  }
  result += square;
  return result;
} 