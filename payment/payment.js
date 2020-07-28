const  db = firebase.database();
var userID;

//profile attributes
var teacher_id='';
var teacher_name='';
var class_day='';
var class_hour='';
var teacher_price='';
var teacher_email='';

var bookedClassesT=[];
var bookedClassesS=[];
var availableSlots=[];
var fullDate='';


$(document).ready(function(){
    $('#pay-credit-name-err').hide();
    $('#pay-credit-email-err').hide();
    $('#pay-credit-number-err').hide();
    $('#pay-credit-cvc-err').hide();
    $('#success-payment').hide();
    get_teacher_id_from_url();
    db.ref("Users/Teachers/"+ teacher_id + "/").on("value", get_lesson_info_from_db);
    db.ref("Users/Teachers/"+ userID + "/").on("value", get_student_info_from_db);
});

function get_student_info_from_db(data){
  var student_info = data.val();
  bookedClassesS = student_info.bookedClasses;
}
function get_lesson_info_from_db(data) {
    var teacher_info  = data.val();
    teacher_price=teacher_info.lessonPrice;
    teacher_name = teacher_info.name;
    teacher_email = teacher_info.userEmail;
    bookedClassesT = teacher_info.bookedClasses;
    availableSlots = teacher_info.availableSlots;

    get_class_time_from_url();
    fill_class_data();
}

firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
  
       window.location = "../login/index.html";
    } else {
      userID = user.uid;
      console.log("this line shoud be executed once for each login");
    }
  });
  function update_db(){
    console.log("enter update_db");
            if (!bookedClassesT){
                console.log("bookedClassesT if null");
                bookedClassesT=[];
            }
            console.log("teacher booked before push:  " + bookedClassesT)
            bookedClassesT.push(fullDate);    
            console.log("teacher booked after push:  " + bookedClassesT)
                //update student
            if (!bookedClassesS){
                bookedClassesS=[];
            }
            bookedClassesS.push(fullDate);
            removeSlot(fullDate);
            console.log("teacher booked   " + bookedClassesT)
            db.ref("Users/Teachers/"+ teacher_id + "/").update({'bookedClasses': bookedClassesT});
            db.ref("Users/Teachers/"+ userID + "/").update({'bookedClasses': bookedClassesS});   
}
// removes the slot from the availableSlots array
function removeSlot(slot){
    const index = availableSlots.indexOf(slot);
    console.log("index slot   " + index);
    if (index > -1) {
      availableSlots.splice(index, 1);
      db.ref("Users/Teachers/"+ teacher_id + "/").update({'availableSlots': availableSlots});
      console.log("available slots   " + availableSlots.toString());
    } 
}
  $("#orderButton").click(function(){
    console.log("form submit attempt");
    let formName = $('#pay-credit-name-input').val().trim();
    let formEmail = $('#pay-credit-email-input').val().trim();
    let formCreditNum = $('#pay-credit-number-input').val().trim();
    let formCvc = $('#pay-credit-cvc-input').val();
    console.log ("variables are:  1"+ formCreditNum)
    let legal=true;
    
     legal = handleEmail(formEmail,legal);
     legal = handleName(formName,legal);
     legal = handleCredit(formCreditNum,legal);
     legal = handleCvc(formCvc,legal);
    
    if (!legal){
        console.log("failed form");
        return false;
    }
    update_db();
    $('#exampleModalCenter').modal('show');
  });

  $("#payment-success-ok-btn").on("click",function(event){
    window.location = "../main/main.html";
    
  });
  function get_teacher_id_from_url(){
    teacher_id = location.search.substring(0).split("=")[1];
    console.log("teacher_id from url: " + teacher_id);
  }

  function fill_class_data(){
    console.log("enter data fillllll " + teacher_name);
    document.getElementById('pay-teacher-name').innerHTML = (' ' + teacher_name.toString());
    document.getElementById('pay-teacher-email').innerHTML = (' ' + teacher_email);
    document.getElementById('pay-date').innerHTML = (' ' + class_day);
    document.getElementById('pay-time').innerHTML = (' ' + class_hour);
    document.getElementById('pay-base-price').innerHTML = (' ' + teacher_price);
    document.getElementById('pay-total-price').innerHTML = (' ' + teacher_price*1.06);
  }
  
  function get_class_time_from_url(){
    fullDate = location.search.substring(0).split("=")[2];
    if (!fullDate)
      return;
    console.log("class_day from url: " + fullDate);
    class_day =  fullDate.substring(0).split("_")[0];
    console.log("class_day from url: " + class_day);
    class_hour = fullDate.substring(0).split("-").pop();
    console.log("class_time from urllll: " + class_hour);
  }
  

  function handleName(localName,isLegal){
    if(localName=='' || localName==null )
    { 
        $('#pay-credit-name-err').html('<span class="err">-name is empty!-</span>');
        $('#pay-credit-name-err').show();
        isLegal=false;
        console.log("failed form email");
    }else{
      $('#name-err').hide();
    }
    return isLegal;
  }

  function handleEmail(localEmail,isLegal){
    if(validateEmail(localEmail)==false || localEmail=='' || localEmail==null )
    { 
        $('#pay-credit-email-err').html('<span class="err">-Please fill a valid email-</span>')
        $('#pay-credit-email-err').show();
        isLegal=false;
        console.log("failed form email");
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
        console.log("failed form credit");
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
        console.log("failed form cvc");
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

