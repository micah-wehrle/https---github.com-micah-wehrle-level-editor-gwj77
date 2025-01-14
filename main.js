var _a, _b, _c, _d;
var Tile = /** @class */ (function () {
    function Tile() {
        this.type = 'empty';
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
var VERSION = '1';
var gridHolder = document.getElementById('grid-holder');
var gridWidthForm = document.getElementById('grid-width');
var gridHeightForm = document.getElementById('grid-height');
var dataOutput = document.getElementById('data-output');
var width = 10;
var height = 7;
var buttonSize = 30;
var buttonMin = 20;
var buttonMax = 140;
var buttonIncrement = 10;
gridWidthForm.value = '' + width;
gridHeightForm.value = '' + height;
var btnWrapper = document.getElementById('tile-btn-wrapper');
// EMPTY MUSTY BE FIRST
var buttonTypes = ['empty', 'bg', 'wall', 'dark', 'border-wall', 'border-dark', 'ent-player', 'ent-pickup'];
var tempBtnData = '';
buttonTypes.forEach(function (btn, i) {
    tempBtnData = tempBtnData + "<button id=\"tile-btn-".concat(i, "\">").concat(btn, "</button>");
});
if (btnWrapper)
    btnWrapper.innerHTML = tempBtnData;
var selectedCol = 'lightgreen';
var selectedBtnIndex = 0;
var firstBtn = document.getElementById("tile-btn-0");
if (firstBtn) {
    firstBtn.style.backgroundColor = selectedCol;
}
var _loop_1 = function (i) {
    (_a = document.getElementById("tile-btn-".concat(i))) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (ev) {
        if (selectedBtnIndex === i) {
            return;
        }
        var curSelectedBtn = document.getElementById("tile-btn-".concat(selectedBtnIndex));
        if (!curSelectedBtn) {
            return;
        }
        curSelectedBtn.style.backgroundColor = 'white';
        selectedBtnIndex = i;
        var newSelectedBtn = document.getElementById("tile-btn-".concat(selectedBtnIndex));
        if (!newSelectedBtn) {
            return;
        }
        newSelectedBtn.style.backgroundColor = selectedCol;
    });
};
for (var i = 0; i < buttonTypes.length; i++) {
    _loop_1(i);
}
var grid = [];
gridWidthForm === null || gridWidthForm === void 0 ? void 0 : gridWidthForm.addEventListener('change', function (ev) {
    var _a;
    width = Number((_a = ev === null || ev === void 0 ? void 0 : ev.target) === null || _a === void 0 ? void 0 : _a.value);
    updateGrid();
});
gridHeightForm === null || gridHeightForm === void 0 ? void 0 : gridHeightForm.addEventListener('change', function (ev) {
    var _a;
    height = Number((_a = ev === null || ev === void 0 ? void 0 : ev.target) === null || _a === void 0 ? void 0 : _a.value);
    updateGrid();
});
(_b = document.getElementById('plus-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('mousedown', function () {
    buttonSize += buttonIncrement;
    if (buttonSize > buttonMax) {
        buttonSize = buttonMax;
    }
    refreshButtons();
});
(_c = document.getElementById('minus-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('mousedown', function () {
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
var updateGrid = function () {
    if (!gridHolder) {
        return;
    }
    var data = '<div class="container-fluid grid-box">';
    for (var y = 0; y < grid.length; y++) {
        var row = grid[y];
        data = data + '<div class="row grid-row m-0 p-0">';
        for (var x = 0; x < row.length; x++) {
            var tile = row[x];
            data = data + "<div class=\"col-auto m-0 p-0\"\">\n  <button class=\"grid-btn ".concat(buttonTypes[0], "\" id=\"").concat(y, ",").concat(x, "\">&nbsp;</button>\n</div>");
        }
        data = data + '</div>';
    }
    data = data + '</div>';
    gridHolder.innerHTML = data;
};
(_d = document.getElementById('export-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('mousedown', function () {
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
// Init the grid
for (var y = 0; y < height; y++) {
    var row = [];
    for (var x = 0; x < width; x++) {
        row.push(new Tile());
    }
    grid.push(row);
}
gridHolder === null || gridHolder === void 0 ? void 0 : gridHolder.addEventListener('mousedown', function (ev) {
    var clicked = ev.target.id.split(',').map(function (el) { return Number(el); });
    var selectedBtnType = buttonTypes[selectedBtnIndex];
    var isEnt = !!selectedBtnType.match(/^ent-/);
    if (!isEnt) {
        grid[clicked[0]][clicked[1]].type = selectedBtnType;
        ev.target.className = "grid-btn ".concat(selectedBtnType);
    }
    else {
        if (selectedBtnType === 'ent-player') {
            grid[clicked[0]][clicked[1]].hasPlayer = !grid[clicked[0]][clicked[1]].hasPlayer;
            ev.target.innerHTML = grid[clicked[0]][clicked[1]].hasPlayer ? 'ply' : '';
        }
        else if (selectedBtnType === 'ent-pickup') {
            if (grid[clicked[0]][clicked[1]].powerup) {
                grid[clicked[0]][clicked[1]].powerup = '';
            }
            else {
                grid[clicked[0]][clicked[1]].powerup = 'PU';
            }
            ev.target.innerHTML = grid[clicked[0]][clicked[1]].powerup;
        }
    }
});
updateGrid();
