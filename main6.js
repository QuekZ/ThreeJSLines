import './style.css';
import * as THREE from 'three';
import { Scene, OrthographicCamera, WebGLRenderer, Color, Vector2 } from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

var vertices = [];
const scene = new Scene();
const res = 800;
const camera = new OrthographicCamera(
    -res * 0.5, res * 0.5, res * 0.5, -res * 0.5, 0, 1000
);
camera.position.z = 0;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(res, res);
renderer.outputEncoding = THREE.sRGBEncoding; // Ensure correct color space
document.body.appendChild(renderer.domElement);

scene.background = new Color(0x955c71);

var audioContext = new window.AudioContext();

var audioElement = new Audio('audio/sf3_gill.mp3');
audioElement.volume = 0.1;
var audioSource = audioContext.createMediaElementSource(audioElement);

audioSource.connect(audioContext.destination);

var analyser = audioContext.createAnalyser();
audioSource.connect(analyser);

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

document.addEventListener('click', () => {
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    audioElement.play();
});

const lines = [];

function createLines() {
    analyser.getByteFrequencyData(dataArray);
    for (let r = -150; r < 150; r++) {
        vertices = [];
        var material = new LineMaterial({
            color: 0xffffff * (r * (2) * r * (2)),
            linewidth: 0.8,
            resolution: new Vector2(res, res),
        });
        for (let i = 0; i < 100; i++) {
            const frequencyIndex = Math.floor((i / 100) * bufferLength / 4);
            var height = (dataArray[frequencyIndex] / 60) * 100;
            //height += noise2D(i * 20 * 5, (r / 6) * 2) * 5.0; // Can be used
            // for a wavy line(random noises)
            vertices.push(
                -330 +  660 * (i / 100),
                height / 1.6 + r * 0.4,
                0
            );
        }
        if (!lines[r]) {
            var geometry = new LineGeometry();
            geometry.setPositions(vertices);
            const myLine = new Line2(geometry, material);
            myLine.computeLineDistances();
            lines[r] = myLine;
            scene.add(myLine);
        } else {
            lines[r].geometry.setPositions(vertices);
            lines[r].geometry.computeBoundingSphere();
            lines[r].geometry.attributes.position.needsUpdate = true;
        }
    }
}

createLines();

const sfLogoSprite = new THREE.TextureLoader().load("image/sf3-2nd-impact-logo-transparent.png", (texture) => {
    texture.encoding = THREE.sRGBEncoding; // Ensure correct color space for texture
});
const sfLogoMaterial = new THREE.SpriteMaterial({
    map: sfLogoSprite
});

let sfLogo = new THREE.Sprite(sfLogoMaterial);
sfLogo.scale.set(200, 150, 150);
sfLogo.position.set(290, 320, 0);
scene.add(sfLogo);

const strichSprite = new THREE.TextureLoader().load("image/strich.png");
const strichMaterial = new THREE.SpriteMaterial({
    color: 0xff7987,
    map: strichSprite,
    fog: false
});
let strichUnten = new THREE.Sprite(strichMaterial);
strichUnten.scale.set(660, 5, 0);
strichUnten.position.set(-2, -100, 0);
scene.add(strichUnten);

(function animate() {
    requestAnimationFrame(animate);
    createLines();
    renderer.render(scene, camera);
})();
