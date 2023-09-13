import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
export function createControl(camera, canvas) {
    const control = new OrbitControls(camera, canvas)
    // control.maxPolarAngle = Math.PI * 0.5
    // control.minPolarAngle = 0.1
    // control.minDistance = 4
    // contols.screenSpacePanning = false
    control.target.set(0, 0, 5)
    control.enableDamping = true
    control.dampingFactor = 0.1
    // control.enablePan = false
    control.enabled  = false
    return control
}