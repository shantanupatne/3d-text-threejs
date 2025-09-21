import * as THREE from 'three'
import { FontLoader, OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js' 


const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const randomTexts = ["Hello ThreeJS", "Good Morning!", "HEY HEY HEYYY", "WHAZZAAAAP", "ThreeJS is great!"]

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/4.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const matcapMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
const donuts = [];
for (let i = 0; i < 2500; i++) {
    const donut = new THREE.Mesh(donutGeometry, matcapMaterial);
    donut.position.x = (Math.random() - 0.5) * 30
    donut.position.y = (Math.random() - 0.5) * 30
    donut.position.z = (Math.random() - 0.5) * 30

    donut.rotation.x = THREE.MathUtils.randFloatSpread(2 * Math.PI)
    donut.rotation.y = THREE.MathUtils.randFloatSpread(Math.PI)

    const scale = Math.random() * 0.75
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
    donuts.push(donut);
}

const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(
        randomTexts.at(Math.random() * randomTexts.length),
        {
            font,
            size: 0.5,
            depth: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 8
        }
    )
    textGeometry.center()
    const text = new THREE.Mesh(textGeometry, matcapMaterial);
    scene.add(text);
})

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    donuts.forEach((donut) => {
        donut.rotation.x +=  0.001
        donut.rotation.y -= 0.002
    })
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()