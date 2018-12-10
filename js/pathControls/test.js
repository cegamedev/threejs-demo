class Node {
    constructor(data) {
        this.data = data;
        this.parent = null;
        this.children = [];
    }
    getNodeByData(data) {
        // var scope = this;
        // if (scope.data == data) {
        //     return scope;
        // } else {
        //     var targetNode = null;
        //     for (let i = 0; i < scope.children.length; i++) {
        //         if (scope.children[i].data == data) {
        //             return scope.children[i];
        //         } else {
        //             targetNode = scope.children[i].getNodeByData(data);
        //         }
        //     }
        //     return targetNode;
        // }

        var scope = this;
        if (scope.data == data) {
            return scope;
        } else {
            var targetNode = null;
            for (let i = 0; i < scope.children.length; i++) {
                targetNode = scope.children[i].getNodeByData(data);
                if(targetNode && targetNode.data == data){
                    return targetNode;
                }
            }
            
        }
    }
    getUpRoadByNode(node) {
        var roadList = [];
        while (node) {
            roadList.unshift(node.data);
            node = node.parent;
        }
        return roadList;
    }
    isInParents(node,data){
        while(node){
            if(node.parent.data == data){
                return true;
            }
            else {
                node = node.parent;
            }
        }
        return false;
    }
}

function createTree() {
    while (nodeList.length > 0) {
        var curNode = nodeList.shift();
        if (curNode == endI) {
            continue;
        }
        var node = tree.getNodeByData(curNode);
        for (let j = 0; j < weightMap[curNode].length; j++) {
            if (weightMap[curNode][j] > 0 && !node.isInParents(node,j)) {
                nodeList.push(j);
                var child = new Node(j);
                child.parent = node;
                node.children.push(child);
            }
        }

    }
}

function getShortRoad() {
    var roadList = [];
    var node = tree.getNodeByData(0);
    while (node) {
        roadList.push(tree.getUpRoadByNode(node));
        node.data = -1;
        node = tree.getNodeByData(0);
    }
    console.log(roadList);

    var minIndex = 0;
    var minLen = 0;
    for(let i=0;i<roadList.length;i++){
        var row = roadList[i];
        var totalLen = 0;
        for(let j=0;j<row.length-1;j++){
            var len = weightMap[row[j]][row[j+1]];
            totalLen += len;
        }
        if(i==0 || totalLen < minLen){
            minLen = totalLen;
            minIndex = i;
        }
    }

    console.log(minIndex,minLen);
}

function test() {

    var node = new Node(3);
    var child = new Node(2);
    child.parent = node;
    node.children.push(child);

    node = node.children[0];
    child = new Node(0);
    child.parent = node;
    node.children.push(child);
    child = new Node(1);
    child.parent = node;
    node.children.push(child);

    // console.log(node);
    console.log(node.getNodeByData(1));


}
// test();


var weightMap = [
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [12, 1, 0, 1],
    [0, 0, 1, 0]
]

var startI = 3;
var endI = 0;
var nodeList = [];
nodeList.push(startI);
var tree = new Node(startI);
createTree();
// console.log(tree);
// var node = tree.getNodeByData(0);
// console.log(node);
// console.log(tree.getUpRoadByNode(node));
// node.data = -1;
// var node = tree.getNodeByData(0);
// console.log(node);
// console.log(tree.getUpRoadByNode(node));
getShortRoad();