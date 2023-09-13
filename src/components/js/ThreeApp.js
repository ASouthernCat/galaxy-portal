import * as resize from "./system/resize"
import * as mouse from "./system/mouse"
import * as THREE from "three"
import Stats from "stats.js"
import { createCamera } from "./base/camera"
import { createScene } from "./base/scene"
import { createCube } from "./base/cube"
import { createRenderer } from "./base/renderer"
import { createControl } from "./base/control"
import * as Portal from "./potal/portal"

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// stats.dom.style.top = "20%"
document.body.appendChild(stats.dom);

class ThreeApp {
    constructor(container) {
        // console.log(container)
        // 鼠标指针归一化坐标
        mouse.pickPos()
        console.log("场景初始化")
        // 相机 camera
        this.camera = createCamera()
        // 控制器
        this.control = createControl(this.camera, container)
        // 场景 scene
        this.scene = createScene()
        // 场景组成内容 object3D
        // const cube = createCube()
        // this.scene.add(cube)
        Portal.createPotal(this)
        // 渲染器 renderer
        this.renderer = createRenderer(container)
        // resize
        resize.resizeEventListener(this.camera, this.renderer)
    }
    render() {
        // 渲染场景
        console.log("渲染场景...")
        const clock = new THREE.Clock()
        const tick = () => {
            stats.update()
            const elapsedTime = clock.getElapsedTime()
            const deltatTime = clock.getDelta()
            // console.log(mouse.pickPosition)
            // console.log(this.camera.position)
            // // Update controls
            this.control.update()

            Portal.warpParams.offsetY += 0.0005
            Portal.updateMaterialOffset()
            if (Portal.isSendeAnimateOn) {
                Portal.updateCurve(5)
                this.updateCameraPosition()
            }
            // Raycast
            // pickHelper.pick(pickPosition, currentScene.scene, camera)

            // // Render
            this.renderer.render(this.scene, this.camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        tick()
    }
    updateCameraPosition() {
        this.camera.position.x = Portal.warpParams.cameraShake
    }
    clear() {
        console.log("清理内存")
        resize.clear()
        mouse.clear()
        this.tick = null
        this.scene = null
        this.camera = null
        this.renderer.dispose()
        this.control.dispose()
        document.body.removeChild(stats.dom)
        // window.location.reload() // 重新刷新页面
    }
}

export { ThreeApp }