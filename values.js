var Chess = {
	colorNames: [
		"White",
		"Black"],
		
	bgColors: [
		"#c0c0c0",
		"#404040"],
		
	pieceImages: [
		"wp.gif",
		"wr.gif",
		"wn.gif",
		"wb.gif",
		"wq.gif",
		"wk.gif",
		"bp.gif",
		"br.gif",
		"bn.gif",
		"bb.gif",
		"bq.gif",
		"bk.gif",
		"xx.gif"],
		
	pieces: {
		WhitePawn: 0,
		WhiteRook: 1,
		WhiteKnight: 2,
		WhiteBishop: 3,
		WhiteQueen: 4,
		WhiteKing: 5,
		BlackPawn: 6,
		BlackRook: 7,
		BlackKnight: 8,
		BlackBishop: 9,
		BlackQueen: 10,
		BlackKing: 11,
		None: 12},
	
	initialBoard: [
		 7,  8,  9, 10, 11,  9,  8,  7,
		 6,  6,  6,  6,  6,  6,  6,  6,
		12, 12, 12, 12, 12, 12, 12, 12,
		12, 12, 12, 12, 12, 12, 12, 12,
		12, 12, 12, 12, 12, 12, 12, 12,
		12, 12, 12, 12, 12, 12, 12, 12,
		 0,  0,  0,  0,  0,  0,  0,  0,
		 1,  2,  3,  4,  5,  3,  2,  1],
	
	dataKey: "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@",
	columns: "abcdefgh",

	board: new Array(64),
	moveList: "",
    captureList: [[],[]],
	kingHasMoved: new Array(2),
	leftRookHasMoved: new Array(2),
	rightRookHasMoved: new Array(2),
	display: new Array(64),
	lastClick: -1,
	currentTurn: 0,
	messageCount: 1};