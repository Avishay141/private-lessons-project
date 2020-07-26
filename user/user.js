

const  db = firebase.database().ref();
var userID = get_userID_from_url();
var email ="";
var skypeID ="";
//alert(userId);
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     window.location = "../login/index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});


console.log("userID: " +userID);
var student_path = "Users/Students/" + userID +"/";
console.log("student_path: " +student_path);

db.ref(student_path).on("value", getInfo);







$("#updt").click(function(){
  //block of code that runs when the click event triggers
	firebase.database().ref(student_path).set({
    userEmail: email,
    skypeID: skypeID
  });

});





function getInfo(data) {
	console.log("enter get_profile_info_from_db @@@@@@@");
  console.log("userID: " + userID);
  // var teachers = data.val();
  // var current_teacher = teachers[userID];
  var current_user = data.val();
  console.log("current_teacher: " + current_user);
  var keys = Object.keys(current_user);

  console.log("keys: " + keys);

  email = current_user['userEmail'];
  
  skypeID = current_user['skypeID'];
  


   


  document.getElementById("email").value = email;
  document.getElementById("skype_id").value = skypeID;
 




}

function get_userID_from_url(){
  var res = location.search.substring(1).split("=")[1];
  console.log("userID from url: " + res);
  return res;
}
