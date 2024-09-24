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

//scene.background = new TextureLoader().load("image/tekken7Cover.jpg");
scene.background = new Color('#770203')

const mishimaSprite = new TextureLoader().load("image/mishima.png");
const strichSprite = new TextureLoader().load("image/strich.png");
const strichMaterial = new THREE.SpriteMaterial({
    color: 0x000000,
    map: strichSprite,
    fog: false
});
const mishimaMaterial = new THREE.SpriteMaterial({
    color: 0x000000,
    map: mishimaSprite,
})

let mishima = new THREE.Sprite(mishimaMaterial);
mishima.position.set(250, 275, 0);
mishima.scale.set(150,175,150);
scene.add(mishima);

let strich = new THREE.Sprite(strichMaterial);
strich.scale.set(660, 5, 0);
strich.position.set(-2,170,0);

scene.add(strich);

let strichUnten = new THREE.Sprite(strichMaterial);
strichUnten.scale.set(660, 5, 0);
strichUnten.position.set(-2, -375, 0);
scene.add(strichUnten);

var audioContext = new window.AudioContext();

var audioElement = new Audio('audio/tekken7Mishima.mp3');
audioElement.volume = 0.1;
var audioSource = audioContext.createMediaElementSource(audioElement);

audioSource.connect(audioContext.destination);

var analyser = audioContext.createAnalyser();
audioSource.connect(analyser);

analyser.fftSize = 2048;
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
    for (let r = -7; r < 0; r++) {
        vertices = [];
        for (let i = 0; i < 100; i++) {
            const frequencyIndex = Math.floor((i / 100) * bufferLength / 2);
            var height = (dataArray[frequencyIndex] / 60) * 100;
            //height +=  noise2D(i * 2 * 0.5,(r / 8) * 2) * 20.0;
            // Add noise to the height if needed
             //height += noise2D(i * 0.04 * 0.5, (r / 8) * 0.5) * 2.0;
            vertices.push(
                -330 + 660 * (i / 100),
                height / 2  + r  * 30,
                0
            );
        }
        if (!lines[r]) {
            // Create a new line if it doesn't exist
            geometry = new LineGeometry();
            geometry.setPositions(vertices);
            var material = new LineMaterial({
                color: 0x000000,
                linewidth: 4,
                resolution: new Vector2(res, res), 
                linecap: 'square'
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



const rRacerSprite = new TextureLoader().load("image/Tekken7.png");



const rRacerMaterial = new THREE.SpriteMaterial({
    //color: 0xcccccc,
    map: rRacerSprite,
    fog: false
})



let rRacer = new THREE.Sprite(rRacerMaterial);
//rRacer.scale.set(475, 250, 250);
rRacer.scale.set(500,500,500);
rRacer.position.set(-100,275,0);
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

