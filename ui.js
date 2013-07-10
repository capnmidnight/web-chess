Chess.showBoard = function() {
    for (var i = 0; i < 64; ++i)
        Chess.display[i].src = "Chess/" + Chess.pieceImages[Chess.board[i]];
    Chess.turnStatus.innerText = Chess.colorNames[Chess.currentTurn] + "'s turn";
    Chess.moveListDisplay.innerHTML = "<br/>";
    for (var i = 0; i < Chess.moveList.length; i += 2) {
        var indexBegin = Chess.dataKey.indexOf(Chess.moveList[i]);
        var indexEnd = Chess.dataKey.indexOf(Chess.moveList[i + 1]);
        var x1 = indexBegin % 8;
        var x2 = indexEnd % 8;
        var y1 = Math.floor(indexBegin / 8);
        var y2 = Math.floor(indexEnd / 8);
        var phase = Math.floor(i / 4) + 1;
        var turn = "AB"[(i / 2) % 2];
        Chess.moveListDisplay.innerHTML += phase + turn + ": " + Chess.columns[x1] + y1 + "->" + Chess.columns[x2] + y2 + "<br/>";
    }
    if (Chess.moveList.length > 0)
        Chess.moveListDisplay.innerHTML += "<a href=\"javascript:Chess.undoMove()\">undo</a>";
};
Chess.undoMove = function() {
    Chess.lastClick = -1;
    var temp = Chess.moveList.substring(0, Chess.moveList.length - 2);
    Chess.playMoveList(temp);
    Chess.showBoard();
}
Chess.playMoveList = function(moveList) {
    Chess.initializeBoard();
    for (var i = 0; i < moveList.length; i += 2) {
        var indexBegin = Chess.dataKey.indexOf(moveList[i]);
        var indexEnd = Chess.dataKey.indexOf(moveList[i + 1]);
        Chess.executeMove(indexBegin, indexEnd);
    }
}
Chess.changeTurn = function() {
    Chess.currentTurn = (Chess.currentTurn + 1) % 2;
}
Chess.clickAction = function() {
    if (Chess.lastClick == -1) {
        if (Chess.board[this.cellIndex] != Chess.pieces.None) {
            Chess.lastClick = this.cellIndex;
            Chess.display[this.cellIndex].parent.bgColor = "yellow";
        }
    }
    else if (Chess.lastClick != this.cellIndex) {
        if (Chess.isValidMove(Chess.lastClick, this.cellIndex)) {
            Chess.executeMove(Chess.lastClick, this.cellIndex);
            Chess.showBoard();
        }
        Chess.display[Chess.lastClick].parent.bgColor =
			Chess.bgColors[(Chess.lastClick + Math.floor(Chess.lastClick / 8)) % 2];
        Chess.lastClick = -1;
    }
    else {
        Chess.lastClick = -1;
    }
};

Chess.debug = function(msg) {
    if (Chess.output.children.length == 0) Chess.messageCount = 1;
    var span = document.createElement("span");
    span.style.color = "red";
    span.innerHTML = Chess.messageCount + ":> " + msg + "<br/>";
    Chess.messageCount++;
    Chess.output.appendChild(span);
    setTimeout("Chess.output.removeChild(Chess.output.children[0])", 3000);
};

Chess.addCoordRow = function(table) {
    table.appendChild(JSL.Row(null, function(row) {
        row.appendChild(JSL.Cell(null, null));
        for (var x = 0; x < 8; ++x)
            row.appendChild(JSL.Cell({
                innerHTML: Chess.columns[x],
                align: "center"
            },
		        	null));
    }));
};
Chess.initializeBoard = function() {
    Chess.moveList = "";
    Chess.currentTurn = 0;
    Chess.captureList = [[],[]],
	Chess.kingHasMoved[0] = Chess.kingHasMoved[1] = false;
	Chess.leftRookHasMoved[0] = Chess.leftRookHasMoved[1] = false;
	Chess.rightRookHasMoved[0] = Chess.rightRookHasMoved[1] = false;
	Chess.display = new Array(64),
	Chess.lastClick = -1,
	Chess.messageCount = 1
    for (var i = 0; i < Chess.board.length; ++i)
        Chess.board[i] = Chess.initialBoard[i];
};

Chess.makeUI = function() {
    JSR.contentTarget.appendChild(JSL.Table(null, function(main) {
        Chess.initializeBoard();
        main.appendChild(JSL.Row(null, function(columns) {
            columns.appendChild(JSL.Cell(null, function(tableWrapper) {
                tableWrapper.style.border = "double 3px black";

                tableWrapper.appendChild(JSL.Table({
                    border: 0,
                    cellSpacing: 0,
                    cellPadding: 0
                },
		            function(table) {
		                table.appendChild(JSL.Row(
		                	null,
		                	function(header) {
		                	    header.appendChild(JSL.Cell({
		                	        colSpan: 9,
		                	        align: "center",
		                	        innerText: "JS Chess 2.0"
		                	    }, null));
		                	}));

		                Chess.addCoordRow(table);

		                for (var y = 0; y < 8; ++y) {
		                    table.appendChild(JSL.Row(null, function(row) {
		                        row.appendChild(JSL.Cell({
		                            innerHTML: "&nbsp;&nbsp;" + y + "&nbsp;&nbsp;",
		                            vAlign: "middle"
		                        }, null));

		                        for (var x = 0; x < 8; ++x) {
		                            var index = y * 8 + x;

		                            row.appendChild(JSL.Cell({
		                                bgColor: Chess.bgColors[(x + y) % 2],
		                                width: 30,
		                                height: 30,
		                                align: "center",
		                                vAlign: "bottom"
		                            },
									function(cell) {
									    Chess.display[index] = JSL.Img({
									        parent: cell,
									        cellIndex: index,
									        onclick: Chess.clickAction
									    }, null);
									    cell.appendChild(Chess.display[index]);
									}));
		                        }
		                        row.appendChild(JSL.Cell(
		                    	{ innerHTML: "&nbsp;&nbsp;" + y + "&nbsp;&nbsp;",
		                    	    vAlign: "middle"
		                    	},
			                    null));
		                    }));
		                }

		                Chess.addCoordRow(table);

		                table.appendChild(JSL.Row(
	                	null,
	                	function(row) {
	                	    Chess.output = JSL.Cell({ colSpan: 9, innerHTML: "&nbsp;" }, null);
	                	    row.appendChild(Chess.output);
	                	}));
		            }));
            }));

            columns.appendChild(JSL.Cell(
	        	{ vAlign: "top" },
	        	function(info) {
	        	    Chess.turnStatus = JSL.makeElement("div");
	        	    info.appendChild(Chess.turnStatus);
	        	}));

            columns.appendChild(JSL.Cell(
	        	{ vAlign: "top" },
	        	function(column) {
	        	    Chess.moveListDisplay = JSL.makeElement("div");
	        	    column.appendChild(Chess.moveListDisplay);
	        	}));
        }));
    }));
}