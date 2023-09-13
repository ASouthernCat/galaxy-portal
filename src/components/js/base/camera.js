import { PerspectiveCamera } from "three";
import { sizes } from "../system/sizes";
function createCamera(){
    const camera = new PerspectiveCamera(15, sizes.width / sizes.height, 0.01, 2000)
    camera.position.set(0, 0, 0)
    return camera
}
export {createCamera }