#target photoshop

// Read in file
var b = new File("~/Desktop/screenScript/temp/info.txt");
b.open('r');
var appID, title, sub, ln1, ln2, ln3;

while(!b.eof)
{
	appID = b.readln();
	title = b.readln();
	sub = b.readln();
	ln1 = b.readln();
	ln2 = b.readln();
	ln3 = b.readln();
}

b.close();

// set title
if(title.length > 35) {
    title = title.substring(0,34)+"...";
}
replaceText(findLayer("title"), title);

// set subtitle

// Handle no subtitle
if(sub == "NA")
{
  findLayer("sub").visible = false;
  moveLayer(findLayer("1"), "40 px", "700 px");
  moveLayer(findLayer("2"), "40 px", "730 px");
  moveLayer(findLayer("3"), "40 px", "760 px");
}
else
{
  if(sub.length > 40) 
  {
    sub = sub.substring(0,40)+"...";
  }

  replaceText(findLayer("sub"), sub);
}

// set sub lines
replaceText(findLayer("1"), ln1);
replaceText(findLayer("2"), ln2);
replaceText(findLayer("3"), ln3);

// Place album art
var fileRef = new File("~/Desktop/screenScript/temp/art.jpg");
app.load(fileRef); //load it into documents
backFile = app.activeDocument; //prepare your image layer as active document

var fHeight = app.activeDocument.height;
var fWidth = app.activeDocument.width;

backFile.selection.selectAll();
backFile.selection.copy(); //copy image into clipboard
backFile.close(SaveOptions.DONOTSAVECHANGES); //close image without saving changes

// Place background layer
activeDocument.paste(); //paste selection into your document
activeDocument.activeLayer.resize(800,800); //resize layer
activeDocument.activeLayer.name = "bkg"; //set your layer's name
activeDocument.activeLayer.applyGaussianBlur(50) // Apply blur
activeDocument.activeLayer.move(activeDocument, ElementPlacement.PLACEATEND);

// Place artwork

activeDocument.paste(); //paste selection into your document

newWidth = 320/(fHeight/fWidth);


// Resize
if (fWidth > fHeight) {
    resizeLayer(newWidth,320)
}
else {
    resizeLayer(320,320); //resize layer
}

activeDocument.activeLayer.name = "art"; //set your layer's name
moveLayer(findLayer("art"), ((app.activeDocument.width - newWidth) / 2) + "px", "230 px"); // Move the layer to position
activeDocument.activeLayer.move(activeDocument, ElementPlacement.PLACEATBEGINNING);

// Save file as jpg
var JPGquality = 12;
var docPath = "~/Desktop/screenScript/screenshots";
var docName = appID;
var saveFile = new File(docPath+'/'+docName+ '.jpg');
SaveJPEG(saveFile, JPGquality);

activeDocument.close(SaveOptions.DONOTSAVECHANGES);

///////////////////////////////////////
//FUNCTIONS
///////////////////////////////////////

function findLayer(Find){

	var regFind = new RegExp(Find,"gi");

    if(activeDocument.artLayers.length > 0)
    {
        for(var z = 0; z < activeDocument.artLayers.length; z++)
        {
            var layer = activeDocument.artLayers[z];
            if (layer.name == Find) return layer;
        }
    }
}

function replaceText(layer, Replace)
{
    Font = layer.textItem.font;
	Size = layer.textItem.size;

	layer.textItem.contents = Replace;

	layer.textItem.font = Font;
	layer.textItem.size = Size;
}

function moveLayer(layer,fX,fY) {

  var Position = layer.bounds;
  Position[0] = fX - Position[0];
  Position[1] = fY - Position[1];

  layer.translate(-Position[0],-Position[1]);
}

function SaveJPEG(saveFile, jpegQuality) {

jpgSaveOptions = new JPEGSaveOptions();
jpgSaveOptions.embedColorProfile = true;
jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
jpgSaveOptions.matte = MatteType.NONE;
jpgSaveOptions.quality = jpegQuality; //1-12
activeDocument.saveAs(saveFile, jpgSaveOptions, true,Extension.LOWERCASE);
}

function resizeLayer(Width , Height){ //pixels

if(!documents.length) return;
if(activeDocument.activeLayer.isBackgroundLayer) return;
var startRulerUnits = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;
var LB = activeDocument.activeLayer.bounds;
var lWidth = 100/(LB[2].value - LB[0].value);
var lHeight =100/(LB[3].value - LB[1].value);
var NewWidth = lWidth * Width;
var NewHeight = lHeight * Height;
activeDocument.activeLayer.resize(Number(NewWidth),Number(NewHeight),AnchorPosition.MIDDLECENTER); 
app.preferences.rulerUnits = startRulerUnits;

}