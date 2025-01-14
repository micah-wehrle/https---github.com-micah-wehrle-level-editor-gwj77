/// <reference lib="es2021" />

class Tile {
  public type: string = 'em';
  public hasPlayer: boolean = false;
  public powerup: string = '';

  constructor() {}

  public export() {
    return `${this.type}${this.hasPlayer ? ';player' : ''}${this.powerup !== '' ? `;${this.powerup}` : ''}`;
  }
}


/*

code:

metadata:data|tiles:type;player~type~type^type~type~type etc

metadatas separated by |

tiles separated by ~

tile individual properties separated by ;

tile rows separated by ^

*/


const VERSION = 2;





const gridHolder = document.getElementById('grid-holder');
const gridWidthForm: HTMLInputElement = document.getElementById('grid-width') as HTMLInputElement;
const gridHeightForm: HTMLInputElement = document.getElementById('grid-height') as HTMLInputElement;
const dataOutput: HTMLInputElement = document.getElementById('data-output') as HTMLInputElement;

const undoBtn: HTMLButtonElement = document.getElementById('undo-btn') as HTMLButtonElement;
const redoBtn: HTMLButtonElement = document.getElementById('redo-btn') as HTMLButtonElement;
const undoStack: Tile[][][] = []; // lol 
let undoPointer = 0;
const maxUndo = 21;

let width = 18;
let height = 12;

let buttonSize = 30;
const buttonMin = 20;
const buttonMax = 140
const buttonIncrement = 10;

gridWidthForm.value = '' + width;
gridHeightForm.value = '' + height;


const tileBtnWrapper = document.getElementById('tile-btn-wrapper');
const toolBtnWrapper = document.getElementById('tool-btn-wrapper');

// EMPTY MUST BE FIRST!
const buttonTypes = ['em', 'bg', 'wa', 'dk', 'en-pl', 'en-pu'];
const buttonTypeNames: {[key: string]: string} = {
  'em': 'Empty',
  'bg': 'Background',
  'wa': 'Wall',
  'dk': 'Dark wall',
  'en-pl': 'Player spawn',
  'en-pu': 'Power up',
}
const toolTypes = ['pencil', 'box', 'flood'];
let startedBox = false;
let boxStart: [number, number] = [0,0];
let tempBtnData = '';
for (let i = 0; i < buttonTypes.length; i++) {
  tempBtnData = tempBtnData + `<button id="tile-btn-${i}">${buttonTypeNames[buttonTypes[i]]}</button>`;
}

if (tileBtnWrapper) 
  tileBtnWrapper.innerHTML = tempBtnData;

tempBtnData = '';
toolTypes.forEach( (btn, i) => {
  tempBtnData = tempBtnData + `<button id="tool-btn-${i}"${i === toolTypes.length - 1 ? ' class="me-2"' : ''}>${btn}</button>`;
});

tempBtnData += '<button id="clear-btn">Clear all</button>'

if (toolBtnWrapper) 
  toolBtnWrapper.innerHTML = tempBtnData;

document.getElementById('clear-btn')?.addEventListener('click', () => {
  if (confirm('Are you sure you want to erase the level?')) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = new Tile();
      }
    }
    drawGrid();
  }
})

const selectedCol = 'lightgreen';
let selectedTileBtnIndex = 0;
let selectedToolBtnIndex = 0;
const firstTileBtn = document.getElementById(`tile-btn-0`);
if (firstTileBtn) {
  firstTileBtn.style.backgroundColor = selectedCol;
}
for (let i = 0; i < buttonTypes.length; i++) {
  document.getElementById(`tile-btn-${i}`)?.addEventListener('click', (ev: any) => {
    if (selectedTileBtnIndex === i) { return; }
    const curSelectedBtn = document.getElementById(`tile-btn-${selectedTileBtnIndex}`);
    if (!curSelectedBtn) { return; }

    curSelectedBtn.style.backgroundColor = 'white';

    selectedTileBtnIndex = i;

    const newSelectedBtn = document.getElementById(`tile-btn-${selectedTileBtnIndex}`);
    if (!newSelectedBtn) { return; }

    newSelectedBtn.style.backgroundColor = selectedCol;
  })
}

const firstToolBtn = document.getElementById(`tool-btn-0`);
if (firstToolBtn) {
  firstToolBtn.style.backgroundColor = selectedCol;
}
for (let i = 0; i < toolTypes.length; i++) {
  document.getElementById(`tool-btn-${i}`)?.addEventListener('click', (ev: any) => {
    startedBox = false; // reset the box when switching
    if (selectedToolBtnIndex === i) { return; }
    const curSelectedBtn = document.getElementById(`tool-btn-${selectedToolBtnIndex}`);
    if (!curSelectedBtn) { return; }

    curSelectedBtn.style.backgroundColor = 'white';

    selectedToolBtnIndex = i;

    const newSelectedBtn = document.getElementById(`tool-btn-${selectedToolBtnIndex}`);
    if (!newSelectedBtn) { return; }

    newSelectedBtn.style.backgroundColor = selectedCol;
  })
}


let grid: Tile[][] = [];

const updateUndoButtons = () => {
  undoBtn.disabled = (undoPointer === undoStack.length - 1);
  redoBtn.disabled = (undoPointer === 0);
}
const addUndo = (inputGrid: Tile[][]) => {

  // TODO add adjustment for if the grid size changes
  while (undoPointer > 0) {
    undoPointer --;
    undoStack.shift();
  }
  undoStack.unshift(structuredClone(inputGrid));
  if (undoStack.length > maxUndo) {
    undoStack.length = maxUndo;
  }
  updateUndoButtons();
}
const updateGridFromUndoStack = () => {
  grid = undoStack[undoPointer];
  updateUndoButtons();
  drawGrid();
}
const doUndo = () => {
  if (undoPointer < undoStack.length - 1) {
    undoPointer++;
    updateGridFromUndoStack();
  }
}
const doRedo = () => {
  if (undoPointer > 0) {
    undoPointer--;
    updateGridFromUndoStack();
  }
}

undoBtn.addEventListener('click', (ev:any) => {
  if (ev?.target?.disabled) {
    return;
  }
  doUndo();
});

redoBtn.addEventListener('click', (ev:any) => {
  if (ev?.target?.disabled) {
    return;
  }

  doRedo();
});

gridWidthForm?.addEventListener('change', (ev: any) => {
  const newWidth = Number(ev?.target?.value);
  if (newWidth > width) {
    for (let i = width; i < newWidth; i++) {
      for (let j = 0; j < height; j++) {
        grid[j].push(new Tile());
      }
    }
  }
  else if (newWidth < width) {
    for (let i = 0; i < height; i++) {
      grid[i].length = newWidth;
    }
  }
  width = Number(ev?.target?.value);
  drawGrid();
  
});
gridHeightForm?.addEventListener('change', (ev: any) => {
  const newHeight = Number(ev?.target?.value);
  if (newHeight > height) {
    for (let i = height; i < newHeight; i++) {
      grid.push([]);
      for (let j = 0; j < width; j++) {
        grid[i].push(new Tile());
      }
    }
  }
  else if (newHeight < height) {
    grid.length = newHeight;
  }
  height = Number(ev?.target?.value);
  drawGrid();
});

document.getElementById('plus-btn')?.addEventListener('mousedown', () => {
  buttonSize += buttonIncrement;
  if (buttonSize > buttonMax) {
    buttonSize = buttonMax;
  }

  refreshButtons();
})

document.getElementById('minus-btn')?.addEventListener('mousedown', () => {
  buttonSize -= buttonIncrement;
  if (buttonSize < buttonMin) {
    buttonSize = buttonMin;
  }

  refreshButtons();
})

const refreshButtons = () => {
  const btns: HTMLCollectionOf<HTMLButtonElement> = document.getElementsByClassName('grid-btn') as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < btns.length; i++) {
    const btn = btns.item(i);
    if (!btn) continue;
    btn.style.width = `${buttonSize}px`;
    btn.style.height = `${buttonSize}px`;
  }
}

const drawGrid = () => {
  if (!gridHolder) {
    return;
  }

  let data = '<div class="container-fluid grid-box">';

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    data = data + '<div class="row grid-row m-0 p-0">'
    for (let x = 0; x < row.length; x++) {
      const tile = row[x];
      let innerData = '&nbsp;';

      if (tile.hasPlayer) {
        innerData = 'ply';
      }
      else if (tile.powerup !== '') {
        innerData = 'PU';
      }
      data = data + `<div class="col-auto m-0 p-0"">
  <button class="grid-btn ${tile.type}" id="${y},${x}">${innerData}</button>
</div>`
    } 
    data = data + '</div>';
  }
  data = data + '</div>'
  gridHolder.innerHTML = data;
  
}


// Export button
document.getElementById('export-btn')?.addEventListener('mousedown', () => {
  let output = `size:${width},${height}|ver:${VERSION}|tiles:`;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      output = output + grid[y][x].export() + (x === grid[y].length - 1 ? '' : '~');
    }
    if (y !== grid.length - 1) {
      output = output + '^';
    }
  }
  dataOutput.value = output;
});

// Import button
document.getElementById('import-btn')?.addEventListener('click', () => {
  if (!confirm('Overwrite current level?')) {
    return;
  }

  const metadataSplit = dataOutput.value.split('|').map(e => e.split(':'));
  const metadata: {[key: string]: string}= {};
  for (let mdPart of metadataSplit) {
    metadata[mdPart[0]] = mdPart[1];
  }
  let dataVersion = Number(metadata['ver']);
  let rawLevelData = metadata['tiles'];

  while (dataVersion < VERSION) {
    console.log(`Updating data from version ${dataVersion} to ${dataVersion + 1}...`);

    if (dataVersion === 1) {
      const replacements = [
        ['empty', 'em'],
        // ['bg', 'bg'], // not needed obv
        ['wall', 'wa'],
        ['dark', 'dk'],
        ['border-wall', 'em'],
        ['border-dark', 'em'],
        ['ent-player', 'en-pl'],
        ['ent-pickup', 'en-pu'] 
      ];
      for (let replace of replacements) {
        rawLevelData = rawLevelData.replaceAll(replace[0], replace[1]);
      }
    }

    dataVersion++;
  }

  // VERSION 2 PROCESS:
  const size = metadata['size'].split(',').map(e => Number(e));
  width = size[0];
  height = size[1];

  gridWidthForm.value = '' + width;
  gridHeightForm.value = '' + height;

  grid.length = 0;

  const rows = rawLevelData.split('^');
  let rowI = 0;
  for (let row of rows) {
    grid.push([]);
    const tiles = row.split('~');
    let colI = 0;
    for (let tile of tiles) {
      let tileType = '';
      let hasPlayer = false;
      let powerup = '';
      const tileDatas = tile.split(';');
      for (let tileData of tileDatas) {
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

      const newTile = new Tile();
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
for (let y = 0; y < height; y++) {
  const row: Tile[] = [];
  for (let x = 0; x < width; x++) {
    row.push(new Tile())
  }
  grid.push(row);
}
undoStack.push(structuredClone(grid));

// Handle clicks on the grid
gridHolder?.addEventListener('mousedown', (ev: any) => {
  // Ignore clicks that aren't on grid buttons
  if (ev.target.nodeName !== 'BUTTON' || !ev.target.className.match(/grid-btn/)) {
    return;
  }
  const clicked = ev.target.id.split(',').map((el: string) => Number(el));

  const selectedTileBtnType = buttonTypes[selectedTileBtnIndex];
  const selectedToolBtnType = toolTypes[selectedToolBtnIndex];
  const isEnt = !!selectedTileBtnType.match(/^en-/);
  if (!isEnt) {

    switch (selectedToolBtnType) {
      case 'pencil':
        grid[clicked[0]][clicked[1]].type = selectedTileBtnType;
        ev.target.className = `grid-btn ${selectedTileBtnType}`;
        break;
      case 'box':
        if (!startedBox) {
          startedBox = true;
          boxStart = clicked;
          grid[clicked[0]][clicked[1]].type = selectedTileBtnType;
          ev.target.className = `grid-btn ${selectedTileBtnType}`;
        }
        else {
          startedBox = false;

          if (boxStart[0] === clicked[0] && boxStart[1] === clicked[1]) {
            break; // start and end are the same, so don't bother drawing any
          }

          const lowCorner = [];
          const highCorner = [];
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

          for (let y = lowCorner[0]; y <= highCorner[0]; y++) {
            for (let x = lowCorner[1]; x <= highCorner[1]; x++) {
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
        const targetType = grid[clicked[0]][clicked[1]].type;
        const checkedTiles: number[][] = [];
        const checkStack = [ clicked ];

        function shouldAddTile(pos: [number, number]) {
          // See if tile is within bounds
          if (pos[0] < 0 || pos[1] < 0 || pos[0] >= height || pos[1] >= width) {
            return false;
          }
          // See if tile was already checked
          for (let wasChecked of checkedTiles) {
            if (wasChecked[0] === pos[0] && wasChecked[1] === pos[1]) {
              return false;
            }
          }
          // See if tile matches type
          return grid[pos[0]][pos[1]].type === targetType;
        }

        const checkDirs = [ [-1, 0], [0, 1], [1, 0], [0, -1]];

        while (checkStack.length > 0) {
          const curCheck = checkStack.pop();
          checkedTiles.push(curCheck);
          
          for (let dirs of checkDirs) {
            const tilePosToCheck: [number, number] = [curCheck[0] + dirs[0], curCheck[1] + dirs[1]];
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

})

drawGrid();