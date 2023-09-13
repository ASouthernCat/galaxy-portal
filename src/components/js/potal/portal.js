import * as THREE from 'three'
import { gui, debugObject } from '../system/gui'
import gsap from 'gsap'
import { RoughEase } from 'gsap/all'
import { pickPosition } from '../system/mouse'

const TICK_DURATION = 1000 / 60
const warpParams = {
    offsetX: 0,
    offsetY: 0,
    repeatX: 10,
    repeatY: 4,
    cameraShake: 0
}
var curve, splineGeometry, tubeGeometry, originalTubeGeometry, tubeMaterial
var scene = new THREE.Scene()
function createPotal(that) {
    // create galaxy potal
    scene = that.scene
    console.log("创建传送隧道")

    const texture = new THREE.TextureLoader().load("src/assets/images/galaxy3.jpg")

    splineGeometry = new THREE.BufferGeometry()

    const points = []

    // 隧道曲线几何点
    for (let i = 0; i < 5; i += 1) {
        points.push(new THREE.Vector3(0, 0, 3 * (i / 4)))
    }

    // 曲线尾部弯曲
    points[4].y = -0.06

    // 由几何点创建曲线
    curve = new THREE.CatmullRomCurve3(points)

    // 创建管道
    tubeGeometry = new THREE.TubeGeometry(
        curve,
        70,
        0.02,
        40,
        false
    )

    // The original tube geometry, i.e. the shape of the tube when it is not
    // warped and the mouse is at (0.5, 0.5). This copy is never modified.
    originalTubeGeometry = tubeGeometry.clone()

    // 扭曲隧道
    updateCurve(Infinity)

    // The tube texture
    tubeMaterial = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: texture
    })
    tubeMaterial.map.wrapS = THREE.MirroredRepeatWrapping
    tubeMaterial.map.wrapT = THREE.MirroredRepeatWrapping
    updateMaterialOffset()

    // Mesh
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
    scene.add(tubeMesh)
}

function updateCurve(delta) {
    // console.log(pickPosition)
    // console.log(delta)
    // Warp the high-level points based on the mouse position
    curve.points[2].x = curve.points[4].x =
        0.6 * (1 - pickPosition.x) - 0.3
    curve.points[2].y = curve.points[4].y =
        0.6 * (1 - pickPosition.y) - 0.3

    // Update the spline mesh with the new points
    const points = curve.getPoints(70)
    splineGeometry.setFromPoints(points)

    // Create vertexes which are updated in the loop below
    const vertex = new THREE.Vector3()
    const originalVertex = new THREE.Vector3()
    const splineVertex = new THREE.Vector3()

    // Get the position attributes from the various geometries
    const tubePosition = tubeGeometry.getAttribute('position')
    const originalTubePosition = originalTubeGeometry.getAttribute(
        'position'
    )
    const splinePosition = splineGeometry.getAttribute('position')

    // The number of tube segments, plus one
    const segmentPoints = tubePosition.count / splinePosition.count

    // Warp the tube geometry based on the updated spline mesh
    for (let i = 0; i < tubePosition.count; i += 1) {
        vertex.fromBufferAttribute(tubePosition, i)
        originalVertex.fromBufferAttribute(originalTubePosition, i)

        const index = Math.floor(i / segmentPoints)
        splineVertex.fromBufferAttribute(splinePosition, index)

        tubePosition.setX(
            i,
            vertex.x +
            (originalVertex.x + splineVertex.x - vertex.x) *
            Math.min(1, delta / TICK_DURATION / 10)
        )

        tubePosition.setY(
            i,
            vertex.y +
            (originalVertex.y + splineVertex.y - vertex.y) *
            Math.min(1, delta / TICK_DURATION / 10)
        )
    }
    tubePosition.needsUpdate = true
}

/**
 * 更新贴图偏移量
 */
function updateMaterialOffset() {
    tubeMaterial.map.offset.x = warpParams.offsetX
    tubeMaterial.map.offset.y = warpParams.offsetY
    tubeMaterial.map.repeat.x = warpParams.repeatX
    tubeMaterial.map.repeat.y = warpParams.repeatY
}

var isSendeAnimateOn = false
var hyperspace,shake
debugObject.sendAnimate = ()=>{
    if(!isSendeAnimateOn){
        isSendeAnimateOn = true
        // 穿梭动画
        hyperspace = gsap.timeline()
        hyperspace.to(warpParams, {
            duration: 4,
            repeatX: 0.3,
            ease: 'power1.easeInOut'
        })
        hyperspace.to(warpParams,{
            duration: 12,
            offsetX: 8,
            ease: 'power2.easeInOut'
        },0)
        hyperspace.to(warpParams,{duration:6,repeatX:10,ease:'power2.easeInOut'},'-=5')
        hyperspace.eventCallback("onComplete",()=>{
            hyperspace.kill()
            warpParams.repeatX = 10
            warpParams.offsetX = 0
            isSendeAnimateOn = false
            gsap.to(".space p",{scaleX:1,duration:1})
            gsap.to(".space p",{boxShadow:"0 0 5px 0px #fff",duration:0.1})
        })

        // 视角晃动
        shake = gsap.timeline()
        shake.to(warpParams,{
            duration:2,
            cameraShake: -0.01,
            ease: RoughEase.ease.config({
                template: 'power0.easeNone',
                strength: 0.5,
                points: 100,
                taper: 'none',
                randomize: true,
                clamp: false
            })
        },4)
        shake.to(warpParams,{
            duration:1,
            cameraShake: 0,
            ease: RoughEase.ease.config({
                template: 'power0.easeNone',
                strength: 0.5,
                points: 100,
                taper: 'none',
                randomize: true,
                clamp: false
              })
        })
        shake.eventCallback("onComplete",()=>{
            shake.kill()
            warpParams.cameraShake = 0
        })
    }
}
gui.add(debugObject,"sendAnimate").name("传送！")

window.addEventListener("keyup",(ev)=>{
    if(ev.key === " "){
        debugObject.sendAnimate()
        gsap.to(".space p",{scaleX:0,duration:1,ease:"power4.in",delay:0.5})
        gsap.to(".space p",{boxShadow:"0 0 10px 5px #1bff4d",duration:0.5})
    }
})

export { warpParams, createPotal, updateCurve, updateMaterialOffset ,isSendeAnimateOn};
