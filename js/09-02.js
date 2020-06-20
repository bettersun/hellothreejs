function init() {
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();
    var scene = new THREE.Scene();

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);   
    document.addEventListener( 'wheel', onDocumentMouseWheel, false ); 
    window.addEventListener( 'resize', onWindowResize, false );

    initDefaultLighting(scene);

    var groundPlane = addGroundPlane(scene)
    groundPlane.position.y = 0;

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.name = "Cube";
    cube.bid = "A001";

    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 10, 10);
    var sphereMaterial = new THREE.MeshStandardMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.name = "Sphere";
    sphere.bid = "A002";

    // position the sphere
    sphere.position.x = -10;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);

    var cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
    var cylinderMaterial = new THREE.MeshStandardMaterial({color: 0x77ff77});
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.name = "Cylinder";
    cylinder.bid = "A003";

    cylinder.castShadow = true;
    cylinder
        .position
        .set(0, 0, 1);

    scene.add(cylinder);
    
    //加载JSON模型
    var loader = new THREE.ObjectLoader();
    loader.load("../models/test2.json",function (obj) {
        // console.debug(obj);
        for (var i=0;i<obj.children.length;i++) {
            
            var o = obj.children[i];
            // console.debug(o);
            if (o.type =="Mesh") {

                console.debug(o);
                o.name = "BlenderObj" + (i + 1);
                o.bid = "B00" +  (i + 1);
                        
                // o.materials[0].color = 0x66ee66;

                o.position.x = o.position.x  + 5;
                o.position.y = o.position.y  + 8;
                o.position.z = o.position.z  + 5;
                
                o.castShadow = true;
                scene.add(o);
            }
        }
    });
    
    //加载
	var jsonloader = new THREE.JSONLoader();
	jsonloader.load( '../models/monster/monster.js', function ( geometry, materials ) {

		// adjust color a bit

		var material = materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( 0xffaaaa );
		
		for (i = 0; i < 2; i++) {
			mesh = new THREE.Mesh( geometry, materials );

			var s = THREE.Math.randFloat( 0.001, 0.003 );
			mesh.scale.set( s * (i +1), s * (i +1), s * (i +1) );

	        mesh.position.x = 6 * (i +1);
	        mesh.position.y = 2 * (i +1);
	        mesh.position.z = 2 * (i +1);
	     
	        mesh.name = "Monster" + i;
	        mesh.bid = "M00" + i;

			scene.add( mesh );
		}
			

	} );

    // position and point the camera to the center of the scene
    // camera.position.x = -30;
    // camera.position.y = 40;
    // camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = 20;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    // call the render function
    var step = 0;

    var Options = function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;
        this.showRay = false;
    };

    var gui = new dat.GUI();
    options = new Options();
    gui.add(options, 'rotationSpeed', 0, 0.5).listen();
    gui.add(options, 'bouncingSpeed', 0, 0.5);
    gui.add(options, 'scalingSpeed', 0, 0.5);
    gui.add(options, 'showRay').onChange(function (e) {
        if (tube) scene.remove(tube)
    });

    // setInterval(function() {
    //     options.bouncingSpeed = options.bouncingSpeed + 0.01;
    //   }, 500);

    $('#upRotationSpeed').click(function(){
        options.rotationSpeed = options.rotationSpeed + 0.01;
        // gui.options.rotationSpeed = options.rotationSpeed;
        console.log("RotationSpeed + ")
    });

    $('#downRotationSpeed').click(function(){
        options.rotationSpeed = options.rotationSpeed - 0.01;
        // console.log(gui.domElement);
        console.log("RotationSpeed - ");
    });

    renderScene();
    
    var step = 0;
    var scalingStep = 0;

    function renderScene() {
        stats.update();

        cube.rotation.x += options.rotationSpeed;
        // cube.rotation.y += options.rotationSpeed;
        // cube.rotation.z += options.rotationSpeed;

        // bounce the sphere up and down
        step += options.bouncingSpeed;
        sphere.position.x = 20 + (5 * (Math.cos(step)));
        sphere.position.y = 2 + (5 * Math.abs(Math.sin(step)));

        // scale the cylinder
        scalingStep += options.scalingSpeed;
        var scaleX = Math.abs(Math.sin(scalingStep / 4));
        var scaleY = Math.abs(Math.cos(scalingStep / 5));
        var scaleZ = Math.abs(Math.sin(scalingStep / 7));
        cylinder
            .scale
            .set(scaleX, scaleY, scaleZ);

        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
        
        renderer.render(scene, camera);
    }

    var projector = new THREE.Projector();
    var tube;

    function onDocumentMouseDown(event) {

        var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        // var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);
        var intersects = raycaster.intersectObjects(scene.children, true);

        console.debug(scene.children);

        if (intersects.length > 0) {
            console.log(intersects[0]);
            intersects[0].object.material.transparent = true;
            intersects[0].object.material.opacity = 0.8;

            // result.innerHTML = intersects[0].object.name;
            var selectedObj = intersects[0].object
            if (selectedObj.bid) {
                s = selectedObj.bid + " <br> " + selectedObj.name + " <br> ";
                
                $("#result").html(s);
                //  + " <br>X: " + selectedObj.position.x + "  Y: " + selectedObj.position.y
            } else {
                $("#result").html("");
            }
        }
    }

    function onDocumentMouseMove(event) {
        if (options.showRay) {
            var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
            vector = vector.unproject(camera);

            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

            if (intersects.length > 0) {

                var points = [];
                points.push(new THREE.Vector3(-30, 39.8, 30));
                points.push(intersects[0].point);

                var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
                var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.001);

                if (tube) 
                    scene.remove(tube);
                
                if (options.showRay) {
                    tube = new THREE.Mesh(tubeGeometry, mat);
                    scene.add(tube);
                }
            }
        }
    }

    function onDocumentMouseWheel( event ) {

        camera.fov += event.deltaY * 0.5;
        camera.updateProjectionMatrix();

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}