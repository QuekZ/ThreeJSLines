import './style.css'
import * as  THREE  from 'three'
import { Scene, OrthographicCamera, WebGLRenderer, Color, Vector2, TextureLoader } from 'three'
import { Line2, LineGeometry, LineMaterial } from 'three-fatline'
import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D();

var vertices = [];
var vertices2;
var vertices3;
var vertices4;
var vertices5;
let height = 0;

const scene = new Scene()
const res = 800
const camera = new OrthographicCamera(
  -res * 0.5, res * 0.5, res * 0.5, -res * 0.5, 0 , 1000
);
camera.position.z = 0;

const renderer= new WebGLRenderer({antialias: true})
renderer.setSize(res, res)
document.body.appendChild(renderer.domElement)

scene.background = new Color("rgb(0,0,0)")

// #### Audio ####
const audioContext = new AudioContext();

const audio = new Audio('audio/Funky_Tribu.mp3');
const sourceNoide = audioContext.createMediaElementSource(audio);
const analyserNode = audioContext.createAnalyser();
const frequencyData = new Float32Array(analyserNode.frequencyBinCount);

document.addEventListener('click', () => {
  sourceNoide.connect(analyserNode);
  analyserNode.connect(audioContext.destination);
  audio.play();
})

createLines();

(function animate(){
  moveToBeat();
  requestAnimationFrame(animate)
  renderer.render(scene, camera);
})();

var color = new THREE.Color(0xff0000);
var randomColor = 0xff0000 * Math.random();

function createLines(){
  for(let r = -20; r < 20;r++){
   // let wnoise = noise2D(0, r* 0.125) * 1.0;
    var lineWidth = 2 //+ Math.pow(wnoise * 0.5 + 1, 2);

    let dashed = Math.random() > 0.5;
    let dashScale = 1;
    let dashSize = Math.pow(Math.random(), 2) * 15 * 4;
    let gapSize = dashSize * (0.5 + Math.random() * 1);
    
  var material;
   material = new LineMaterial({
    color: 0xffffff * Math.random(),
    linewidth: lineWidth,
    resolution: new Vector2( res, res),
    /*dashed,
    dashScale,
    dashSize,
    gapSize*/
  });



  
// Wellen
for( let r = -1; r < 1; r++){
 vertices = [];
for(let i = 0; i < 100; i++){
  height = 0;
  //height += noise2D(i * 0.9 * 0.5,(r / 8) * 0.5) * 2.0;
  //height += noise2D(i * 0.04 * 4,(r / 2)  * 0.125) * 1.0;
  //height += noise2D(i * 0.04 * 8,(r / 2)  * 0.125) * 0.5;
  height += noise2D(i * (Math.random() * 0.05) ,r *  Math.random());
  //height += noise2D(i * 0.04 * 32,(r / 2) * 0.125) * 0.125;
  //height += noise2D(i * 0.9 * 64, (r / 2) * 0.125) * 0.06;
  vertices.push(
    -330 + 660 * ( i / 100),
    height * 100 + r * 50,
    0
  )
}

// links

vertices2 = [];
for(let i = 0; i < 107; i++){
  vertices2.push(
    -330,
    -350 + 660 * (i / 100),
    0
  )
}

// rechts
vertices3 = [];
for(let i = 0; i < 107;i++){
  vertices3.push(
    325,
    -350 + 660 * (i / 100),
    0
  )
}

//oben
vertices4 = [];
for(let i = 0; i < 100;i++){
  vertices4.push(
    -330 + 660 * ( i / 100),
    height * 2 + r * 16,
    0
  )
}


//unten
/*vertices5 = [];
for(let i = 0; i < 100;i++){
  vertices5.push(
    -330 + 660 * ( i / 100),
    -350,
    0
  )
}*/


// wave
const geometry = new LineGeometry();
geometry.setPositions(vertices);
const myLine = new Line2(geometry, material);
myLine.computeLineDistances();
scene.add(myLine);
// ###############

// links
const geoemtry2 = new LineGeometry();
geoemtry2.setPositions(vertices2);
const myLine2 = new Line2(geoemtry2, material)
myLine2.computeLineDistances();
scene.add(myLine2);
// ########################

// rechts
const geometry3 = new LineGeometry();
geometry3.setPositions(vertices3);
const myLine3 = new Line2(geometry3, material);
myLine3.computeLineDistances();
scene.add(myLine3);
// #########################

// oben
const geometry4 = new LineGeometry();
geometry4.setPositions(vertices4);
const myLine4 = new Line2(geometry4, material);
myLine4.computeLineDistances();
scene.add(myLine4);
}
}
  






// ### Logo
const logoSprite = new TextureLoader().load("images/logoGross.png");
const logoMaterial = new THREE.SpriteMaterial({
  color: 0xffffff,
  map: logoSprite,
  fog: false
});
let logo = new THREE.Sprite(logoMaterial);
logo.scale.set(125,125,125);
logo.position.set(230, 250, 0);
scene.add(logo);
//##########
}

function moveToBeat(){
  vertices.forEach((LineGeometry) => {
    analyserNode.getFloatFrequencyData(frequencyData);
    const averageFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
    height += noise2D((averageFrequency / 500) * 0.0015 * 1,50 * 0.125) * 2.0;
    console.log(averageFrequency);
  })
}

