import _ from 'lodash'

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
export const LETTERS_SGF = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's']
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].reverse()
export const BLANK_ARRAY =  _.chunk(new Array(361).fill(0), 19)
export const GRID = 19
export const DOT_SIZE = 3
export const EXPAND_H = 5
export const EXPAND_V = 5
export const RESPONSE_TIME = 400

export const SGFToPosition = (str) => {
  const ki = str[0] === 'B' ? 1 : -1
  const pos = /\[(.*)\]/.exec(str)[1]
  const x = LETTERS_SGF.indexOf(pos[0])
  const y = LETTERS_SGF.indexOf(pos[1])
  return {x, y, ki}
}
