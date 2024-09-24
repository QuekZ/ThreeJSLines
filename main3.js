import './style.css'
import * as  THREE  from 'three'
import { Scene, OrthographicCamera, WebGLRenderer, Color, Vector2, TextureLoader } from 'three'
import { Line2, LineGeometry, LineMaterial } from 'three-fatline'
import { createNoise2D } from 'simplex-noise'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

const noise2D = createNoise2D();

var vertices = []
var height = 0
var geometry

const scene = new Scene()
const res = 800
const camera = new OrthographicCamera(
    -res * 0.5, res * 0.5, res * 0.5, -res * 0.5, 0, 1000
);
camera.position.z = 0

const renderer = new WebGLRenderer({antialias: true})
renderer.setSize(res, res)
document.body.appendChild(renderer.domElement)

scene.background = new Color("rgb(248, 184, 0)")

var audioContext = new window.AudioContext();

var audioElement = new Audio('audio/R4_MoveMe.mp3');
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
})


const lines = [];

function createLines() {
analyser.getByteFrequencyData(dataArray);
    for (let r = -17; r < -2; r++) {
        vertices = [];
        for (let i = 0; i < 100; i++) {
            const frequencyIndex = Math.floor((i / 100) * bufferLength / 2.2);
            var height = (dataArray[frequencyIndex] / 50) * 30;
            //height +=  noise2D(i * 2 * 0.5,(r / 8) * 2) * 20.0;
    

            // Add noise to the height if needed
            // height += noise2D(i * 0.04 * 0.5, (r / 8) * 0.5) * 2.0;

            vertices.push(
                -330 + 660 * (i / 100),
                height  + r  * 20,
                0
            );
        }

        if (!lines[r]) {
            // Create a new line if it doesn't exist
            geometry = new LineGeometry();
            geometry.setPositions(vertices);
            var material = new LineMaterial({
                color: 0x000000 ,//* (Math.random() + 1),
                linewidth: 0.5 + (4 * Math.random()),
                resolution: new Vector2(res, res)
            });
            const myLine = new Line2(geometry, material);
            myLine.computeLineDistances();
            lines[r] = myLine;
            scene.add(myLine);
        } else {
            // Update the positions of the existing line
            lines[r].geometry.setPositions(vertices);
            lines[r].geometry.computeBoundingSphere(); // Optional, but may be needed for certain materials
            lines[r].geometry.attributes.position.needsUpdate = true;
        }
    }
}

const logoSprite = new TextureLoader().load("image/logoGross.png");
const strichSprite = new TextureLoader().load("image/strich.png");
const rRacerSprite = new TextureLoader().load("image/ridgeRacer.png");

const logoMaterial = new THREE.SpriteMaterial({
  color: 0x000000,
  map: logoSprite,
  fog: false
});
const strichMaterial = new THREE.SpriteMaterial({
    color: 0x000000,
    map: strichSprite,
    fog: false
});
const rRacerMaterial = new THREE.SpriteMaterial({
    color: 0x000000,
    map: rRacerSprite,
    fog:false
})

let logo = new THREE.Sprite(logoMaterial);
logo.scale.set(45,45,45);
logo.position.set(350, 350, 0);
//scene.add(logo);

let strich = new THREE.Sprite(strichMaterial);
strich.scale.set(660, 5, 0);
strich.position.set(-2,120,0);
scene.add(strich);

let strichUnten = new THREE.Sprite(strichMaterial);
strichUnten.scale.set(660, 5, 0);
strichUnten.position.set(-2, -375, 0);
scene.add(strichUnten);

let rRacer = new THREE.Sprite(rRacerMaterial);
rRacer.scale.set(450, 250, 250);
rRacer.position.set(0,250,0);
scene.add(rRacer);

/*const fontLoader = new FontLoader();

let textMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
});

fontLoader.load( 'fonts/Ridge-Bold-Oblique_Regular.json', function (font) {
    let fontGeo = new TextGeometry ('Test 1 2 3', {
        font: font,
        size: 80000,
        height: 500,

    });
let textMesh = new THREE.Mesh(fontGeo, textMaterial);
textMesh.position.set(100, 0,0);
scene.add(textMesh);

});*/

// ############### vertices here 
/*function createLines(){
    var material;
     material = new LineMaterial({
      color: 0xff0000 * Math.random(),
      linewidth: 2,
      resolution: new Vector2( res, res)
    });
  
  
  
    
  // Wellen
  for( let r = -10; r < 10; r++){
   vertices = [];
  for(let i = 0; i < 100; i++){
    height = dataArray[i] / 255 * 20;
    height += noise2D(i * 0.04 * 0.5,(r / 8) * 0.5) * 2.0;
    vertices.push(
      -330 + 660 * ( i / 100),
      height * 20 + r * 16,
      0
    )
  }


  
  // wave
  geometry = new LineGeometry();
  geometry.setPositions(vertices);
  const myLine = new Line2(geometry, material);
  myLine.computeLineDistances();
  scene.add(myLine);

  }
}

*/
// #############################

(function animate(){
    requestAnimationFrame(animate)
    createLines();
    renderer.render(scene, camera)
})();

