import './style.css';
import * as THREE from 'three';
import { Scene, OrthographicCamera, WebGLRenderer, Color, Vector2 } from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

var vertices = [];
var height = 0;

const scene = new Scene();
const res = 800;
const camera = new OrthographicCamera(
    -res * 0.5, res * 0.5, res * 0.5, -res * 0.5, 0, 1000
);
camera.position.z = 0;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(res, res)
document.body.appendChild(renderer.domElement);

scene.background = new Color("rgb(0,0,0)");

function createLines() {
   /* // Clear the scene before adding new lines
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }*/

    for (let r = -50; r < 50; r++) {
        // let wnoise = noise2D(0, r* 0.125) * 1.0;
        // var lineWidth = 0.25 + Math.pow(wnoise * 0.5 + 1, 2);

        // Wellen
        for (let r = -250; r < 250; r++) {
            vertices = [];
            var material;
            material = new LineMaterial({
                color: 0xffffff * (r * (48) * r * (48)),
                linewidth: 15,
                resolution: new Vector2(res, res),
            });
            for (let i = 0; i < 100; i++) {
                height = 0;
                /*height += noise2D(i * -(0.2) * 0.1, (r / 32) * 0.5) * 3.0;
                height += noise2D(i * -(0.04) * 16, (r / 15) * 0.125) * 1.0;
                height += noise2D(i * 0.04 * 128, (r / 0.5) * 0.125) * 0.06;*/
                vertices.push(
                    -500 + 1000 * (i / 100),
                    height * 22 + r * 10,
                    0
                )
            }
            // wave
            const geometry = new LineGeometry();
            geometry.setPositions(vertices);
            const myLine = new Line2(geometry, material);
            myLine.computeLineDistances();
            scene.add(myLine);
        }
    }
}

createLines();

(function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
})();

// Generate a new artwork every second
//setInterval(createLines, 1000);
