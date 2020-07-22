

// athounivation methods
const  db = firebase.database().ref();

$("#login_btn").on("click",function(){
  var email = $(".Email_input").val();
  var password = $(".Password_input").val();
  const auth = firebase.auth();
  var res = auth.signInWithEmailAndPassword(email, password);
  res.catch(e => console.log(e.message));


});



$("#sign_up_btn").on("click",function(){

     window.location = "../signup/index.html";

  });




$("#forgot_btn").on("click",function(){
  var auth = firebase.auth();
  var email = $(".Email_input").val();

  auth.sendPasswordResetEmail(email).then(function() {
    // Email sent.
  }).catch(function(error) {
    // An error happened.
  });
});




firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("!!!!!!!!!: " + user.uid)
    window.location = "../main/main.html?uid="+user.uid;
  } else {
    console.log("User hasn't logged in yet");
  }
});



// ---- Firebase function ------

//###################################################
