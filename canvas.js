const canvas = () => {
    const line = document.querySelector('.draggable-line');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const container = document.querySelector('.draw-container');
    line.onmousedown = dragMouseDown;

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

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        verifyTopBottomReached(line.offsetTop - pos2);
        verifyLeftRightReached(line.offsetLeft - pos1);

    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }    
}
window.addEventListener("DOMContentLoaded", function () {
    canvas();
})