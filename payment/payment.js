const  db = firebase.database();
var userID;

//profile attributes
var name ="";
var about_me ="";
var languages_I_teach = [];
var also_speak = [];
var homeCountry ="";
var lessonPrice="";
var availableSlots =[];
var skype_id ="";
var userEmail="";



$(document).ready(function(){
    $('#pay-credit-name-err').hide();
    $('#pay-credit-email-err').hide();
    $('#pay-credit-number-err').hide();
    $('#pay-credit-cvc-err').hide();
});


firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
  
       window.location = "../login/index.html";
    } else {
      userID = user.uid;
      console.log("this line shoud be executed once for each login");
    }
  });

  
  db.ref("Users/Teachers/"+ userID + "/").on("value", get_profile_info_from_db);
  
function get_profile_info_from_db(data){
    console.log("enter get_profile_info_from_db @@@@@@@");
    console.log("userID: " + userID);
    // var teachers = data.val();
    // var current_teacher = teachers[userID];
    var current_teacher = data.val();
    console.log("current_teacher: " + current_teacher);
    var keys = Object.keys(current_teacher);
  
    console.log("keys: " + keys);
  
    name = current_teacher['name'];
    about_me = current_teacher['aboutMe'];
    skype_id = current_teacher['skypeID'];
    homeCountry = current_teacher['homeCountry'];
    lessonPrice = current_teacher['lessonPrice'];
    languages_I_teach = current_teacher['languages_I_teach'];
    also_speak = current_teacher['alsoSpeak'];
    availableSlots = current_teacher['availableSlots'];
    userEmail =current_teacher['userEmail'];
  
  
     fix_undefined_variavles();
  
    $("#homeCountry").val(homeCountry);
    document.getElementById("name_val").innerHTML  = name;
    document.getElementById("homeCountry_val").innerHTML  = homeCountry;
    document.getElementById("languages_I_teach_val").innerHTML  = languages_I_teach;
    document.getElementById("also_speak_val").innerHTML = also_speak;
    document.getElementById("lessonPrice_val").innerHTML = lessonPrice;
    document.getElementById("about_me_val").innerHTML = about_me;
    document.getElementById("skype_id_val").innerHTML = skype_id;
    document.getElementById("email_val").innerHTML = userEmail;
    
  }


  function fix_undefined_variavles(){
    if(!languages_I_teach)
        languages_I_teach = [];
  
    if(!also_speak)
        also_speak = [];
  
    if(!homeCountry)
          homeCountry ="";
  
    if(!availableSlots)
          availableSlots = [];
  
    if(!skype_id)
          skype_id ="";
  
    if(!name)
            name ="";
    if(!about_me)
          about_me ="";
    if(!lessonPrice)
            lessonPrice ="";
  
  }
  

  $("#orderButton").click(function(){
    console.log("form submit attempt");
    let formName = $('#pay-credit-name-input').val().trim();
    let formEmail = $('#pay-credit-email-input').val().trim();
    let formCreditNum = $('#pay-credit-number-input').val().trim();
    let formCvc = $('#pay-credit-cvc-input').val();
    console.log ("variables are:  1"+ formCreditNum)
    let legal=true;

    if(formName=='')
    { 
        $('#pay-credit-name-err').html('<span class="err">-name is empty!-</span>');
        $('#pay-credit-name-err').show();
        legal=false;
    }else{
      $('#name-err').hide();
    }
    legal = handleEmail(formEmail,legal);
    legal = handleCredit(formCreditNum,legal);
    legal = handleCvc(formCvc,legal);
  });

  function handleEmail(localEmail,isLegal){
    if(validateEmail(localEmail)==false || localEmail=='' || localEmail==null )
    { 
        $('#pay-credit-email-err').html('<span class="err">-Please fill a valid email-</span>')
        $('#pay-credit-email-err').show();
        isLegal=false;
    }else{
       $('#pay-credit-email-err').hide();
    }
    return isLegal;
  }
  function handleCredit(localCredit,isLegal){
    if(validateCredit(localCredit)==false || localCredit=='' || localCredit==null )
    { 
        $('#pay-credit-number-err').html('<span class="err">-Please fill a valid credit card (numerics only) -</span>')
        $('#pay-credit-number-err').show();
        isLegal=false;
    }else{
        $('#pay-credit-number-err').hide();
   }
    return isLegal;
  }
  function handleCvc(localCvc,isLegal){
    if(validateCvc(localCvc)==false || localCvc=='' || localCvc==null )
    { 
        $('#pay-credit-cvc-err').html('<span class="err">-Please fill a valid CVC-</span>')
        $('#pay-credit-cvc-err').show();
        isLegal=false;
    }else{
        $('#pay-credit-cvc-err').hide();
   }
    return isLegal;
  }

  function validateEmail($email) {
    console.log ("enter validate email with: "+ $email)
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
  }

  function validateCredit(num) {
    console.log ("enter validate credit with: "+ num)
    var i;
    if (num.length!=16)
        return false;
    for (i=0;i<num.length;i++){
        if (num[i]<'0'||num[i]>'9')
            return false;
    }
    return true;
  }
  function validateCvc(num) {
    console.log ("enter validate cvc with: "+ num)
    var i;
    if (num.length!=3)
        return false;
    for (i=0;i<num.length;i++){
        if (num[i]<'0'||num[i]>'9')
            return false;
    }
    return true;
  }
