class MovePath{
    constructor({target,path,offsetY=10,speed=1,endCall,changeCall}){
        this.target = target;
        this.path = path;
        this.offsetY = offsetY;
        this.speed = speed;
        this.endCall = endCall;
        this.changeCall = changeCall;

        this.aniId = null;
        this.targetInfo = {
            pos:{...target.position},
            rot:{...target.rotation}
        };
    }
    start(){
        var scope = this;
        
    }
    stop(){

    }

}

function _animate(){
    var scope = this;

    scope.aniId = requestAnimationFrame(_animate);
}