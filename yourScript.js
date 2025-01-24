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

        // Log the scene loading process to ensure everything is set
        console.log("Scene created!");

        // Load PLY file
        BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/DevarthSambare/Splat1/main/", "splat1.ply", scene, function(newMeshes) {
            console.log("PLY Mesh Loaded: ", newMeshes);
            if (newMeshes.length > 0) {
                var mesh = newMeshes[0];

                // Apply a basic material to the mesh for debugging
                var basicMaterial = new BABYLON.StandardMaterial("basicMaterial", scene);
                basicMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color for visibility
                mesh.material = basicMaterial;

                // Adjust position, scaling, and rotation for better visibility
                mesh.position = new BABYLON.Vector3(0, 0, 0); // Center it in the view
                mesh.scaling = new BABYLON.Vector3(1, 1, 1); // Make sure it's visible
                mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0); // Rotate to face the camera

                console.log("Mesh scaling and positioning applied.");
            } else {
                console.error("No meshes loaded.");
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
