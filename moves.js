// en passant is not supported
// promotion is not supported
// check is not recognized


Chess.executeMove = function(indexBegin, indexEnd) {
    var piece = Chess.board[indexBegin];
    var color = Math.floor(piece / 6);
    var x1 = indexBegin % 8;
    var x2 = indexEnd % 8;
    var y1 = Math.floor(indexBegin / 8);
    var y2 = Math.floor(indexEnd / 8);
    var dx = x2 - x1;
    var dy = y2 - y1;
    Chess.board[indexEnd] = Chess.board[indexBegin];
    Chess.board[indexBegin] = Chess.pieces.None;
    switch (piece) {
        case Chess.pieces.WhiteRook: case Chess.pieces.BlackRook:
            if (x1 == 0)
                Chess.leftRookHasMoved[color] = true;
            else if (x1 == 7)
                Chess.rightRookHasMoved[color] = true;
            break;
        case Chess.pieces.WhiteKing: case Chess.pieces.BlackKing:
            if (Chess.isValidCastling(dx, dy, color)) {
                //move the correct rook
                var rookIndex;
                if (dx < 0)
                    rookIndex = indexBegin - 4;
                else
                    rookIndex = indexBegin + 3;
                var castleIndex = indexBegin + dx / Math.abs(dx);
                Chess.board[castleIndex] = Chess.board[rookIndex];
                Chess.board[rookIndex] = Chess.pieces.None;
            }
            Chess.kingHasMoved[color] = true;
            break;
    }

    Chess.moveList += Chess.dataKey[indexBegin] + "" + Chess.dataKey[indexEnd];
    Chess.changeTurn();
}

Chess.isValidPawnMove = function(dx, color, dy, direction, y1, indexBegin, colorEnd) {
    if (colorEnd == 2) // empty target square
    {
        var firstRank = (color == 0) ? 6 : 1;
        if (dx == 0 // no moving horizontally on a non-capture
			&& (dy == direction * 1 //moving one space forward
        //or first-move double-step
				|| (y1 == firstRank //pawns 5th rank
			 		&& dy == direction * 2 //moving two spaces forward
			 		&& Chess.board[indexBegin + direction * 8] == Chess.pieces.None))) //and the intermediate square is also empty
            return true;
    }
    else if (dy == direction * 1 //moving one space forward
		&& Math.abs(dx) == 1) //moving one space horizontally
        return true; // we have previously checked against self-capture
    return false;
};

Chess.isValidRookMove = function(dx, dy, indexBegin, indexEnd) {
    var d = 0;
    if (dx == 0 && dy != 0)	//vertical
        d = 8 * dy / Math.abs(dy);
    else if (dx != 0 && dy == 0)	//horizontal
        d = dx / Math.abs(dx);
    else
        return false;

    return Chess.isPathClear(d, indexBegin, indexEnd);

};
Chess.isPathClear = function(d, indexBegin, indexEnd) {
    for (var i = indexBegin + d; i != indexEnd; i += d)
        if (Chess.board[i] != Chess.pieces.None)
        return false;
    return true;
}
Chess.isValidKnightMove = function(dx, dy) {
    //verify the L shape, everything else is already checked.
    dx = Math.abs(dx);
    dy = Math.abs(dy);
    return dx * dy == 2;
};

Chess.isValidBishopMove = function(dx, dy, indexBegin, indexEnd) {
    if (Math.abs(dx) != Math.abs(dy))
        return false;
    var d = dx / Math.abs(dx) + (8 * dy / Math.abs(dy));
    return Chess.isPathClear(d, indexBegin, indexEnd);
};

Chess.isValidQueenMove = function(dx, dy, indexBegin, indexEnd) {
    return Chess.isValidRookMove(dx, dy, indexBegin, indexEnd)
		|| Chess.isValidBishopMove(dx, dy, indexBegin, indexEnd);
};

Chess.isValidKingMove = function(dx, dy, indexBegin, indexEnd, color) {
    return (Math.abs(dx) < 2
			&& Math.abs(dy) < 2
			&& Chess.isValidQueenMove(dx, dy, indexBegin, indexEnd))
		|| Chess.isValidCastling(dx, dy, color);
};

Chess.isValidCastling = function(dx, dy, color) {
    return dy == 0
		&& Math.abs(dx) == 2
		&& !Chess.kingHasMoved[color]
		&& ((dx == -2 && !Chess.leftRookHasMoved[color])
			|| (dx == 2 && !Chess.rightRookHasMoved[color]));
};
Chess.isValidMove = function(indexBegin, indexEnd) {
    //prevent no move
    if (indexBegin == indexEnd)
        return false;

    var piece = Chess.board[indexBegin];
    var color = Math.floor(piece / 6);
    //prevent out-of-turn play
    if (color != Chess.currentTurn)
        return false;

    var colorEnd = Math.floor(Chess.board[indexEnd] / 6);
    //prevent self capturing
    if (color == colorEnd)
        return false;

    var x1 = indexBegin % 8;
    var x2 = indexEnd % 8;
    var y1 = Math.floor(indexBegin / 8);
    var y2 = Math.floor(indexEnd / 8);
    var dx = x2 - x1;
    var dy = y2 - y1;
    switch (piece) {
        case Chess.pieces.WhitePawn:
            return Chess.isValidPawnMove(dx, color, dy, -1, y1, indexBegin, colorEnd);
            break;
        case Chess.pieces.BlackPawn:
            return Chess.isValidPawnMove(dx, color, dy, +1, y1, indexBegin, colorEnd);
            break;
        case Chess.pieces.WhiteRook: case Chess.pieces.BlackRook:
            return Chess.isValidRookMove(dx, dy, indexBegin, indexEnd);
            break;
        case Chess.pieces.WhiteKnight: case Chess.pieces.BlackKnight:
            return Chess.isValidKnightMove(dx, dy);
            break;
        case Chess.pieces.WhiteBishop: case Chess.pieces.BlackBishop:
            return Chess.isValidBishopMove(dx, dy, indexBegin, indexEnd);
            break;
        case Chess.pieces.WhiteQueen: case Chess.pieces.BlackQueen:
            return Chess.isValidQueenMove(dx, dy, indexBegin, indexEnd);
            break;
        case Chess.pieces.WhiteKing: case Chess.pieces.BlackKing:
            return Chess.isValidKingMove(dx, dy, indexBegin, indexEnd, color);
            break;
    }
    return false;
};