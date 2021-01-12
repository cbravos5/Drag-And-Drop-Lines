
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

function grabber(event) {

    // Set the global variable for the element to be moved
    theElement = event.currentTarget;


    // Determine the position of the word to be grabbed,
    //  first removing the units from left and top

    var posX = parseInt(theElement.offsetLeft);
    var posY = parseInt(theElement.offsetTop);
    console.log(posX);
    // Compute the difference between where it is and 
    //  where the mouse click occurred

    diffX = event.clientX - posX;
    diffY = event.clientY - posY;

    console.log(diffX);

    // Now register the event handlers for moving and 
    //  dropping the word
    
    document.addEventListener("mousemove", mover, true);
    document.addEventListener("mouseup", dropper, true);

    // Stop propagation of the event and stop any default 
    //  browser action

    event.stopPropagation();
    event.preventDefault();

}  //** end of grabber

// *******************************************************

// The event handler function for moving the word

function mover(event) {
    // Compute the new position, add the units, and move the word
    
    theElement.style.left = (event.clientX - diffX) + "px";
    theElement.style.top = (event.clientY - diffY) + "px";
    console.log(theElement.offsetLeft);
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
    lines.forEach(line => {
        line.onmousedown = grabber;        
    });
    // The event handler function for grabbing the word
});
