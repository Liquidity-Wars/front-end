var canvas = document.querySelector("canvas");
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");

var tilesetImage = document.querySelector("#tileset-source");
tilesetImage.src = "/tilesets/sprout-lands-tilesetsv3.png";

var tileSize = 16;

var selection = [0, 0]; //Which tile we will paint from the menu

var isMouseDown = false;
var currentLayer = 0;
var layers = [{}, {}, {}, {}, {}, {}];

//Select tile from the Tiles grid
tilesetContainer.addEventListener("mousedown", (event) => {
   selection = getCoords(event);
   tilesetSelection.style.left = selection[0] * tileSize + "px";
   tilesetSelection.style.top = selection[1] * tileSize + "px";
});

//Handler for placing new tiles on the map
function addTile(mouseEvent) {
   var clicked = getCoords(event);
   var key = clicked[0] + "-" + clicked[1];
   if (mouseEvent.shiftKey) {
      delete layers[currentLayer][key];
   } else {
      layers[currentLayer][key] = [selection[0], selection[1]];
   }
   draw();
}

//Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", () => {
   isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
   isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
   isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
   if (isMouseDown) {
      addTile(event);
   }
});

//Utility for getting coordinates of mouse click
function getCoords(e) {
   const { x, y } = e.target.getBoundingClientRect();
   const mouseX = e.clientX - x;
   const mouseY = e.clientY - y;
   return [Math.floor(mouseX / tileSize), Math.floor(mouseY / tileSize)];
}

function exportImage() {
   var data = canvas.toDataURL();
   var image = new Image();
   image.src = data;

   var w = window.open("");
   w.document.write(image.outerHTML);
}

//Reset state to empty
function clearCanvas() {
   layers = [{}, {}, {}, {}, {}, {}];
   draw();
}

function saveMap() {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([JSON.stringify(layers)], {
	    type: "text/json"
	}));
	a.setAttribute("download", "map.json");
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

const loadMap = async (file) => {
    const content = await file.text();
		layers = JSON.parse(content);
		draw();
};

const input = document.getElementById("file-input");
input.addEventListener("change", () => {
		const file = input.files[0];
    if (!file) {
        return;
    }
    loadMap(file)
    .catch(error => {
        console.error(`Error reading file:`, error);
    });
		input.value = '';
});

async function selectFile() {
	input.click();
}

async function loadDefaultMap() {
	fetch('./default-map.json')
	  	.then(response => response.json())
	  	.then(json => {
				layers = json;
		    draw();
		    setLayer(3);
			})
	  	.catch(error => console.log(error));
}

function setLayer(newLayer) {
   //Update the layer
   currentLayer = newLayer;

   //Update the UI to show updated layer
   var oldActiveLayer = document.querySelector(".layer.active");
   if (oldActiveLayer) {
      oldActiveLayer.classList.remove("active");
   }
   document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active");
}

function draw() {
   var ctx = canvas.getContext("2d");
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   var size_of_crop = tileSize;
   layers.forEach((layer) => {
      Object.keys(layer).forEach((key) => {
         //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
         var positionX = Number(key.split("-")[0]);
         var positionY = Number(key.split("-")[1]);
         var [tilesheetX, tilesheetY] = layer[key];
         ctx.drawImage(
            tilesetImage,
            tilesheetX * tileSize,
            tilesheetY * tileSize,
            size_of_crop,
            size_of_crop,
            positionX * tileSize,
            positionY * tileSize,
            size_of_crop,
            size_of_crop
         );
      });
   });
}

loadDefaultMap();