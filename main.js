/// <reference lib="es2021" />
var _a, _b, _c, _d, _e, _f, _g;
var Tile = /** @class */ (function () {
    function Tile() {
        this.type = 'em';
        this.hasPlayer = false;
        this.powerup = '';
    }
    Tile.prototype.export = function () {
        return "".concat(this.type).concat(this.hasPlayer ? ';player' : '').concat(this.powerup !== '' ? ";".concat(this.powerup) : '');
    };
    return Tile;
}());
/*

code:

metadata:data|tiles:type;player~type~type^type~type~type etc

metadatas separated by |

tiles separated by ~

tile individual properties separated by ;

tile rows separated by ^

*/
var VERSION = 2;
var gridHolder = document.getElementById('grid-holder');
var gridWidthForm = document.getElementById('grid-width');
var gridHeightForm = document.getElementById('grid-height');
var dataOutput = document.getElementById('data-output');
var undoBtn = document.getElementById('undo-btn');
var redoBtn = document.getElementById('redo-btn');
var undoStack = []; // lol 
var undoPointer = 0;
var maxUndo = 21;
var width = 18;
var height = 12;
var buttonSize = 30;
var buttonMin = 20;
var buttonMax = 140;
var buttonIncrement = 10;
gridWidthForm.value = '' + width;
gridHeightForm.value = '' + height;
var tileBtnWrapper = document.getElementById('tile-btn-wrapper');
var toolBtnWrapper = document.getElementById('tool-btn-wrapper');
// EMPTY MUST BE FIRST!
var buttonTypes = ['em', 'bg', 'wa', 'dk', 'en-pl', 'en-pu'];
var buttonTypeNames = {
    'em': 'Empty',
    'bg': 'Background',
    'wa': 'Wall',
    'dk': 'Dark wall',
    'en-pl': 'Player spawn',
    'en-pu': 'Power up',
};
var toolTypes = ['pencil', 'box', 'flood'];
var startedBox = false;
var boxStart = [0, 0];
var tempBtnData = '';
for (var i = 0; i < buttonTypes.length; i++) {
    tempBtnData = tempBtnData + "<button id=\"tile-btn-".concat(i, "\">").concat(buttonTypeNames[buttonTypes[i]], "</button>");
}
if (tileBtnWrapper)
    tileBtnWrapper.innerHTML = tempBtnData;
tempBtnData = '';
toolTypes.forEach(function (btn, i) {
    tempBtnData = tempBtnData + "<button id=\"tool-btn-".concat(i, "\"").concat(i === toolTypes.length - 1 ? ' class="me-2"' : '', ">").concat(btn, "</button>");
});
tempBtnData += '<button id="clear-btn">Clear all</button>';
if (toolBtnWrapper)
    toolBtnWrapper.innerHTML = tempBtnData;
(_a = document.getElementById('clear-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    if (confirm('Are you sure you want to erase the level?')) {
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                grid[i][j] = new Tile();
            }
        }
        drawGrid();
    }
});
var selectedCol = 'lightgreen';
var selectedTileBtnIndex = 0;
var selectedToolBtnIndex = 0;
var firstTileBtn = document.getElementById("tile-btn-0");
if (firstTileBtn) {
    firstTileBtn.style.backgroundColor = selectedCol;
}
var _loop_1 = function (i) {
    (_b = document.getElementById("tile-btn-".concat(i))) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (ev) {
        if (selectedTileBtnIndex === i) {
            return;
        }
        var curSelectedBtn = document.getElementById("tile-btn-".concat(selectedTileBtnIndex));
        if (!curSelectedBtn) {
            return;
        }
        curSelectedBtn.style.backgroundColor = 'white';
        selectedTileBtnIndex = i;
        var newSelectedBtn = document.getElementById("tile-btn-".concat(selectedTileBtnIndex));
        if (!newSelectedBtn) {
            return;
        }
        newSelectedBtn.style.backgroundColor = selectedCol;
    });
};
for (var i = 0; i < buttonTypes.length; i++) {
    _loop_1(i);
}
var firstToolBtn = document.getElementById("tool-btn-0");
if (firstToolBtn) {
    firstToolBtn.style.backgroundColor = selectedCol;
}
var _loop_2 = function (i) {
    (_c = document.getElementById("tool-btn-".concat(i))) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (ev) {
        startedBox = false; // reset the box when switching
        if (selectedToolBtnIndex === i) {
            return;
        }
        var curSelectedBtn = document.getElementById("tool-btn-".concat(selectedToolBtnIndex));
        if (!curSelectedBtn) {
            return;
        }
        curSelectedBtn.style.backgroundColor = 'white';
        selectedToolBtnIndex = i;
        var newSelectedBtn = document.getElementById("tool-btn-".concat(selectedToolBtnIndex));
        if (!newSelectedBtn) {
            return;
        }
        newSelectedBtn.style.backgroundColor = selectedCol;
    });
};
for (var i = 0; i < toolTypes.length; i++) {
    _loop_2(i);
}
var grid = [];
var updateUndoButtons = function () {
    undoBtn.disabled = (undoPointer === undoStack.length - 1);
    redoBtn.disabled = (undoPointer === 0);
};
var addUndo = function (inputGrid) {
    // TODO add adjustment for if the grid size changes
    while (undoPointer > 0) {
        undoPointer--;
        undoStack.shift();
    }
    undoStack.unshift(structuredClone(inputGrid));
    if (undoStack.length > maxUndo) {
        undoStack.length = maxUndo;
    }
    updateUndoButtons();
};
var updateGridFromUndoStack = function () {
    grid = undoStack[undoPointer];
    updateUndoButtons();
    drawGrid();
};
var doUndo = function () {
    if (undoPointer < undoStack.length - 1) {
        undoPointer++;
        updateGridFromUndoStack();
    }
};
var doRedo = function () {
    if (undoPointer > 0) {
        undoPointer--;
        updateGridFromUndoStack();
    }
};
undoBtn.addEventListener('click', function (ev) {
    var _a;
    if ((_a = ev === null || ev === void 0 ? void 0 : ev.target) === null || _a === void 0 ? void 0 : _a.disabled) {
        return;
    }
    doUndo();
});
redoBtn.addEventListener('click', function (ev) {
    var _a;
    if ((_a = ev === null || ev === void 0 ? void 0 : ev.target) === null || _a === void 0 ? void 0 : _a.disabled) {
        return;
    }
    doRedo();
});
gridWidthForm === null || gridWidthForm === void 0 ? void 0 : gridWidthForm.addEventListener('change', function (ev) {
    var _a, _b;
    var newWidth = Number((_a = ev === null || ev === void 0 ? void 0 : ev.target) === null || _a === void 0 ? void 0 : _a.value);
    if (newWidth > width) {
        for (var i = width; i < newWidth; i++) {
            for (var j = 0; j < height; j++) {
                grid[j].push(new Tile());
            }
        }
    }
    else if (newWidth < width) {
        for (var i = 0; i < height; i++) {
            grid[i].length = newWidth;
        }
    }
    width = Number((_b = ev === null || ev === void 0 ? void 0 : ev.target) === null || _b === void 0 ? void 0 : _b.value);
    drawGrid();
});
gridHeightForm === null || gridHeightForm === void 0 ? void 0 : gridHeightForm.addEventListener('change', function (ev) {
    var _a, _b;
    var newHeight = Number((_a = ev === null || ev === void 0 ? void 0 : ev.target) === null || _a === void 0 ? void 0 : _a.value);
    if (newHeight > height) {
        for (var i = height; i < newHeight; i++) {
            grid.push([]);
            for (var j = 0; j < width; j++) {
                grid[i].push(new Tile());
            }
        }
    }
    else if (newHeight < height) {
        grid.length = newHeight;
    }
    height = Number((_b = ev === null || ev === void 0 ? void 0 : ev.target) === null || _b === void 0 ? void 0 : _b.value);
    drawGrid();
});
(_d = document.getElementById('plus-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('mousedown', function () {
    buttonSize += buttonIncrement;
    if (buttonSize > buttonMax) {
        buttonSize = buttonMax;
    }
    refreshButtons();
});
(_e = document.getElementById('minus-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('mousedown', function () {
    buttonSize -= buttonIncrement;
    if (buttonSize < buttonMin) {
        buttonSize = buttonMin;
    }
    refreshButtons();
});
var refreshButtons = function () {
    var btns = document.getElementsByClassName('grid-btn');
    for (var i = 0; i < btns.length; i++) {
        var btn = btns.item(i);
        if (!btn)
            continue;
        btn.style.width = "".concat(buttonSize, "px");
        btn.style.height = "".concat(buttonSize, "px");
    }
};
var drawGrid = function () {
    if (!gridHolder) {
        return;
    }
    var data = '<div class="container-fluid grid-box">';
    for (var y = 0; y < grid.length; y++) {
        var row = grid[y];
        data = data + '<div class="row grid-row m-0 p-0">';
        for (var x = 0; x < row.length; x++) {
            var tile = row[x];
            var innerData = '&nbsp;';
            if (tile.hasPlayer) {
                innerData = 'ply';
            }
            else if (tile.powerup !== '') {
                innerData = 'PU';
            }
            data = data + "<div class=\"col-auto m-0 p-0\"\">\n  <button class=\"grid-btn ".concat(tile.type, "\" id=\"").concat(y, ",").concat(x, "\">").concat(innerData, "</button>\n</div>");
        }
        data = data + '</div>';
    }
    data = data + '</div>';
    gridHolder.innerHTML = data;
};
// Export button
(_f = document.getElementById('export-btn')) === null || _f === void 0 ? void 0 : _f.addEventListener('mousedown', function () {
    var output = "size:".concat(width, ",").concat(height, "|ver:").concat(VERSION, "|tiles:");
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            output = output + grid[y][x].export() + (x === grid[y].length - 1 ? '' : '~');
        }
        if (y !== grid.length - 1) {
            output = output + '^';
        }
    }
    dataOutput.value = output;
});
// Import button
(_g = document.getElementById('import-btn')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function () {
    if (!confirm('Overwrite current level?')) {
        return;
    }
    var metadataSplit = dataOutput.value.split('|').map(function (e) { return e.split(':'); });
    var metadata = {};
    for (var _i = 0, metadataSplit_1 = metadataSplit; _i < metadataSplit_1.length; _i++) {
        var mdPart = metadataSplit_1[_i];
        metadata[mdPart[0]] = mdPart[1];
    }
    var dataVersion = Number(metadata['ver']);
    var rawLevelData = metadata['tiles'];
    while (dataVersion < VERSION) {
        console.log("Updating data from version ".concat(dataVersion, " to ").concat(dataVersion + 1, "..."));
        if (dataVersion === 1) {
            var replacements = [
                ['empty', 'em'],
                // ['bg', 'bg'], // not needed obv
                ['wall', 'wa'],
                ['dark', 'dk'],
                ['border-wall', 'em'],
                ['border-dark', 'em'],
                ['ent-player', 'en-pl'],
                ['ent-pickup', 'en-pu']
            ];
            for (var _a = 0, replacements_1 = replacements; _a < replacements_1.length; _a++) {
                var replace = replacements_1[_a];
                rawLevelData = rawLevelData.replaceAll(replace[0], replace[1]);
            }
        }
        dataVersion++;
    }
    // VERSION 2 PROCESS:
    var size = metadata['size'].split(',').map(function (e) { return Number(e); });
    width = size[0];
    height = size[1];
    gridWidthForm.value = '' + width;
    gridHeightForm.value = '' + height;
    grid.length = 0;
    var rows = rawLevelData.split('^');
    var rowI = 0;
    for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
        var row = rows_1[_b];
        grid.push([]);
        var tiles = row.split('~');
        var colI = 0;
        for (var _c = 0, tiles_1 = tiles; _c < tiles_1.length; _c++) {
            var tile = tiles_1[_c];
            var tileType = '';
            var hasPlayer = false;
            var powerup = '';
            var tileDatas = tile.split(';');
            for (var _d = 0, tileDatas_1 = tileDatas; _d < tileDatas_1.length; _d++) {
                var tileData = tileDatas_1[_d];
                if (tileData === 'PU') {
                    powerup = 'PU';
                }
                else if (tileData === 'player') {
                    hasPlayer = true;
                }
                else {
                    tileType = tileData;
                }
            }
            var newTile = new Tile();
            newTile.type = tileType;
            newTile.hasPlayer = hasPlayer;
            newTile.powerup = powerup;
            grid[rowI][colI] = newTile;
            colI++;
        }
        rowI++;
    }
    drawGrid();
    dataOutput.value = '';
});
// Init the grid
for (var y = 0; y < height; y++) {
    var row = [];
    for (var x = 0; x < width; x++) {
        row.push(new Tile());
    }
    grid.push(row);
}
undoStack.push(structuredClone(grid));
// Handle clicks on the grid
gridHolder === null || gridHolder === void 0 ? void 0 : gridHolder.addEventListener('mousedown', function (ev) {
    // Ignore clicks that aren't on grid buttons
    if (ev.target.nodeName !== 'BUTTON' || !ev.target.className.match(/grid-btn/)) {
        return;
    }
    var clicked = ev.target.id.split(',').map(function (el) { return Number(el); });
    var selectedTileBtnType = buttonTypes[selectedTileBtnIndex];
    var selectedToolBtnType = toolTypes[selectedToolBtnIndex];
    var isEnt = !!selectedTileBtnType.match(/^en-/);
    if (!isEnt) {
        switch (selectedToolBtnType) {
            case 'pencil':
                grid[clicked[0]][clicked[1]].type = selectedTileBtnType;
                ev.target.className = "grid-btn ".concat(selectedTileBtnType);
                break;
            case 'box':
                if (!startedBox) {
                    startedBox = true;
                    boxStart = clicked;
                    grid[clicked[0]][clicked[1]].type = selectedTileBtnType;
                    ev.target.className = "grid-btn ".concat(selectedTileBtnType);
                }
                else {
                    startedBox = false;
                    if (boxStart[0] === clicked[0] && boxStart[1] === clicked[1]) {
                        break; // start and end are the same, so don't bother drawing any
                    }
                    var lowCorner = [];
                    var highCorner = [];
                    if (boxStart[0] < clicked[0]) {
                        lowCorner[0] = boxStart[0];
                        highCorner[0] = clicked[0];
                    }
                    else {
                        lowCorner[0] = clicked[0];
                        highCorner[0] = boxStart[0];
                    }
                    if (boxStart[1] < clicked[1]) {
                        lowCorner[1] = boxStart[1];
                        highCorner[1] = clicked[1];
                    }
                    else {
                        lowCorner[1] = clicked[1];
                        highCorner[1] = boxStart[1];
                    }
                    for (var y = lowCorner[0]; y <= highCorner[0]; y++) {
                        for (var x = lowCorner[1]; x <= highCorner[1]; x++) {
                            grid[y][x].type = selectedTileBtnType;
                        }
                    }
                    // if (boxStart[0] !== clicked[0]) {
                    //   const lower = boxStart[0] < clicked[0] ? boxStart[0] : clicked[0];
                    //   const higher = boxStart[0] < clicked[0] ? clicked[0] : boxStart[0];
                    //   for (let i = lower; i <= higher; i++) {
                    //     grid[i][boxStart[1]].type = selectedTileBtnType;
                    //   }
                    // }
                    // else {
                    //   const lower = lineStart[1] < clicked[1] ? lineStart[1] : clicked[1];
                    //   const higher = lineStart[1] < clicked[1] ? clicked[1] : lineStart[1];
                    //   for (let i = lower; i <= higher; i++) {
                    //     grid[lineStart[0]][i].type = selectedTileBtnType;
                    //   }
                    // }
                    drawGrid();
                }
                break;
            case 'flood':
                var targetType_1 = grid[clicked[0]][clicked[1]].type;
                var checkedTiles_1 = [];
                var checkStack = [clicked];
                function shouldAddTile(pos) {
                    // See if tile is within bounds
                    if (pos[0] < 0 || pos[1] < 0 || pos[0] >= height || pos[1] >= width) {
                        return false;
                    }
                    // See if tile was already checked
                    for (var _i = 0, checkedTiles_2 = checkedTiles_1; _i < checkedTiles_2.length; _i++) {
                        var wasChecked = checkedTiles_2[_i];
                        if (wasChecked[0] === pos[0] && wasChecked[1] === pos[1]) {
                            return false;
                        }
                    }
                    // See if tile matches type
                    return grid[pos[0]][pos[1]].type === targetType_1;
                }
                var checkDirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
                while (checkStack.length > 0) {
                    var curCheck = checkStack.pop();
                    checkedTiles_1.push(curCheck);
                    for (var _i = 0, checkDirs_1 = checkDirs; _i < checkDirs_1.length; _i++) {
                        var dirs = checkDirs_1[_i];
                        var tilePosToCheck = [curCheck[0] + dirs[0], curCheck[1] + dirs[1]];
                        if (shouldAddTile(tilePosToCheck)) {
                            checkStack.push(tilePosToCheck);
                        }
                    }
                    grid[curCheck[0]][curCheck[1]].type = selectedTileBtnType;
                    // const checkedBtn = document.getElementById(`${curCheck[0]},${curCheck[1]}`);
                    // if (checkedBtn) 
                    //   checkedBtn.className = `grid-btn ${selectedTileBtnType}`;
                }
                drawGrid();
                break;
        }
    }
    else {
        if (selectedToolBtnType !== 'pencil') {
            alert('Can only place entities with the pencil tool.');
            return;
        }
        if (selectedTileBtnType === 'en-pl') {
            grid[clicked[0]][clicked[1]].hasPlayer = !grid[clicked[0]][clicked[1]].hasPlayer;
            ev.target.innerHTML = grid[clicked[0]][clicked[1]].hasPlayer ? 'ply' : '';
        }
        else if (selectedTileBtnType === 'en-pu') {
            if (grid[clicked[0]][clicked[1]].powerup) {
                grid[clicked[0]][clicked[1]].powerup = '';
            }
            else {
                grid[clicked[0]][clicked[1]].powerup = 'PU';
            }
            ev.target.innerHTML = grid[clicked[0]][clicked[1]].powerup;
        }
    }
    addUndo(grid);
});
drawGrid();
