let video;
let posenet;
let pose;
let skeleton;
let targetLabel;

let ai;
let state = "waiting";


function keyPressed() {
 if (key == 's') {
    ai.saveData();
  } 
  
  else if (key=='n') {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('collecting');
      state = 'collecting';
      },100);
  }

  else if (key=='v') {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('collecting');
      state = 'collecting';
      },100);
  }


  else if (key=='w') {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('collecting');
      state = 'collecting';
      },100);
  }

  else if (key=='t') {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('collecting');
      state = 'collecting';
      },100);
  }

  else if (key=='u') {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('collecting');
      state = 'collecting';
      },100);
  }
  
  else if (key == 'h') {
    targetLabel =key;
    console.log(targetLabel);
    console.log('not collecting');
    state = 'waiting';
    
  }

}

let options = {
    inputs: 34,
    outputs: 5,
    task: "classification",
    debug: true
  }
ai= ml5.neuralNetwork(options);

function setup() {
	createCanvas(720, 480);
	video = createVideo("data/VWTU.mp4");
	video.size(720, 480);
  video.volume(0);
  video.loop();
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
			 fill(0,255,0);
			 ellipse(pose.keypoints[i].position.x,pose.keypoints[i].position.y,40);
			 inputs.push(x);
       inputs.push(y);

				}
		 
		 let target = [targetLabel];
     ai.addData(inputs, target);
		}
     }
}


function draw() {
	background(220);
  let img = video.get();
  image(img, 0, 0);

	if (pose) {

		for (var i = 0; i <pose.keypoints.length;  i++) {
			 ellipse(pose.keypoints[i].position.x,pose.keypoints[i].position.y,5);
		}
    	for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0];
          let b = skeleton[i][1];
          strokeWeight(8);
          stroke(0, 255, 0);
          line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    }
	
}



