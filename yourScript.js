// Function to load the PLY file and parse it
function loadPLY(fileUrl, callback) {
    fetch(fileUrl)
        .then(response => response.text())
        .then(plyData => {
            const lines = plyData.split("\n");
            let headerEndIndex = lines.findIndex(line => line.startsWith("end_header"));
            let vertexCount = 0;
            let vertices = [];

            // Read the PLY header and find vertex count
            for (let i = 0; i < headerEndIndex; i++) {
                if (lines[i].startsWith("element vertex")) {
                    vertexCount = parseInt(lines[i].split(" ")[2]);
                }
            }

            // Read the vertex data
            for (let i = headerEndIndex + 1; i < headerEndIndex + 1 + vertexCount; i++) {
                const line = lines[i].split(" ");
                const x = parseFloat(line[0]);
                const y = parseFloat(line[1]);
                const z = parseFloat(line[2]);
                const size = parseFloat(line[3] || 0.1); // Default size if not provided
                const color = {
                    r: parseInt(line[4] || 255),
                    g: parseInt(line[5] || 255),
                    b: parseInt(line[6] || 255)
                };

                vertices.push({ x, y, z, size, color });
            }

            callback(vertices);
        })
        .catch(err => console.error('Error loading PLY file:', err));
}

// Set up the 3D scene using Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the PLY model (your splat1.ply)
loadPLY('https://raw.githubusercontent.com/DevarthSambare/Splat1/main/splat1.ply', (vertices) => {
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 10.0; // Size of the splat (adjust as needed)
            }`,
        fragmentShader: `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Color for splat, can be dynamic based on vertex color
            }`
    });

    // Create points for each vertex (Gaussian splats)
    vertices.forEach(vertex => {
        const geometry = new THREE.SphereGeometry(vertex.size, 4, 4);
        const point = new THREE.Mesh(geometry, material);
        point.position.set(vertex.x, vertex.y, vertex.z);
        scene.add(point);
    });

    camera.position.z = 5;

    // Render the scene
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});

// Resize the canvas when the window size changes
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
