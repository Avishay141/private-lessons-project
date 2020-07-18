 
const  db = firebase.database().ref();


$("#sbmt").on("click",function(){

	
	var email = $("#email").val();
	var password = $("#Password1").val();
	var userType = $('input[name=userTypeRadios]:checked').val();
	//alert("email:"+email+" pass:"+password+ " type:"+userType);
	var verify = $("#Password2").val();


	if(verify != password){
		alert("wrong password verification");
		return;
	} 

  // var userID =  email.split(".").join("*");
  //
  //
  //
  // var path = "Users/"+ userType +"s/" + userID;
  //  console.log("db path: " + path);
  //  //var db = firebase.database().ref();
  //  db.child(path).set({
  //    userEmail: email,
  //    userType: userType
  //  }).catch(function(error){
  //    console.log("Error ocurred: ", error);
  //  });




  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      //Registration is successful
      var user = firebase.auth().currentUser;
      var userID = user.uid;

      var path = "Users/"+ userType +"s/" + userID;
       console.log("db path: " + path);
       //var db = firebase.database().ref();
       db.child(path).set({
         userEmail: email,
         userType: userType
       }).catch(function(error){
         console.log("Error ocurred: ", error);
       });
      console.log("user created successfuly");



       }).catch(e => console.log(e.message));

    $("#email").val('');
    $("#Password1").val('');
    $("#Password2").val('');
  });

     
    

