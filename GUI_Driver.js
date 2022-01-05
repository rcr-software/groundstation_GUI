var trueSizeX;
var trueSizeY;
let edgeSmooth = 15;
var result;
var dataPacket;
let altitudeArray = [];
var altitude;
let packetNumArray = [];
var packetnum;
var filePath;

class Pane { // 'Pane' object representing the Pane holding a GUI Element. Should be instantiated in setup().
    constructor (x1, y1, width, height, title, titleXPad, titleYPad, titleFontSize) {
      this.x1 = x1;
      this.y1 = y1;
      this.width = width;
      this.height = height;
      this.title = title;
      this.titleXPad = titleXPad;
      this.titleYPad = titleYPad;
      this.titleFontSize = titleFontSize;
    }
    display()
    {
      noFill();
      strokeWeight(5);
      let c = color(240,55,107);
      stroke(c);
      rect(this.x1, this.y1, (this.width - this.x1), (this.height - this.y1), edgeSmooth); //Displays a physical (rounded) rectangle given the passed co-ordinates
                                                                                           //from the user. Note that p5.js' (irritating) 3rd and 4th 
                                                                                           //constructors for these shapes are width and height (not a 3rd/4th x/y vals)
                                                                                           //so I wrote these operations to assume the user is passing a desired (x2,y2)
                                                                                           //value, and subtracted this from the 1st (x1,y1) to give p5.js the width and
                                                                                           //height it would want to map to our actual second coordinate.
      noStroke();
      fill(c);   
      textSize(this.titleFontSize);                                                                                   
      let titleText = this.title;
      text(titleText, this.x1 + this.titleXPad, this.y1 + this.titleYPad);
    }
}

class LineGraph {
  constructor (LBound, RBound, UBound, DBound, nodeScalerX, nodeScalerY)
  {
    this.LBound = LBound;
    this.RBound = RBound;
    this.UBound = UBound;
    this.DBound = DBound;
    this.nodeScalerX = nodeScalerX;
    this.nodeScalerY = nodeScalerY;
  }
  display()
  {
    var nodeX, nodeY;
    nodeX = this.LBound + (packetnum * this.nodeScalerX);
    nodeY = this.DBound - (altitude * this.nodeScalerY);
    circle(nodeX, nodeY, 20);
    let l = altitudeArray.length;

    for (let i = 0; i < l; i++)
    {
      line(packetNumArray[i-1]*this.nodeScalerX, altitudeArray[i-1]*this.nodeScalerY, packetNumArray[i]*this.nodeScalerX, altitudeArray[i]*this.nodeScalerY);
    }
  }

}

function preload()
{
  trueSizeX = windowWidth; // "True Size" is the size element of the entire screen. Here, it's defined as the size of the window's width and height.
                           // (this was done so desired screensize could be changed at the top of the script and have the effect cascade down throughout.)
  trueSizeY = windowHeight;

  filePath = '/data.txt';

  result = loadStrings(filePath);

}
function setup() {
  createCanvas(trueSizeX, trueSizeY); // create the canvas with size to be truesizeX x truesizeY
  solOnePane = new Pane(10, 10, 200, 200, 'Solenoid One', 20, 30, 25);
  solTwoPane = new Pane(10,215,200,405, 'Solenoid Two', 20, 30, 25);
  LG1 = new LineGraph(10,10,200,200,5,1);

  
}

function draw() {
  background(245);
  result = loadStrings(filePath, handleData);
  solOnePane.display();
  solTwoPane.display();
  LG1.display();
}

function handleData(result)
{
  dataPacket = result[result.length-2];
  altitude = parseInt(dataPacket.slice(11,19));
  packetnum = parseInt(dataPacket.slice(2,10));
  packetNumArray.push(packetnum);
  altitudeArray.push(altitude);

}

