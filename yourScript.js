window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,0), scene);
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        // Define the shaders from the shader store
        BABYLON.Effect.ShadersStore["customVertexShader"]= `
        precision highp float;
        attribute vec3 position;
        attribute float pointSize;
        attribute vec3 color;
        uniform mat4 worldViewProjection;
        varying vec3 vColor;
        void main(void) {
            gl_PointSize = pointSize;
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vColor = color;
        }
        `;

        BABYLON.Effect.ShadersStore["customFragmentShader"]= `
        precision highp float;
        varying vec3 vColor;
        void main(void) {
            float r = 0.0, delta = 0.0, alpha = 1.0;
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            r = dot(cxy, cxy);
            if (r > 1.0) {
                discard;
            }
            gl_FragColor = vec4(vColor * alpha, alpha);
        }
        `;

        // Create custom material using the shader
        var customMaterial = new BABYLON.ShaderMaterial("custom", scene, {
            vertexElement: "custom",
            fragmentElement: "custom",
        }, {
            attributes: ["position", "pointSize", "color"],
            uniforms: ["worldViewProjection"]
        });

        // Create a points cloud system (or load your PLY data as point cloud)
        var points = BABYLON.MeshBuilder.CreateBox("points", {size: 2}, scene);
        points.material = customMaterial;

        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});
