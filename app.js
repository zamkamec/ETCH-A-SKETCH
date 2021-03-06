let tool = "brush";
let bgColor = document.getElementById("bgcolor").value;
let color = document.getElementById("favcolor");
let collumnValue = document.getElementById("collumnValue");
let rowValue = document.getElementById("rowValue");
let values = [collumnValue, rowValue];
let collumn;
let row;
let pixel;
let gridContainer = document.getElementById("grid-container");
let firstPoint = null;
let secondPoint = null;
let grid = true;

function gridButtonPressed(buttonName) {
    let gridButtons = document.getElementById("sizeButtons").children;
    for (let i = 0; i < gridButtons.length; i++) {
        gridButtons[i].classList.remove("gridButtonPressed");
        
    }
    document.getElementById(buttonName).classList.add("gridButtonPressed");
}

function createWindow(show) {
    let newWindow = document.getElementById("sizePrompt");
    let toolBox = document.getElementById("toolBox");
    let toolBoxR = document.getElementById("toolBoxR");
    if(show){
        newWindow.style.display = "flex";
        toolBox.style.display = "none";
        toolBoxR.style.display = "none";
        gridContainer.style.backgroundColor = "transparent";
        gridContainer.style.backgroundImage = "none";
    }else{
        newWindow.style.display = "none";
        toolBox.style.display = "flex";
        toolBoxR.style.display = "flex";
        if (gridContainer.children.length > 0) {
            gridContainer.style.backgroundColor = bgColor;
            gridContainer.style.backgroundImage = "none";
        }else{
            gridContainer.style.backgroundImage = "url(Assets/nogrid.png)";
        }
        
    }
}

function buildGrid() {
    deletePixels();
    collumn = document.getElementById("collumnValue").value;
    row = document.getElementById("rowValue").value;
    console.log("Created " + row + "x" + collumn +" grid");
    createWindow(false);
    gridContainer.style.gridTemplateColumns = "repeat(" + collumn + ", " + "0.5fr)";
    gridContainer.style.gridTemplateRows = "repeat(" + row + ", " + "0.5fr)";

    if (collumn > row) {
        gridContainer.style.height = "750px";
        gridContainer.style.width = "500px";
    }else if (collumn < row){
        gridContainer.style.height = "500px";
        gridContainer.style.width = "750px"; 
    }else {
        gridContainer.style.height = "500px";
        gridContainer.style.width = "500px";
    }

    for (let i = 0; i < (row*collumn); i++) {
        pixel = document.createElement("DIV");
        pixel.setAttribute("class", "pixel");
        pixel.setAttribute("draggable", "false");
        pixel.addEventListener("mousedown", function(){
                if (tool === 'brush'){
                    brush(event);
                }else if (tool === 'eraser'){
                    eraser(event);
                }else if (tool === 'eyedropper') {
                    eyedroper(event);
                }else if (tool === 'bucket'){                    
                    bucket(event);
                }else if (tool === 'rectangle'){
                    rectangle(event);
            };
        });
        pixel.addEventListener("mouseenter", function(){
            if (event.buttons > 0) {
                if (tool === 'brush'){
                    brush(event);
                }else if (tool === 'eraser'){
                    eraser(event);
                };                  
            }
        });
        gridContainer.appendChild(pixel);
        createWindow(false);
    }
}

function brush(e) {
    e.target.style.backgroundColor = color.value;
}

function eraser(e) {
    e.target.style.backgroundColor = "transparent"; 
}

function eyedroper(e) {
    console.log("Color sampled");
    color.value = rgbToHex(e.target.style.backgroundColor);
    console.log("new color is " + color.value);
    sellectTool('brush');       
}

function bucket(e) {
    let startIndex = (Array.prototype.indexOf.call(gridContainer.children, e.target));
    let indexColor = e.target.style.backgroundColor;
    if (rgbToHex(indexColor) === color.value) {
        return;
    }
    let targetSquares = [];
    let setSquares = new Set([startIndex]);
    targetSquares.push(startIndex);
    while (targetSquares.length) {
        let selectedSquare = targetSquares.shift();

    if (gridContainer.childNodes[selectedSquare].style.backgroundColor === indexColor){
        gridContainer.childNodes[selectedSquare].style.backgroundColor = color.value;
    }                  
    if((selectedSquare + 1) <= ((row*collumn) - 1) && ((selectedSquare + 1) % +collumn !== 0) && setSquares.has((selectedSquare + 1)) === false){
        if(gridContainer.childNodes[(selectedSquare + 1)].style.backgroundColor === indexColor) {
            targetSquares.push((selectedSquare + 1));
            setSquares.add((selectedSquare + 1));
        }
    }
    if((selectedSquare - 1) >= 0  && ((selectedSquare) % +collumn !== 0) && setSquares.has((selectedSquare - 1)) === false){
        if(gridContainer.childNodes[(selectedSquare - 1)].style.backgroundColor === indexColor) {
            targetSquares.push((selectedSquare - 1));
            setSquares.add((selectedSquare - 1));
        }
    }
    if((+selectedSquare + +collumn) <= ((row*collumn)- 1) && setSquares.has((selectedSquare + +collumn)) === false){
        if(gridContainer.childNodes[(selectedSquare + +collumn)].style.backgroundColor === indexColor) {
            targetSquares.push((+selectedSquare + +collumn));
            setSquares.add((selectedSquare + +collumn));
        }
    }
    if((selectedSquare - collumn) >= 0 && setSquares.has((selectedSquare - collumn)) === false){
        if(gridContainer.childNodes[(selectedSquare - collumn)].style.backgroundColor === indexColor) {
            targetSquares.push((selectedSquare - collumn));
            setSquares.add((selectedSquare - collumn));
        }
    }
}
}

function rectangle(e) {
    if(e.buttons > 0 && firstPoint === null){
        firstPoint = (Array.prototype.indexOf.call(gridContainer.children, e.target));
    }else{
        secondPoint = (Array.prototype.indexOf.call(gridContainer.children, e.target));               
    }

    if (firstPoint !== null && secondPoint !== null) {
        if(firstPoint > secondPoint){
            [firstPoint, secondPoint] = [secondPoint, firstPoint];
        }
          if(secondPoint < (firstPoint + (collumn * ((Math.floor(secondPoint / +collumn) +1) - (Math.floor(firstPoint / +collumn) +1))))){
                 [secondPoint, firstPoint] = [(firstPoint + (collumn * ((Math.floor(secondPoint / +collumn) +1) - (Math.floor(firstPoint / +collumn) +1)))), (secondPoint - (collumn * ((Math.floor(secondPoint / +collumn) +1) - (Math.floor(firstPoint / +collumn) +1))))];
        }
        let recHeight = (Math.floor((secondPoint - firstPoint) / collumn) )+ 1;
        let recWidth = ((secondPoint - ((recHeight - 1)*collumn)) - firstPoint) + 1;
            for (let i = 0; i < recHeight; i++) {
                let targetPoint = firstPoint + (collumn * i);
                gridContainer.childNodes[targetPoint].style.backgroundColor = color.value;
                targetPoint = secondPoint - (collumn * i);
                gridContainer.childNodes[targetPoint].style.backgroundColor = color.value;
            }
            for (let i = 0; i < recWidth; i++) {
                let targetPoint = firstPoint + i;
                gridContainer.childNodes[targetPoint].style.backgroundColor = color.value;
                targetPoint = secondPoint - i;
                gridContainer.childNodes[targetPoint].style.backgroundColor = color.value;
                
            }
        firstPoint = null;
        secondPoint = null;
}
}

function sizing(collumnValue, rowValue) {
    document.getElementById("collumnValue").value = collumnValue;
    document.getElementById("rowValue").value = rowValue;
}

function defaultColor() {
    document.getElementById("bgcolor").value = "#FFFFFF";
    color.value = "#000000";
    document.getElementById("grid-container").style.backgroundColor = document.getElementById("bgcolor").value; 

}

function reverseColor() {
    [color.value, document.getElementById("bgcolor").value] = [document.getElementById("bgcolor").value, color.value];
    document.getElementById("grid-container").style.backgroundColor = document.getElementById("bgcolor").value;    
}

function gridShow() {
    grid = !grid;
    if(grid){
        for (let i = 0; i < document.getElementsByClassName("pixel").length; i++) {
        document.getElementsByClassName("pixel")[i].style.border = ".01px solid #000000" ;    
        }
    }else{
        for (let i = 0; i < document.getElementsByClassName("pixel").length; i++) {
        document.getElementsByClassName("pixel")[i].style.border = "none" ;    
        }
    }
}

document.getElementById("bgcolor").addEventListener('change', (event) => {
    document.getElementById("grid-container").style.backgroundColor = document.getElementById("bgcolor").value;
})

function clearPixels() {
    confirm("Are you sure ?");
    for (let i = 0; i < gridContainer.children.length; i++) {
        gridContainer.children[i].style.backgroundColor = "transparent";
    }
}

function newFile() {
    createWindow(true);
}

function deletePixels() {
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
}

// Grid Ratio indicator
for (let i = 0; i < values.length; i++) {
    values[i].addEventListener('change', (event) => {
    for (let i = 0; i < document.getElementById("ratioIMG").children.length; i++) {
        document.getElementById("ratioIMG").children[i].style.filter = "brightness(50%)";
    }
    if(collumnValue.value > rowValue.value){
        document.getElementById("horizontal").style.filter = "brightness(100%)";
    }else if(collumnValue.value < rowValue.value){
        document.getElementById("vertical").style.filter = "brightness(100%)";
    }else if(collumnValue.value == rowValue.value){
        document.getElementById("square").style.filter = "brightness(100%)";
    }
}); 
}

function sellectTool(toolName) {
for (let i = 0; i < document.getElementById("toolBox").children.length; i++){
    document.getElementById("toolBox").children[i].classList.remove("buttonPressed");
}
document.getElementById(toolName).classList.add("buttonPressed");
    tool = toolName;
    console.log("You have sellected " + tool);
}

function rgbToHex(rgbColor) {
    let hexColor= "#";
    rgbColor = String(rgbColor).replace("rgb", '').replace("(", '').replace(")", '').split(",");
    for (let i = 0; i < rgbColor.length; i++) {
        hexColor += ("0" + ((+rgbColor[i]).toString(16))).slice(-2);
    }
    return hexColor;
}