//INFO DEL CANVA
const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');
canvas.width=448;
canvas.height=400;
//VARIABLES DE LA PELOTA
const ballRadius=4;
let x=canvas.width/2;
let y=canvas.height-30;
let dx=2;
let dy=-2;
//VARIABLES DEL PADDLE
const paddleHeight=5;
const paddleWidth=50;
let paddleX=(canvas.width-paddleWidth)/2;
const paddleY=(canvas.height-paddleHeight*2);
let rightPressed=false;
let leftPressed=false;
//VARIABLES DE LADRILLOS
const brickRowCount=15;
const brickColumnCount=14;
const brickHeight=14;
const brickWidth=30;
const brickPadding=0.5;
const brickOffsetTop=20;
const brickOffsetLeft=12;
const bricks=[];
const BRICK_STATUS={
    ACTIVE:1,
    DESTROYED:0
}
for(let c=0;c<brickColumnCount;c++){
    bricks[c]=[];
    for(let r=0;r<brickRowCount;r++){
        const brickX=c*(brickWidth+brickPadding)+brickOffsetLeft;
        const brickY=r*(brickHeight+brickPadding)+brickOffsetTop;
        bricks[c][r]={x:brickX,y:brickY,satatus:BRICK_STATUS}
    }
}
//FUNCIONES
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle='#28cc12';
    ctx.fill();
    ctx.closePath();
}
function drawPaddle(){
    ctx.beginPath();
    ctx.fillStyle='#28cc12';
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}
function drawBrick(){
    for(let c=0;c<brickColumnCount;c++){
        for(let r=0;r<brickRowCount;r++){
            const currentBrick=bricks[c][r];
            if(currentBrick.satatus===BRICK_STATUS.DESTROYED)continue;
            ctx.beginPath();
            ctx.fillStyle='red';
            ctx.strokeStyle='#1eff00';
            ctx.rect(currentBrick.x, currentBrick.y, brickWidth, brickHeight);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }   
}
let count=0;
function collisionDetection(){
    for(let c=0;c<brickColumnCount;c++){
        for(let r=0;r<brickRowCount;r++){
            const currentBrick=bricks[c][r];
            if(currentBrick.satatus===BRICK_STATUS.DESTROYED)continue;
            if(x>currentBrick.x&&x<currentBrick.x+brickWidth&&y>currentBrick.y&&y<currentBrick.y+brickHeight){
                count++;
                console.log(count);
                dy=-dy;
                if(count%10===0){
                    dy*=1.05;
                    dx*=1.05;
                    console.log(dy,dx);
                }
                currentBrick.satatus=BRICK_STATUS.DESTROYED;
            }
        }
    }   
}
function ballMovement(){
    if(x+dx>canvas.width-ballRadius||x+dx<ballRadius){//SI TOCA A LOS COSTADOS
        dx=-dx;
    }
    if(y+dy<ballRadius){//SI TOCA ARRIBA
        dy=-dy;  
    }
    if(x>paddleX&&x<paddleX+paddleWidth&&y+dy>paddleY-paddleHeight+ballRadius){
       dy=-dy; 
    }else if(y+dy>canvas.height+ballRadius){//SI SE VA PARA ABAJO
        document.location.reload();
    }
    
    x+=dx;
    y+=dy;
}
function paddleMovement(){
    if(rightPressed&&paddleX<canvas.width-paddleWidth){
        paddleX+=paddleWidth/10;
    }else if(leftPressed&&paddleX>0){
        paddleX-=paddleWidth/10;
    }
}
function initEvents(){
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup',keyUpHandler);
    function keyDownHandler(e){
        const {key}=e;
        if(key==='Right'||key==='ArrowRight'){
            rightPressed=true;  
        }else if(key==='Left'||key==='ArrowLeft'){
            leftPressed=true;
        }
        
    }
    function keyUpHandler(e){
        const {key}=e;
        if(key==='Right'||key==='ArrowRight'){
            rightPressed=false;  
        }else if(key==='Left'||key==='ArrowLeft'){
            leftPressed=false;
        }
        
    }
}
function cleanCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
function draw(){
    cleanCanvas();
    drawBall();
    drawPaddle();
    drawBrick();
    collisionDetection();
    ballMovement();
    paddleMovement();
    window.requestAnimationFrame(draw);//"RECURSIVIDAD" POR FRAME
}
draw();
initEvents();1