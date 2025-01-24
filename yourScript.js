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

        // Load PLY file (Gaussian splatting data)
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/DevarthSambare/Splat1/main/", "splat1.ply", scene, function(newMeshes) {
            if (newMeshes.length > 0) {
                var mesh = newMeshes[0];
                
                // Set a custom material for Gaussian Splatting
                var material = new BABYLON.ShaderMaterial("splatShader", scene, {
                    vertex: "custom",
                    fragment: "custom"
                }, {
                    attributes: ["position", "pointSize", "color"],
                    uniforms: ["worldViewProjection"]
                });

                mesh.material = material;

                // Scaling and positioning adjustments for better visibility
                mesh.position = new BABYLON.Vector3(0, 0, 0);
                mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            }
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
