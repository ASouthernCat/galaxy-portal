/**
* 指针坐标
*/
var canvas
const pickPosition = { x: Math.random(), y: Math.random() }
function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    // console.log(rect,canvas.width,canvas.height)
    return {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
    };
}
function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    // console.log(pos)
    pickPosition.x = pos.x
    pickPosition.y = pos.y 
}

function clearPickPosition() {
    // pickPosition.x = -100000;
    // pickPosition.y = -100000;
}

function pickPos() {
    canvas = document.querySelector("canvas.webgl")
    window.addEventListener("mousemove", setPickPosition);
    window.addEventListener("mouseout", clearPickPosition);
    window.addEventListener("mouseleave", clearPickPosition);
}
function clear(){
    window.removeEventListener("mouseout", clearPickPosition)
    window.removeEventListener("mousemove", setPickPosition);
    window.removeEventListener("mouseleave", clearPickPosition);
}
export { pickPosition,pickPos,clear }