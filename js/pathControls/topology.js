class Topology {
    constructor(THREE, scene, dotWith=2) {
        this.vectors = []; //顶点集合
        this.weightMap = [
            []
        ]; //边集合，二维数组，值代表权值

        this.THREE = THREE;
        this.scene = scene;
        this.dotWith = dotWith;
        this.topology = new THREE.Group();
        this.topology.name = "topology";
        this.topologyDot = new THREE.Group();
        this.topologyDot.name = "topologyDot";
        this.debug = true;
    }
    create(vectors, lineMap) {
        this.vectors = vectors;
        this.weightMap = _line2Weight.call(this, vectors, lineMap);
    }
    show(showPoint = true) {
        var scope = this;

    }
    showByVectors(vectors, showPoint = true) {
        var scope = this;
        if(vectors.length<2){
            return;
        }
        scope.topology = new THREE.Group();
        scope.topology.name = "topology";
        scope.topologyDot = new THREE.Group();
        scope.topologyDot.name = "topologyDot";

        var geometry = new scope.THREE.Geometry();
        geometry.vertices = vectors;
        var material = new scope.THREE.LineBasicMaterial({
            color: 0x00ff00,
        });
        var line = new scope.THREE.Line(geometry, material);
        scope.topology.add(line);
        scope.scene.add(scope.topology);

        if(showPoint){
            for(let i=0;i<vectors.length;i++){
                // var dot = _createSpriteShape.call(scope,scope.dotWith);
                var dot = _createSpriteText.call(scope,i);
                dot.position.copy(vectors[i]);
                scope.topologyDot.add(dot);
            }
            scope.scene.add(scope.topologyDot);
        }
    }
    findShortPath(p1, p2, delY) {

    }
}

function _line2Weight(vectors, lineMap) {
    var weightMap = [];
    for (let i = 0; i < lineMap.length; i++) {
        var row = lineMap[i];
        var weightRow = [];
        for (let j = 0; j < row.length; j++) {
            if (row[j] > 0) {
                var p1 = vectors[i];
                var p2 = vectors[j];
                var distance = _distance3d.call(this, p1, p2);
                weightRow.push(distance);
            } else {
                weightRow.push(0);
            }
        }
        weightMap.push(weightRow);
    }
    return weightMap;
}

function _distance3d(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2) + Math.pow((p2.z - p1.z), 2));
}

function _distance2d(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.z - p1.z), 2));
}

function _createSpriteShape(w) {
    let scope = this;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = w;
    let ctx = canvas.getContext("2d");
    ctx.rect(0, 0, w, w);
    ctx.fillStyle = "#0000ff";
    ctx.fill();
    let texture = new scope.THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new scope.THREE.SpriteMaterial({
        map: texture
    });
    let mesh = new scope.THREE.Sprite(material);
    mesh.scale.set(0.25, 0.25, 1);
    return mesh;
}

function _createSpriteText(text,s=1) {
    let scope = this;
    let canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ff0000";
    ctx.font = "Bold 18px Arial";
    ctx.fillText(text,10,20);
    let texture = new scope.THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new scope.THREE.SpriteMaterial({
        map: texture
    });
    let mesh = new scope.THREE.Sprite(material);
    mesh.scale.set(3*s, 3*s, 1);
    return mesh;
}