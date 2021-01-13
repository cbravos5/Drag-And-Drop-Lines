let container;
var theElement;
var diffX, diffY;

const verifyTopBottomReached = top => {
    if(top >= 0 && top <= container.clientHeight) {
        line.style.top = top + "px";
    } else {
        if(top < 0){
            line.style.top = "0px";
        } else {
            line.style.top = (container.clientHeight - 10) + "px";                
        }
    }
} 

const verifyLeftRightReached = left => {
    if(left >= 0 && left <= container.clientWidth) {
        line.style.left = left + "px";
    } else {
        if(left < 0){
            line.style.left = "0px";
        } else {
            line.style.left = (container.clientWidth - line.clientWidth) + "px";                
        }
    }
}

const getWidth = (X,Y,side,fixed) => {
    const x1 = [X,Y];
    const x2 = [side,fixed];
    return Math.hypot(x1[0] - x2[0],x1[1] - x2[1])
}


function separate(event) {
    event.preventDefault();
    
    theElement = event.currentTarget;
    var rect = theElement.getBoundingClientRect();

    const posXclicked = event.clientX;
    const posYclicked = event.clientY;

    const element1Width = Math.floor(getWidth(posXclicked,posYclicked,rect.left,rect.top));
    const element2Width = Math.ceil(getWidth(posXclicked,posYclicked,rect.right,
                          rect.bottom));

    const element1 = document.createElement('section');
    const element2 = document.createElement('section');

    element1.classList.add('draggable-line');
    element2.classList.add('draggable-line');

    element1.onmousedown = clickhandler;
    element2.onmousedown = clickhandler;

    element1.style.width = element1Width + "px";
    element2.style.width = element2Width + "px";
    
    element1.style.top = theElement.offsetTop + "px";
    element2.style.top = posYclicked - container.offsetTop - 5 + "px";

    element1.style.left = theElement.offsetLeft + "px";
    element2.style.left = posXclicked - container.offsetLeft -5 + "px";

    container.removeChild(theElement);

    container.appendChild(element1);
    container.appendChild(element2);
}


function grabber(event) {
    
    // Set the global variable for the element to be moved
    theElement = event.currentTarget;


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
    event.which == 3 ? separate(event) : grabber(event);
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
});
