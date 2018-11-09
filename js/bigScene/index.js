var RENDERER, SCENE, CAMERA;
var CONTROLS, CAMERAHELPER, AXESHELPER, STATS;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraThird, cubeGr, testMeshes = [],
    pre_floor, cur_floor, del_arr = [],
    add_arr = [],LEN_H=32,LEN_F=10;
var memoryWorker,Event1,Event2,EventFg=false;

//创建场景
function initScene() {
    SCENE = new THREE.Scene();
    _createSky();
}

//创建照相机
function initCamera() {
    let cScale = 15;
    CAMERA = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    CAMERA.position.set(6 * cScale, 5 * cScale, 5 * cScale);

    CAMERAHELPER = new THREE.CameraHelper(CAMERA);
    SCENE.add(CAMERAHELPER);

}

//创建渲染器并将cnavas插入文档
function initRender() {
    RENDERER = new THREE.WebGLRenderer({
        antialias: true
    });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    RENDERER.autoClear = false;
    // RENDERER.gammaOutput = true;
    //清除画面颜色
    // RENDERER.setClearColor(0x0080ff);
    document.querySelector(".container").appendChild(RENDERER.domElement);
}

function initLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff); //设置颜色
    SCENE.add(ambientLight);

    var hlight = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    hlight.position.set(0, 1, 0);
    SCENE.add(hlight);

    var pointColor = 0xffffff;
    var directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(6, 6, 6);
    directionalLight.distance = 0;
    directionalLight.intensity = 1;
    SCENE.add(directionalLight);
}

function initContr() {
    CONTROLS = new THREE.OrbitControls(CAMERA);
    CONTROLS.screenSpacePanning = true;
}

function initAxesHelper() {
    AXESHELPER = new THREE.AxesHelper(10)
    SCENE.add(AXESHELPER)
}

function initStats() {
    STATS = new Stats();
    document.querySelector(".container").appendChild(STATS.domElement);
}

//渲染循环
function animate() {

    // cubeGr.rotation.x += 1/180*Math.PI;
    // cubeGr.rotation.y += 1/180*Math.PI;
    CONTROLS.update();
    STATS.update();
    // CAMERA.lookAt(cubeGr.position);

    RENDERER.clear();

    CAMERAHELPER.visible = false;
    RENDERER.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    RENDERER.render(SCENE, CAMERA);

    // CAMERAHELPER.visible = true;
    // RENDERER.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    // RENDERER.render(SCENE, cameraThird);

    // var dd = _getFDistance();
    // console.log(dd);

    if(EventFg){
        document.dispatchEvent(Event1);
        document.dispatchEvent(Event2);
    }
    
    // _wkPostMessage();

    requestAnimationFrame(animate);
}

// setInterval(animate, 1000 / 60);


function main() {
    // initWorker();
    initScene();
    initCamera();
    initRender();
    initLight();
    initContr();
    initStats();
    initAxesHelper();
    _createModel();
    _getCameraPosition();
    _initEvent();
    animate();
}

main();

function _createSky() {
    var path = "/assets/images/sunnysky/"; //设置路径
    var format = '.jpg'; //设定格式
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var textureCube = new THREE.CubeTextureLoader().load(urls);

    SCENE.background = textureCube; //作为背景贴图
}

function _createModel() {
    cubeGr = new THREE.Group();
    cubeGr.name = 'root_test';
    SCENE.add(cubeGr);
    let k = 0,
        z = 0;
    for (let j = 0; j < LEN_H; j++) {
        var homeGr = new THREE.Group();
        homeGr.name = `${j}_h`;

        for (let i = 0; i < LEN_F; i++) {
            var floorGr = _createFloor(8 * i, `${j}_${i}_f`);
            homeGr.add(floorGr);
        }
        homeGr.scale.set(0.5, 0.5, 0.5);
        homeGr.position.set(30 * k - 90, 0, z * 20 - 140);
        if (j % 9 == 0) {
            k++;
            z = 0;
        }
        z++;

        cubeGr.add(homeGr);
    }

    console.log(cubeGr);

}

function _createFloor(height, name) {

    var floorGr = new THREE.Group();
    floorGr.name = name;

    var loader = new THREE.GLTFLoader();
    var path = '/assets/models/turn0_1/default.gltf';
    loader.load(path, function (gltf) {
        floorGr.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });

    floorGr.position.y = height;

    return floorGr;
}

function _createFloorIn(floorGrName,isShow) {
    console.log(floorGrName);
    var floorGr = cubeGr.getObjectByName(floorGrName);

    var loader = new THREE.GLTFLoader();
    var path = '/assets/models/turn1_1/default.gltf';
    loader.load(path, function (gltf) {
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        for (let j = 0; j < 7; j++) {
            for (let i = 0; i < 52; i++) {
                let tempSofa = gltf.scene.clone();
                tempSofa.position.set((-17 + i / 1.5), 0, -6 + j * 2);
                tempSofa.visible = isShow;
                floorGr.add(tempSofa);
            }
        }
    }, undefined, function (e) {
        console.error(e);
    });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn2_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.2, 0.2, 0.2);
    //     for (let i = 0; i < 4; i++) {
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((-15 + i * 2), 1, -2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn3_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.5, 0.5, 0.5);
    //     for (let i = 0; i < 4; i++) {
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((-7 + i * 2), 1, -2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn4_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.2, 0.2, 0.2);
    //     for (let i = 0; i < 4; i++) {
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((1 + i * 2), 1, -2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn5_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.5, 0.5, 0.5);
    //     for (let i = 0; i < 4; i++) {
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((9 + i * 2), 1, -2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn6_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(60, 60, 60);
    //     for (let i = 0; i < 16; i++) {
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((-15 + i * 2), 1, 2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });
}

function _getCameraPosition() {
    var i = 0;
    var j = 0;
    document.querySelector(".demo-btn").addEventListener('click', () => {
        console.log("camera position >", CAMERA.position);
        console.log("camera rotation >", CAMERA.rotation);
        // _deleteGroup(`${i}_h`);
        _testDelModel(j);
        j = 0;
        console.log(RENDERER.info, j);
    });

    document.querySelector(".demo-add-btn").addEventListener('click', () => {
        _testAddModel(j);
        j++;
        console.log(RENDERER.info, j);
    });

    document.querySelector(".demo-one-btn").addEventListener('click', () => {
        EventFg = false;
        for(let j=0;j<LEN_H;j++){
            for(let i=0;i<LEN_F;i++){
                _createFloorIn(`${j}_${i}_f`,true);
            }
        }
        console.log("EventFg->",EventFg);
    });
    document.querySelector(".demo-d-btn").addEventListener('click', () => {
        EventFg = true;
        console.log("EventFg->",EventFg);
    });
}

//返回最近的楼号
function _getHDistance() {
    var j = 0;
    var cPos = CAMERA.position;
    var minDistance = 0;
    for (let i = 0; i < cubeGr.children.length; i++) {
        let hi = cubeGr.getObjectByName(`${i}_h`);
        let distance = cPos.distanceTo(hi.position);
        if (i == 0) {
            minDistance = distance;
        } else {
            if (minDistance > distance) {
                j = i;
                minDistance = distance;
            }
        }
    }

    return j;
}

//返回最近楼层的最近楼层号和距离
function _getFDistance() {
    var j = _getHDistance();
    var curHGr = cubeGr.getObjectByName(`${j}_h`);
    var cPos = CAMERA.position;
    var minDistance = 0;
    var m = '';
    for (let i = 0; i < curHGr.children.length; i++) {
        let fiPos = new THREE.Vector3();
        if (i == 0) {
            let fi = curHGr.getObjectByName(`${j}_0_f`);
            fiPos.x = fi.position.x;
            fiPos.y = 4 / 2;
            fiPos.z = fi.position.z;
        } else {
            let preFi = curHGr.getObjectByName(`${j}_${i-1}_f`);
            fiPos.x = preFi.position.x;
            fiPos.y = (preFi.position.y + 9.54 + 4) / 2;
            fiPos.z = preFi.position.z;
        }

        let distance = cPos.distanceTo(fiPos);
        if (i == 0) {
            m = `${j}_${i}_f`;
            minDistance = distance;
        } else {
            if (minDistance > distance) {
                m = `${j}_${i}_f`;
                minDistance = distance;
            }
        }
    }

    return {
        fName: m,
        distance: minDistance
    };
}


//删除group
function _deleteGroup(name) {
    var group = cubeGr.getObjectByName(name);
    if (!group) return;

    for (let i = group.children.length-1; i >= 1 ; i--) {
        var childrenItem = group.children[i];
        group.remove(childrenItem);
        //删除掉所有的模型组内的mesh
        childrenItem.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                item.geometry.dispose(); //删除几何体
                item.material.dispose(); //删除材质
                item.material.map.dispose();
            }
        });

        childrenItem = null;
    }
}

function _testAddModel(j) {
    for (let i = 0; i < 30000; i++) {
        // var loader = new THREE.GLTFLoader();
        // var path = '/assets/models/turn2_1/default.gltf';
        // loader.load(path, function (gltf) {
        //     gltf.scene.name = `test_s_${i}`;
        //     SCENE.add(gltf.scene);
        //     console.log("SCENE->", SCENE);
        // }, undefined, function (e) {
        //     console.error(e);
        // });
        var redM = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        var box = new THREE.CubeGeometry(1, 1, 1);

        var cubeX = new THREE.Mesh(box, redM);
        cubeX.name = `test_s_${j}_${i}`;
        cubeX.position.set(1.5, 0, 0);
        SCENE.add(cubeX);
    }

}

function _testDelModel(j) {
    for (let m = 0; m <= j; m++) {
        for (let i = 0; i < 30000; i++) {
            var grp = SCENE.getObjectByName(`test_s_${m}_${i}`);
            if (!grp) return;
            grp.traverse(function (item) {
                if (item instanceof THREE.Mesh) {
                    item.geometry.dispose(); //删除几何体
                    item.material.dispose(); //删除材质
                }
            });
            SCENE.remove(grp);
        }
    }
}

function _floorInManager() {
    cur_floor = _getFDistance().fName;
    if (cur_floor == pre_floor) {
        return;
    }

    var f_arr = cur_floor ? cur_floor.split("_") : [];
    if (f_arr.length < 2) {
        return;
    }
    var p_arr = pre_floor ? pre_floor.split("_") : [];
    var pre_arr = [],
        cur_arr = [];
    var cur_i = _createI(f_arr[1]);
    cur_arr.push(`${f_arr[0]}_${cur_i[0]}_f`);
    cur_arr.push(`${f_arr[0]}_${cur_i[1]}_f`);
    cur_arr.push(`${f_arr[0]}_${cur_i[2]}_f`);
    if (p_arr.length >= 2) {
        let pre_i = _createI(p_arr[1]);
        pre_arr.push(`${p_arr[0]}_${pre_i[0]}_f`);
        pre_arr.push(`${p_arr[0]}_${pre_i[1]}_f`);
        pre_arr.push(`${p_arr[0]}_${pre_i[2]}_f`);
    }

    for (let i = 0; i < pre_arr.length; i++) {
        if (cur_arr.indexOf(pre_arr[i]) < 0) {
            del_arr.push(pre_arr[i]);
        }
    }

    pre_floor = cur_floor;

    add_arr.push(...cur_arr);

    for (let i = 0; i < cur_arr.length; i++) {
        let iI = cur_i.indexOf(parseInt(f_arr[1]));
        let isShow = i==iI?true:false;
        _createFloorIn(cur_arr[i],isShow);
    }

    function _createI(i) {
        i = parseInt(i);
        var temp_arr = [];
        if (i == 9) {
            temp_arr = [7, 8, 9];
        } else if (i == 0) {
            temp_arr = [0, 1, 2];
        } else {
            temp_arr = [i - 1, i, i + 1];
        }
        return temp_arr;
    }
}

function _delModelManager() {

    if (del_arr.length <= 0) {
        return;
    }

    let targetName = del_arr.shift();
    _deleteGroup(targetName);

    console.log("del-length->", del_arr.length);
}

function initWorker(){
    memoryWorker = new Worker('/js/bigScene/memory_wk.js');
}

function _wkPostMessage(){
    //cubeGr不允许传递，就算允许传递也没用，因为所有参数都是拷贝
    memoryWorker.postMessage({method: 'clear', args: [del_arr]});
}

function _initEvent(){
    Event1 = new Event('callFloorInManager', {"bubbles":false, "cancelable":false});
    Event2 = new Event('clearMemory', {"bubbles":false, "cancelable":false});
    Event2.data = {say:'hello'};

    document.addEventListener('clearMemory',function(e){
        // console.log(e);
        _delModelManager();
    });
    document.addEventListener('callFloorInManager',function(){
        _floorInManager();
    });
}