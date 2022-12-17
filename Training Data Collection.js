let video;
let posenet;
let pose;
let skeleton;
let targetLabel;

let ai;
let state = "waiting";



function keyPressed() {
	if (key == 'S') {
	   ai.saveData();
	 } else {
		targetLabel = key;
	   console.log(targetLabel);
	   setTimeout(function() {
		 console.log('collecting');
		 state = 'collecting';
		 setTimeout(function() {
		   console.log('not collecting');
		   state = 'waiting';
		 }, 20000);
	   }, 5000);
	 }
   }


let options = {
    inputs: 34,
    outputs: 4,
    task: "classification",
    debug: true
  }
ai= ml5.neuralNetwork(options);

function setup() {
	createCanvas(640, 480);
	video = createCapture(VIDEO);
	video.size(640, 480);
  	video.volume(0);
	video.hide();
	posenet= ml5.poseNet(video,modelLoaded);
	posenet.on('pose', poseRecived);
}

function modelLoaded() {
	console.log('Model Ready')
}



function poseRecived(poses) {
	if (poses.length >0 ) {
		pose= poses[0].pose;
		skeleton = poses[0].skeleton;
		if (state == 'collecting') {
		  let inputs =[];
		  for (var i = 0; i <pose.keypoints.length;  i++) {
			 let x= pose.keypoints[i].position.x;
			 let y= pose.keypoints[i].position.y;
			 //fill(0,255,0);
			 //ellipse(pose.keypoints[i].position.x,pose.keypoints[i].position.y,40);
			 inputs.push(x);
        	 inputs.push(y);

				}
		 
		 let target = [targetLabel];
         ai.addData(inputs, target);
		}
     }
}


function draw() {
	image(video,20,20);
	translate(video.width,0);
	scale(-1,1);
	image(video,0,0,video.width,video.height);

	if (pose) {

		/*
		for (var i = 0; i <pose.keypoints.length;  i++) {
			 ellipse(pose.keypoints[i].position.x,pose.keypoints[i].position.y,5);
		}
		*/
    	for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0];
          let b = skeleton[i][1];
          strokeWeight(8);
          stroke(0, 255, 0);
          line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    }
	
}



