window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
        var scene = new BABYLON.Scene(engine);

        // Create camera and attach controls
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        // Lighting
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 1), scene);
        light.intensity = 0.7;

        // Custom Shader for Point Rendering
        BABYLON.Effect.ShadersStore["customVertexShader"] = `
            precision highp float;
            attribute vec3 position;
            attribute float pointSize;
            attribute vec3 color;
            uniform mat4 worldViewProjection;
            varying vec3 vColor;
            void main() {
                gl_PointSize = pointSize;
                gl_Position = worldViewProjection * vec4(position, 1.0);
                vColor = color;
            }
        `;

        BABYLON.Effect.ShadersStore["customFragmentShader"] = `
            precision highp float;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;

        // Create custom shader material
        var customMaterial = new BABYLON.ShaderMaterial("customMaterial", scene, {
            vertex: "custom",
            fragment: "custom",
        }, {
            attributes: ["position", "pointSize", "color"],
            uniforms: ["worldViewProjection"]
        });

        // Load PLY file
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/DevarthSambare/Splat1/main/", "splat1.ply", scene, function (newMeshes) {
            var mesh = newMeshes[0];
            mesh.material = customMaterial;
            mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1); // Adjust scale as needed
            mesh.position = new BABYLON.Vector3(0, 0, 0); // Position the mesh
        });

        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
});
