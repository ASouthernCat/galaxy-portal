<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import {ThreeApp} from './js/ThreeApp'
var webgl = ref(null)
var threeApp
onMounted(() => {
    console.log("hello threejs")
    threeApp = new ThreeApp(webgl.value)
    threeApp.render()
})
onUnmounted(() => {
    threeApp.clear()
})
</script>
<template>
    <canvas ref="webgl" class="webgl"></canvas>
    <div class="space">
        <p>PRESS SPACE</p>
    </div>
</template>
<style>
.webgl {
    top: 0;
    left: 0;
    outline: none;
}
.space{
    display: flex;
    position: fixed;
    width: 100vw;
    bottom: 3%;
    justify-content: center;
    pointer-events: none;
    user-select: none;
}
.space p{
    background-color: rgba(0, 0, 0, 0.255);
    padding: 15px 20px;
    text-align: center;
    color: white;
    box-shadow: 0 0 5px #fff;
}
</style>