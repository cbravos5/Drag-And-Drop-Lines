//global element for draw container
let container;
//element to be changed
let theElement;
//position vars
let diffX, diffY;
//position track history for resize vars
let originalXHold, originalXEle, originalWidth;
let rot, rotationDiagDiff;

// const verifyTopBottomReached = top => {
//     if(top >= 0 && top <= container.clientHeight) {
//         line.style.top = top + "px";
//     } else {
//         if(top < 0){
//             line.style.top = "0px";
//         } else {
//             line.style.top = (container.clientHeight - 10) + "px";                
//         }
//     }
// } 

// const verifyLeftRightReached = left => {
//     if(left >= 0 && left <= container.clientWidth) {
//         line.style.left = left + "px";
//     } else {
//         if(left < 0){
//             line.style.left = "0px";
//         } else {
//             line.style.left = (container.clientWidth - line.clientWidth) + "px";                
//         }
//     }
// }

const getDistance = (A,B) => {
    return Math.hypot(A[0] - B[0],A[1] - B[1]);
};

const getWidth = (X,Y,rect,line) => {
    let coord;
    const tempOffsetLeft = theElement.offsetLeft + container.offsetLeft + 5;
    const side = Math.abs(rect.left-tempOffsetLeft) <= Math.abs(rect.right-tempOffsetLeft) ?
                     'left' : 'right';
    if( line == 1 ){
        coord = side == 'left' ? [rect.left,rect.top] : [rect.right,rect.top];     
    } else {
        coord = side == 'left' ? [rect.right,rect.bottom] : [rect.left,rect.bottom]; 
    }
    return getDistance([X,Y],coord);
}

const createAndAppendDots = (line) => {
    const dot1 = document.createElement('section');
    const dot2 = document.createElement('section');

    dot1.classList.add('rotate-point')
    dot2.classList.add('rotate-point')

    dot1.id = 1;
    dot2.id = 2;

    line.appendChild(dot1);
    line.appendChild(dot2);
}

function getCurrentRotation()  {
    var st = window.getComputedStyle(theElement, null);
    var tr = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
             "fail...";
  
    if( tr !== "none") {
        var values = tr.split('(')[1];
            values = values.split(')')[0];
            values = values.split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
    
        var scale = Math.sqrt(a*a + b*b);
    
        // arc sin, convert from radians to degrees, round
        /** /
         var sin = b/scale;
        var angle = Math.round(Math.asin(sin) * (180/Math.PI));
        /*/
        var radians = Math.atan2(b, a);
        if ( radians < 0 ) {
            radians += (2 * Math.PI);
        }
        var angle = Math.round( radians * (180/Math.PI));
            /**/
    } else {
      var angle = 0;
    }
  
    // works!
    return angle;
}

function resize(event) {
    
    // Compute the difference between where it is and 
    //  where the mouse click occurred
    //rot = getCurrentRotation();
    //theElement.style.transform = 'rotate(0deg)';

    rotationDiagDiff = Math.round(150 - (event.clientX - theElement.getBoundingClientRect().left));
    console.log(rotationDiagDiff);

    
        originalXHold = event.clientX;
        originalXEle = theElement.offsetLeft;
        originalWidth = theElement.offsetWidth;
    

    // Now register the event handlers for moving and 
    //  dropping the word
    
    document.addEventListener("mousemove", resizer, true);
    document.addEventListener("mouseup", dropperR, true);

    // Stop propagation of the event and stop any default 
    //  browser action

    event.stopPropagation();
    event.preventDefault();
}

const createLine = (width,rot,top,left) => {
    //create line
    const element = document.createElement('section');
    //add class to line
    element.classList.add('draggable-line');
    //add event handler
    element.onmousedown = clickhandler;
    //set line width
    element.style.width = width + "px";
    //set element top offset
    element.style.top = top + "px";
    //set element left offset
    element.style.left = left + "px";
    //set element rotation
    element.style.transform = "rotate("+ (rot) + "deg)";
    createAndAppendDots(element);
    return element;
}

function separate(event) {
    event.preventDefault();
    
    var rect = theElement.getBoundingClientRect();

    const posXclicked = event.clientX;
    const posYclicked = event.clientY;

    const element1Width = Math.floor(getWidth(posXclicked,posYclicked,rect,1));
    const element2Width = Math.ceil(getWidth(posXclicked,posYclicked,rect,2));
    
    const rot = getCurrentRotation();

    const element1 = createLine(element1Width,rot,theElement.offsetTop,
                                theElement.offsetLeft)

    const element2 = createLine(element2Width,rot,posYclicked - container.offsetTop - 5,
                                posXclicked - container.offsetLeft -5);

    container.removeChild(theElement);

    container.appendChild(element1);
    container.appendChild(element2);
}

function grabber(event) {
    
    // Set the global variable for the element to be moved


    // Determine the position of the word to be grabbed,
    //  first removing the units from left and top

    var posX = parseInt(theElement.offsetLeft);
    var posY = parseInt(theElement.offsetTop);

    // Compute the difference between where it is and 
    //  where the mouse click occurred

    diffX = event.clientX - posX;
    diffY = event.clientY - posY;


    // Now register the event handlers for moving and 
    //  dropping the word
    
    document.addEventListener("mousemove", mover, true);
    document.addEventListener("mouseup", dropper, true);

    // Stop propagation of the event and stop any default 
    //  browser action

    event.stopPropagation();
    event.preventDefault();

}  //** end of grabber

function clickhandler(event) {
    event.preventDefault();
    theElement = event.currentTarget;
    let { target } = event;
    if (target.classList.contains('move-point')){
        if(target.dataset.dot == "2"){dot = theElement.querySelector('[data-dot="1"]');}
        else {dot = theElement.querySelector('[data-dot="2"]');}
        resize(event);
    } else {
        event.which == 3 ? separate(event) : grabber(event);
    }    
}

// *******************************************************

// The event handler function for moving the word

function mover(event) {
    // Compute the new position, add the units, and move the word
    
    theElement.style.left = (event.clientX - diffX) + "px";
    theElement.style.top = (event.clientY - diffY) + "px";
    // Prevent propagation of the event

    event.stopPropagation();
}  //** end of mover

// *********************************************************
// The event handler function for dropping the word

function dropper(event) {

    // Unregister the event handlers for mouseup and mousemove
    document.removeEventListener("mouseup", dropper, true);
    document.removeEventListener("mousemove", mover, true);

    // Prevent propagation of the event

    //  event.stopPropagation();
}   //** end of dropper

function resizer(event) {
    event.preventDefault();
    if (dot.dataset.dot == '1') {
        const width = originalWidth + (event.clientX - originalXHold);
        width < 20 ? theElement.style.width = '20px' : theElement.style.width = width + 'px';
    } else {
        const width = originalWidth - (event.clientX - originalXHold);
        if (width < 20) {theElement.style.width = '20px';} 
        else {
            theElement.style.width = width + 'px';
            theElement.style.left = originalXEle + (event.clientX - originalXHold) + 'px';
        }  
    };
};

function dropperR(event) {
    //theElement.style.transform = `rotate(${rot}deg)`;
     // Unregister the event handlers for mouseup and mousemove
     document.removeEventListener("mouseup", dropperR, true);
     document.removeEventListener("mousemove", resizer, true);
}

window.addEventListener("DOMContentLoaded", () => {
    const lines = document.querySelectorAll('.draggable-line');
    container = document.querySelector('.draw-container')
    lines.forEach(line => {
        line.onmousedown = clickhandler;
    });
    // The event handler function for grabbing the word
    window.oncontextmenu = () => {
        return false;
    }

    // window.addEventListener('mousemove', function moving(event){
    //     console.log(event.clientX - container.offsetLeft, event.clientY - container.offsetTop);
    // })
});