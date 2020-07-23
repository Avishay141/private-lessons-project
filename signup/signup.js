
const  db = firebase.database().ref();


$("#sbmt").on("click",function(){


 var email = $("#email").val();
 var password = $("#Password1").val();
 var userType = $('input[name=userTypeRadios]:checked').val();
 //alert("email:"+email+" pass:"+password+ " type:"+userType);
 var verify = $("#Password2").val();
var skype_id = $("#skype_id").val();

 if(verify != password){
	 alert("wrong password verification");
	 return;
 }

var user_created_successfully = false;




 firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
		 //Registration is successful
		 user_created_successfully = true;
		 console.log("begin: " + user_created_successfully);
		 var user = firebase.auth().currentUser;
		 var userID = user.uid;

		 var path = "Users/"+ userType +"s/" + userID;
			console.log("db path: " + path);
			//var db = firebase.database().ref();
			db.child(path).set({
				userEmail: email,
				userType: userType,
				skypeID: skype_id
			}).catch(function(error){
				console.log("Error ocurred: ", error);
			});

			console.log("end: " + user_created_successfully);
			if(user_created_successfully){
				console.log("user created successfuly");
				$('h3').append("user created successfuly");
				window.location = "../main/main.html?uid="+userID;
			}


			}).catch(e => 	$('h2').append(e.message));




	 // $("#email").val('');
	 // $("#Password1").val('');
	 // $("#Password2").val('');
 });
