class Tile {
  public type: string = 'empty';
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


const VERSION = '1';





const gridHolder = document.getElementById('grid-holder');
const gridWidthForm: HTMLInputElement = document.getElementById('grid-width') as HTMLInputElement;
const gridHeightForm: HTMLInputElement = document.getElementById('grid-height') as HTMLInputElement;
const dataOutput: HTMLInputElement = document.getElementById('data-output') as HTMLInputElement;

let width = 10;
let height = 7;

let buttonSize = 30;
const buttonMin = 20;
const buttonMax = 140
const buttonIncrement = 10;

gridWidthForm.value = '' + width;
gridHeightForm.value = '' + height;


const btnWrapper = document.getElementById('tile-btn-wrapper');

// EMPTY MUSTY BE FIRST
const buttonTypes = ['empty', 'bg', 'wall', 'dark', 'border-wall', 'border-dark', 'ent-player', 'ent-pickup'];
let tempBtnData = '';
buttonTypes.forEach( (btn, i) => {
  tempBtnData = tempBtnData + `<button id="tile-btn-${i}">${btn}</button>`;
})

if (btnWrapper) 
  btnWrapper.innerHTML = tempBtnData;

const selectedCol = 'lightgreen';
let selectedBtnIndex = 0;
const firstBtn = document.getElementById(`tile-btn-0`);
if (firstBtn) {
  firstBtn.style.backgroundColor = selectedCol;
}
for (let i = 0; i < buttonTypes.length; i++) {
  document.getElementById(`tile-btn-${i}`)?.addEventListener('click', (ev: any) => {
    if (selectedBtnIndex === i) { return; }
    const curSelectedBtn = document.getElementById(`tile-btn-${selectedBtnIndex}`);
    if (!curSelectedBtn) { return; }

    curSelectedBtn.style.backgroundColor = 'white';

    selectedBtnIndex = i;

    const newSelectedBtn = document.getElementById(`tile-btn-${selectedBtnIndex}`);
    if (!newSelectedBtn) { return; }

    newSelectedBtn.style.backgroundColor = selectedCol;
  })
}


const grid: Tile[][] = [];

gridWidthForm?.addEventListener('change', (ev: any) => {
  width = Number(ev?.target?.value);
  updateGrid();
  
});
gridHeightForm?.addEventListener('change', (ev: any) => {
  height = Number(ev?.target?.value);
  updateGrid();
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

const updateGrid = () => {
  if (!gridHolder) {
    return;
  }

  let data = '<div class="container-fluid grid-box">';

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    data = data + '<div class="row grid-row m-0 p-0">'
    for (let x = 0; x < row.length; x++) {
      const tile = row[x];
      data = data + `<div class="col-auto m-0 p-0"">
  <button class="grid-btn ${buttonTypes[0]}" id="${y},${x}">&nbsp;</button>
</div>`
    } 
    data = data + '</div>';
  }
  data = data + '</div>'
  gridHolder.innerHTML = data;
  
}


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


// Init the grid
for (let y = 0; y < height; y++) {
  const row: Tile[] = [];
  for (let x = 0; x < width; x++) {
    row.push(new Tile())
  }
  grid.push(row);
}

gridHolder?.addEventListener('mousedown', (ev: any) => {
  const clicked = ev.target.id.split(',').map((el: string) => Number(el));

  const selectedBtnType = buttonTypes[selectedBtnIndex];
  const isEnt = !!selectedBtnType.match(/^ent-/);
  if (!isEnt) {
    grid[clicked[0]][clicked[1]].type = selectedBtnType;
    ev.target.className = `grid-btn ${selectedBtnType}`;
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

})

updateGrid();