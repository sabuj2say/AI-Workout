let video;
let posenet;
let pose;
let skeleton;
let ai;

let posesArray = ['V', 'W', 'T', 'U'];
var imgArray = new Array();


var poseImage;
var targetLabel;
var errorCounter;
var iterationCounter;
var poseCounter;
var target;
var timeLeft;


imgArray[0] = new Image();
imgArray[0].src = 'images/pose1.png';
imgArray[1] = new Image();
imgArray[1].src = 'images/pose2.png';
imgArray[2] = new Image();
imgArray[2].src = 'images/pose3.png';
imgArray[3] = new Image();
imgArray[3].src = 'images/pose4.png';









function setup() {
	let canvas= createCanvas(640, 480);
	canvas.position(30,150);
	video = createCapture(VIDEO);
	video.size(640, 480);
  	video.volume(0);
	video.hide();
	posenet= ml5.poseNet(video,modelLoaded);
	posenet.on('pose',poseRecived);


	poseCounter = 0;
	targetLabel = 'V';
	target = posesArray[poseCounter];
	document.getElementById("poseName").textContent = target;
	timeLeft = 05;
	document.getElementById("zeit").textContent = "00:0" + timeLeft;
	errorCounter = 0;
	iterationCounter = 0;
	document.getElementById("poseImg").src = imgArray[poseCounter].src;



	function modelLoaded() {
		console.log('Posenet Ready');
	}





	
	function poseRecived(poses) {
		if (poses.length >0 ) {
			pose= poses[0].pose;
			skeleton = poses[0].skeleton;
		}
	}



	let options = {
		inputs: 34,
		outputs: 4,
		task: "classification",
		debug: true
	  }
	

	const modelDetails = {
		model: 'model/model.json',
		metadata: 'model/model_meta.json',
		weights: 'model/model.weights.bin'
	}


	ai= ml5.neuralNetwork(options);
	ai.load(modelDetails, nnlLoaded);

}


	function nnlLoaded() {
		console.log('Pose classification Ready');
		classifyPose();
	}




	
	function classifyPose() {
		if (pose){
				let inputs =[];
				for (var i = 0; i <pose.keypoints.length;  i++) {
			 		let x= pose.keypoints[i].position.x;
			 		let y= pose.keypoints[i].position.y;
			 		inputs.push(x);
        			inputs.push(y);      										
      			}
		
     		 ai.classify(inputs,gotResults);
		} 
		else {
			setTimeout(classifyPose,100);
		}

	}



	
	function gotResults(error, results) {
		//document.getElementById("welldone").textContent = "";
		//document.getElementById("sparkles").style.display = "none";
		if (results[0].confidence > 0.80) {
		  	if (results[0].label == targetLabel){
				iterationCounter = iterationCounter + 1;
				console.log(results[0].label);
				console.log(results[0].confidence);
				console.log(iterationCounter);

			
				if (iterationCounter == 5) {
			  		console.log("30!")
			  		iterationCounter = 0;
			  		nextPose();
				}
				else{
			  		console.log("doin this")
			  		timeLeft = timeLeft - 1;
					document.getElementById("zeit").textContent = "00:0" + timeLeft;
			  		setTimeout(classifyPose, 1000);
				}
			}

		  else{
				errorCounter = errorCounter + 1;
				console.log("errorCounter");
				if (errorCounter >= 5){
			 		console.log("Five errors");
			  		iterationCounter = 0;
			 		timeLeft = 5;			
			 		document.getElementById("zeit").textContent = "00:0" + timeLeft;
			  		errorCounter = 0;
			  		setTimeout(classifyPose, 100);
				}
				else{
					iterationCounter = 0;
			 		timeLeft = 5;			
			 		document.getElementById("zeit").textContent = "00:0" + timeLeft;
			  		errorCounter = 0;
			  		setTimeout(classifyPose, 100);
				}
			}
		}

	    else{
		  console.log("Bad confidence level")
		  setTimeout(classifyPose, 100);
	    }
	
	}
	  





	
	function nextPose(){
		if (poseCounter >= 3) {
	  		console.log("Well done, you have learnt all poses!");
	  		document.getElementById("extra1").innerHTML = "Amazing! All poses done.<br /> Refresh page to do again";
			document.getElementById("extra").style.display ='None';
			document.getElementById("zeit").textContent = "";
			document.getElementById("poseName").textContent= '';
			document.getElementById("nName").textContent= '';
			document.getElementById("poseImg").style.display = "none";
			
	  		//document.getElementById("welldone").textContent = "All poses done.";
	  		//document.getElementById("sparkles").style.display = 'block';
		}
		else{
	  		errorCounter = 0;
	 		iterationCounter = 0;
	 		poseCounter = poseCounter + 1;
	  		targetLabel = posesArray[poseCounter];
	 		console.log("next pose target label" + targetLabel)
	  		target = posesArray[poseCounter];
	  		document.getElementById("poseName").textContent = target;
			document.getElementById("poseImg").src = imgArray[poseCounter].src;
	  		console.log("classifying again");
	  		timeLeft = 05;
	  		document.getElementById("zeit").textContent = "00:0" + timeLeft;
	  		setTimeout(classifyPose, 4000)
		}
  	}



	function draw() {
		image(video,20,20);
		translate(video.width,0);
		scale(-1,1);
		image(video,0,0,video.width,video.height);
	
		if (pose) {
			for (let i = 0; i < skeleton.length; i++) {
			  let a = skeleton[i][0];
			  let b = skeleton[i][1];
			  strokeWeight(8);
			  stroke(0, 255, 0);
			  line(a.position.x, a.position.y, b.position.x, b.position.y);
			}
		}
		
	}


	


