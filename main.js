const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=150;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
  for(let i=0;i<cars.length;i++){
  cars[i].brain=JSON.parse(
    localStorage.getItem("bestBrain"));
    if(i!=0){
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}


const traffic = [
  new Car(road.getLaneCenter(1), -100,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -300,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -300,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -500,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -500,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -700,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -700,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -1100,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -1100,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -1400,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -1600,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -1700,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -1850,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -1900,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -2000,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -2150,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -2200,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -2270,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -2300,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -2470,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -2520,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -2570,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(1), -2700,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -2770,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -2820,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -2870,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(2), -2970,30,50, "DUMMY", 2,getRandomColor()),
  new Car(road.getLaneCenter(0), -2940,30,50, "DUMMY", 2.2,getRandomColor()),
  new Car(road.getLaneCenter(1), -3100,30,50, "DUMMY", 2.1,getRandomColor()),
  new Car(road.getLaneCenter(2), -3370,30,50, "DUMMY", 2.2,getRandomColor()),
  new Car(road.getLaneCenter(0), -3350,30,50, "DUMMY", 2.3,getRandomColor()),
  new Car(road.getLaneCenter(1), -3570,30,50, "DUMMY", 2.2,getRandomColor()),
  new Car(road.getLaneCenter(0), -3670,30,50, "DUMMY", 2.2,getRandomColor()),
  new Car(road.getLaneCenter(0), -3800,30,50, "DUMMY", 2.1,getRandomColor()),
  new Car(road.getLaneCenter(0), -3870,30,50, "DUMMY", 2.4,getRandomColor()),
  new Car(road.getLaneCenter(1), -3890,30,50, "DUMMY", 2.4,getRandomColor()),
  new Car(road.getLaneCenter(0), -4100,30,50, "DUMMY", 2.4,getRandomColor()),
  new Car(road.getLaneCenter(2), -4220,30,50, "DUMMY", 2.4,getRandomColor()),
  new Car(road.getLaneCenter(0), -4200,30,50, "DUMMY", 2.4,getRandomColor()),
  new Car(road.getLaneCenter(1), -4220,30,50, "DUMMY", 2.5,getRandomColor()),
  new Car(road.getLaneCenter(2), -4230,30,50, "DUMMY", 2.5,getRandomColor()),
  new Car(road.getLaneCenter(2), -4300,30,50, "DUMMY", 2.5,getRandomColor())
];


animate();

function save(){
  localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain)
  );
}

function discard(){
  localStorage.removeItem("bestBrain");
}

function generateCars(N){
  const cars=[];
  for(let i=1;i<=N;i++){
    cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
  }
  return cars;
}

function animate(time){
  for(let i=0;i<traffic.length;i++){
    traffic[i].update(road.borders,[]);
  }
  for(let i=0;i<cars.length;i++){
    cars[i].update(road.borders,traffic);
  }

  bestCar=cars.find(
    c=>c.y==Math.min(
      ...cars.map(c=>c.y)
    )
  );
  
  carCanvas.height=window.innerHeight;
  networkCanvas.height=window.innerHeight;

  carCtx.save();
  carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
  road.draw(carCtx);
  for(let i=0;i<traffic.length;i++){
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha=0.2;

  for(let i=0;i<cars.length;i++){
    cars[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha=1;
  bestCar.draw(carCtx, "blue",true);
  carCtx.restore();

  networkCtx.lineDashOffset=-time/50;
  Visualizer.drawNetwork(networkCtx,bestCar.brain);
  requestAnimationFrame(animate);
}

