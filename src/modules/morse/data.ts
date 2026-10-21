export const MORSE: Readonly<Record<string, string>> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
}

/** Word → response frequency (MHz), sorted by frequency as in the manual. */
export const MORSE_WORDS: readonly { word: string; mhz: string }[] = [
  { word: 'shell', mhz: '3.505' },
  { word: 'halls', mhz: '3.515' },
  { word: 'slick', mhz: '3.522' },
  { word: 'trick', mhz: '3.532' },
  { word: 'boxes', mhz: '3.535' },
  { word: 'leaks', mhz: '3.542' },
  { word: 'strobe', mhz: '3.545' },
  { word: 'bistro', mhz: '3.552' },
  { word: 'flick', mhz: '3.555' },
  { word: 'bombs', mhz: '3.565' },
  { word: 'break', mhz: '3.572' },
  { word: 'brick', mhz: '3.575' },
  { word: 'steak', mhz: '3.582' },
  { word: 'sting', mhz: '3.592' },
  { word: 'vector', mhz: '3.595' },
  { word: 'beats', mhz: '3.600' },
]
