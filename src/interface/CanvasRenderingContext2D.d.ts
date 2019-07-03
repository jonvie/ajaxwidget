interface point{}

interface CanvasRenderingContext2D{
    clearArc(step:number,x:number,y:number,r:number):void;
    getArcXY(o:point,r: number, angle: number):point;
    getAngleXY(o:point,r: number, angle: number):point;
    drawRound(o:point, r: number,fill:boolean,line:boolean): void;
    drawArc(o:point, r: number,sAngle:number,eAngle:number):void;

}