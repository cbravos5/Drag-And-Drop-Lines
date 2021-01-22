//global var for width
const wid = 200;
//global element for draw container
let container;
//element to be changed
let theElement;
//position vars
let diffX, diffY;
//position track history for resize vars
let originalXHold, originalXEle, originalWidth;
let rot, rotationDiagDiff;
let left = false;
//Premade calcs needed to get this operations orders
const poligonOps = [
  [
    ["+", "+"],
    ["-", "+"],
  ],
  [
    ["+", "+"],
    ["-", "+"],
    ["-", "-"],
  ],
  [
    ["+", "+"],
    ["+", "+"],
    ["-", "+"],
    ["-", "-"],
  ],
  [
    ["+", "+"],
    ["+", "+"],
    ["-", "+"],
    ["-", "-"],
    ["-", "-"],
  ],
  [
    ["+", "+"],
    ["+", "+"],
    ["-", "+"],
    ["-", "+"],
    ["-", "-"],
    ["-", "-"],
  ],
  [
    ["+", "+"],
    ["+", "+"],
    ["-", "+"],
    ["-", "+"],
    ["-", "-"],
    ["-", "-"],
    ["+", "-"],
  ],
];

//-----------------------------------------------------------------------------------//

//Calculate the euclidian distance between two points
const getDistance = (A, B) => {
  return Math.hypot(A[0] - B[0], A[1] - B[1]);
};

//-----------------------------------------------------------------------------------//

//Calculate width of splited line
//Because we use clientRect for this operation, we need to verify if the left
// side postion provided by the rect really is the element left side (rect gets
// the left most side as left position, wich can cause problemas if not handled)
const getWidth = (X, Y, rect, line) => {
  let coord;
  const tempOffsetLeft = theElement.offsetLeft + container.offsetLeft + 5;
  const side =
    Math.abs(rect.left - tempOffsetLeft) <=
    Math.abs(rect.right - tempOffsetLeft)
      ? "left"
      : "right";
  if (line == 1) {
    coord = side == "left" ? [rect.left, rect.top] : [rect.right, rect.top];
  } else {
    coord =
      side == "left" ? [rect.right, rect.bottom] : [rect.left, rect.bottom];
  }
  return getDistance([X, Y], coord);
};

//-----------------------------------------------------------------------------------//

//Create line dots and append to it
const createAndAppendDots = (line) => {
  const dot1 = document.createElement("section");
  const dot2 = document.createElement("section");

  dot1.classList.add("move-point");
  dot2.classList.add("move-point");

  dot1.dataset.dot = "1";
  dot2.dataset.dot = "2";

  line.appendChild(dot1);
  line.appendChild(dot2);
};

//-----------------------------------------------------------------------------------//

//Get the current rotation of the line
function getCurrentRotation() {
  var st = window.getComputedStyle(theElement, null);
  var tr =
    st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") ||
    "fail...";

  if (tr !== "none") {
    var values = tr.split("(")[1];
    values = values.split(")")[0];
    values = values.split(",");
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];

    var scale = Math.sqrt(a * a + b * b);

    // arc sin, convert from radians to degrees, round
    /** /
         var sin = b/scale;
        var angle = Math.round(Math.asin(sin) * (180/Math.PI));
        /*/
    var radians = Math.atan2(b, a);
    if (radians < 0) {
      radians += 2 * Math.PI;
    }
    var angle = Math.round(radians * (180 / Math.PI));
    /**/
  } else {
    var angle = 0;
  }

  // works!
  return angle;
}

//-----------------------------------------------------------------------------------//

//Function to assign global values and handlers when resizing
function resize(event) {
  //Get current line rotation
  rot = getCurrentRotation();
  //Set rotation to 0 for resizing functions work properly
  theElement.style.transform = "rotate(0deg)";

  //Get original positions
  originalXHold = event.clientX;
  originalXEle = theElement.offsetLeft;
  originalWidth = theElement.offsetWidth;

  // Now register the event handlers for resing and
  //  dropping the line

  document.addEventListener("mousemove", resizer, true);
  document.addEventListener("mouseup", dropperR, true);

  // Stop propagation of the event and stop any default
  //  browser action

  event.stopPropagation();
  event.preventDefault();
}

//-----------------------------------------------------------------------------------//

//Auxiliar function to create a line with dots
const createLine = (width, rot, top, left) => {
  //create line
  const element = document.createElement("section");
  //add class to line
  element.classList.add("draggable-line");
  //add event handler
  element.onmousedown = clickhandler;
  //set line width
  element.style.width = width;
  //set element top offset
  element.style.top = top;
  //set element left offset
  element.style.left = left;
  //set element rotation
  element.style.transform = "rotate(" + rot + "deg)";
  createAndAppendDots(element);
  return element;
};

//-----------------------------------------------------------------------------------//

//Function to assign global values and handlers when spliting
function separate(event) {
  event.preventDefault();

  //Get global postion values of the element
  var rect = theElement.getBoundingClientRect();

  //Get global postion of the click
  const posXclicked = event.clientX;
  const posYclicked = event.clientY;

  //Get width of the two lines based on the distances between mouse clicked position
  // and the line extremities
  const element1Width = Math.floor(getWidth(posXclicked, posYclicked, rect, 1));
  const element2Width = Math.ceil(getWidth(posXclicked, posYclicked, rect, 2));

  //Get line rotation
  const rot = getCurrentRotation();

  //Create lines
  const element1 = createLine(
    element1Width + "px",
    rot,
    theElement.offsetTop + "px",
    theElement.offsetLeft + "px"
  );
  const element2 = createLine(
    element2Width + "px",
    rot,
    posYclicked - 1 + "px",
    posXclicked - 1 + "px"
  );

  //Remove original line from container
  container.removeChild(theElement);

  //Add splited line
  container.appendChild(element1);
  container.appendChild(element2);
}

//-----------------------------------------------------------------------------------//

//Function to assign global values and handlers when moving
function grabber(event) {
  // Set the global variable for the element to be moved

  var posX = parseInt(theElement.offsetLeft);
  var posY = parseInt(theElement.offsetTop);

  // Compute the difference between where it is and
  //  where the mouse click occurred

  diffX = event.clientX - posX;
  diffY = event.clientY - posY;

  // Now register the event handlers for moving and
  //  dropping the line

  document.addEventListener("mousemove", mover, true);
  document.addEventListener("mouseup", dropper, true);

  // Stop propagation of the event and stop any default
  //  browser action

  event.stopPropagation();
  event.preventDefault();
}

//-----------------------------------------------------------------------------------//

//Function to handle different types of actions
//If the target have a 'move-point' class, then the operation is resize
//If not, we have to check if the right or left button was clicked
//If left was clicked, then we move the object, otherwise, split de line
function clickhandler(event) {
  event.preventDefault();
  theElement = event.currentTarget;
  let { target } = event;
  if (target.classList.contains("move-point")) {
    left = target.dataset.dot == "1" ? true : false;
    resize(event);
  } else {
    event.which == 3 ? separate(event) : grabber(event);
  }
}

//-----------------------------------------------------------------------------------//

//Move line function
function mover(event) {
  // Compute the new position, add the units, and move the word

  theElement.style.left = event.clientX - diffX + "px";
  theElement.style.top = event.clientY - diffY + "px";
  // Prevent propagation of the event

  event.stopPropagation();
}

//-----------------------------------------------------------------------------------//

//Dropper for moving operation
function dropper(event) {
  // Unregister the event handlers for mouseup and mousemove
  document.removeEventListener("mouseup", dropper, true);
  document.removeEventListener("mousemove", mover, true);

  // Prevent propagation of the event

  //  event.stopPropagation();
} //** end of dropper

//-----------------------------------------------------------------------------------//

//Resizer for mouse movement
function resizer(event) {
  event.preventDefault();
  //Different sides needs different treatments
  //If right side dot is moved, only the width needs to be changed
  //If left side dot is moved, the position has to be changed too
  if (left) {
    const width = originalWidth - (event.clientX - originalXHold);
    if (width < 20) {
      theElement.style.width = "20px";
    } else {
      theElement.style.width = width + "px";
      theElement.style.left =
        originalXEle + (event.clientX - originalXHold) + "px";
    }
  } else {
    const width = originalWidth + (event.clientX - originalXHold);
    width < 20
      ? (theElement.style.width = "20px")
      : (theElement.style.width = width + "px");
  }
}

//-----------------------------------------------------------------------------------//

//Dropper for resizing function
function dropperR(event) {
  //Assign rotation before the transformation
  theElement.style.transform = `rotate(${rot}deg)`;
  // Unregister the event handlers for mouseup and mousemove
  document.removeEventListener("mouseup", dropperR, true);
  document.removeEventListener("mousemove", resizer, true);
}

//-----------------------------------------------------------------------------------//
//Function gets last line positions and calculate (based on premade variables)
//the next line top-left position
const getPoligonLinePosition = (op1, op2, lastLine) => {
  let left, top;
  //get number of pixels to move
  const width = Math.round(lastLine.getBoundingClientRect().width);
  const height = Math.round(lastLine.getBoundingClientRect().height);

  op1 == "+"
    ? (left = lastLine.offsetLeft + width)
    : (left = lastLine.offsetLeft - width);
  op2 == "+"
    ? (top = lastLine.offsetTop + height)
    : (top = lastLine.offsetTop - height);

  return [top + "px", left + "px"];
};

//-----------------------------------------------------------------------------------//
//Create poligon lines and append it to DOM
const makePoligon = (sides, ops) => {
  //Calculate sum of degrees
  const degSum = 360 / sides;
  let degV = 0;
  //Append first line to DOM
  let posV = ["35vh", "45vw"];
  let lastLine = createLine(wid + "px", degV, posV[0], posV[1]);
  container.appendChild(lastLine);
  degV = degV + degSum;
  //General operation for the rest of lines
  //get positions, create line and append
  for (let i = 0; i < sides - 1; i++) {
    posV = getPoligonLinePosition(ops[i][0], ops[i][1], lastLine);
    lastLine = createLine(wid + "px", degV, posV[0], posV[1]);
    container.appendChild(lastLine);
    degV = degV + degSum;
  }
};

//-----------------------------------------------------------------------------------//

function insertLine(value) {
  if (value == 2 || value > 8) {
    return;
  }
  container.innerHTML = "";
  const poligonLines = makePoligon(value, poligonOps[value - 3]);
}

//-----------------------------------------------------------------------------------//

//Assign listeners and make queries after content loaded
window.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelectorAll(".draggable-line");
  const input = document.querySelector(".input-field");
  container = document.querySelector(".draw-container");
  //assign handler for every type of action
  lines.forEach((line) => {
    line.onmousedown = clickhandler;
  });
  insertLine(1);
  input.oninput = function () {
    insertLine(input.value);
  };

  //context menu (right click) = off
  window.oncontextmenu = () => {
    return false;
  };
});
