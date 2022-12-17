let ai;

let options = {
       inputs: 34,
       outputs: 4,
       task: "classification",
       debug: true
  }

ai= ml5.neuralNetwork(options);
ai.loadData("label.json", dataReady);


function dataReady(){
	
  ai.normalizeData();
  ai.train({epochs: 10}, finished); 
}

function finished() {
  console.log('model trained');
  ai.save();
}
