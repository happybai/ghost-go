letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
letters_sgf = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's']
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].reverse()

class Sgf
  constructor: (options = {}) ->
    @datetime = options.datetime ? new Date()
    @bname = options.bname ? "Black"
    @wname = options.wname ? "White"
    @brank = options.brank ? "18k"
    @wrank = options.wrank ? "18k"
    @size = options.size ? 19
    @komi = options.komi ? 6.5
    @rule = options.rule ? "japanese"
    @result = options.result ? ""
    @content = []
    @content.push "(;FF[4]\n"
    @content.push "GM[1]\n"
    @content.push "DT[#{@datetime}]\n"
    @content.push "PB[#{@bname}]\n"
    @content.push "PW[#{@wname}]\n"
    @content.push "BR[#{@brank}]\n"
    @content.push "WR[#{@wrank}]\n"
    @content.push "CP[ghost-go.com]\n"
    @content.push "RE[#{@result}]\n"
    @content.push "SZ[#{@size}]\n"
    @content.push "KM[#{@komi}]\n"
    @content.push "RU[#{@rule}]\n"


  add: (txt) ->
    @content.push "#{txt}\n"

  output: ->
    d = new Date()
    pattern = 'yyyy-mm-dd'
    filename = "#{d.formattedDate(pattern)}-#{@bname}-vs-#{@wname}.sgf"
    element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(@content.join('')))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

Piece = (x, y, size, type) ->
  this.x = x || 0
  this.y = y || 0
  this.size = size || 1
  this.type = type || 'B'

Piece.prototype.draw = (ctx) ->
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, true)
  ctx.lineWidth = 1
  if this.type == 'B'
    ctx.fillStyle = '#000000'
  else
    ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.stroke()
  return

Board = (grid, size) ->
  this.grid = grid || 19
  this.size = size || 25

Board.prototype.draw = (ctx) ->
  ctx.beginPath()
  for i in [1..this.grid]
    ctx.moveTo(i * this.size, this.size)
    ctx.lineTo(i * this.size, this.grid * this.size)
    ctx.moveTo(this.size, i * this.size)
    ctx.lineTo(this.grid * this.size, i * this.size)
  ctx.stroke()
  dot_size = 3
  if this.grid == 19
    for i in [4, 16, 10]
      for j in [4, 16, 10]
        ctx.beginPath()
        ctx.arc(this.size * i, this.size * j, dot_size, 0, 2 * Math.PI, true)
        ctx.fill()
  return

Cross = (x, y, size, color) ->
  this.x = x || 0
  this.y = y || 0
  this.size = size || 5
  this.color = color || "#000000"

Cross.prototype.draw = (ctx) ->
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.moveTo(this.x - this.size, this.y - this.size)
  ctx.lineTo(this.x + this.size, this.y + this.size)
  ctx.moveTo(this.x - this.size, this.y + this.size)
  ctx.lineTo(this.x + this.size, this.y - this.size)
  ctx.stroke()

<%#---------------------------------------------------%>

size = 30
step = 0
manual = []
$(window).resize ->
  if $(window).height() > 500
    size = $(window).height() / 20
    board_ctx.clearRect(0, 0, board_layer.width, board_layer.height)
    board.size = size
    board.draw(board_ctx)
    piece_ctx.clearRect(0, 0, piece_layer.width, board_layer.height)
    for coord, i in manual
      if i % 2 == 1
        move(piece_ctx, coord, 'W')
      else
        move(piece_ctx, coord, 'B')

Date.prototype.formattedDate = (pattern) ->
  formattedDate = pattern.replace('yyyy', this.getFullYear().toString())
  mm = (this.getMonth() + 1).toString()
  mm = '0' + mm if mm.length == 1
  formattedDate = formattedDate.replace('mm', mm)
  dd = this.getDate().toString()
  dd = '0' + dd if dd.length == 1
  formattedDate = formattedDate.replace('dd', dd)
  return formattedDate

convert_pos_to_coord = (x, y, size) ->
  letter = letters[Math.round((x - size) / size)]
  number = numbers[Math.round((y - size) / size)]
  return "#{letter}#{number}"

convert_pos_to_sgf_coord = (x, y, size) ->
  letter = letters_sgf[Math.round((x - size) / size)]
  number = letters_sgf[Math.round((y - size) / size)]
  return "#{letter}#{number}"


convert_coord_to_pos = (coord, size) ->
  letter = coord.charAt(0)
  number = coord.slice(1)
  i = letters.indexOf(letter) + 1
  j = numbers.indexOf(parseInt(number)) + 1
  results = []
  results[0] = i * size
  results[1] = j * size
  return results

move = (ctx, coord, type) ->
  results = convert_coord_to_pos(coord, size)
  Piece piece = new Piece()
  piece.x = results[0]
  piece.y = results[1]
  piece.size = size / 2 - 3
  piece.type = type
  piece.draw(ctx)

show_cross = (ctx, coord, color) ->
  results = convert_coord_to_pos(coord, size)
  Cross cross = new Cross()
  cross.x = results[0]
  cross.y = results[1]
  cross.size = 5
  cross.color = color
  cross.draw(ctx)

board_layer = document.getElementById("board")
board_layer.width = size * 20
board_layer.height = size * 20
board_ctx = board_layer.getContext('2d')

Board board = new Board()
board.size = size
board.draw(board_ctx)

piece_layer = document.getElementById('piece')
piece_layer.width = size * 20
piece_layer.height = size * 20
piece_ctx = piece_layer.getContext('2d')

cross_layer = document.getElementById('cross')
cross_layer.width = size * 20
cross_layer.height = size * 20
cross_ctx = cross_layer.getContext('2d')

top_layer = document.getElementById('top')
top_layer.width = size * 20
top_layer.height = size * 20

Sgf sgf = new Sgf({
  bname: "我是天才",
  wname: "我不是天才"
})

$('#top').click (e) ->
  coord = convert_pos_to_coord(e.offsetX, e.offsetY, size)
  coord_sgf = convert_pos_to_sgf_coord(e.offsetX, e.offsetY, size)
  step++
  manual.push coord
  if step % 2 == 0
    $('#turn').html('白')
    sgf.add ";W[#{coord_sgf}]"
    move(piece_ctx , coord, 'W')
  else
    sgf.add ";B[#{coord_sgf}]"
    $('#turn').html('黑')
    move(piece_ctx , coord, 'B')

$('#top').mousemove (e) ->
  coord = convert_pos_to_coord(e.offsetX, e.offsetY, size)
  $('#coord').html(coord)
  cross_ctx.clearRect(0, 0, cross_layer.width, cross_layer.height)
  show_cross(cross_ctx, coord, '#ff0000')



