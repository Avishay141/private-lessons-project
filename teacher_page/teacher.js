
const  db = firebase.database();

//profile attributes
var languages_I_teach = [];
var also_speak = [];
var homeCountry ="";
var dates = getDates(new Date());
var weekCalenders = initWeekCalendersObjects();
var weekCalenderIndx = 0;
var availableSlots =[];


var availableColor = "rgb(0, 153, 51)";
var notAvailablrColor = "rgb(194, 194, 163)";

build_calender();

var userID;
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     //window.location = "../login/index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});

db.ref("Users/Teachers/").on("value", get_profile_info_from_db);


/* ---------------- Buttons callbacks -------------- */

$("#logout_btn").on("click",function(){
  firebase.auth().signOut();
});

$("select.home_country").on("click", function(e) {
  homeCountry = $(this).children("option:selected").val();


});

$("#save_btn").on("click",function(){
  upadate_array_by_checkbox('teach', languages_I_teach);
  upadate_array_by_checkbox('speak', also_speak);
  console.log("languages_I_teach: " + languages_I_teach);
  console.log("also_speak: " + also_speak);
  path = "Users/Teachers/"+userID+"/";

  db.ref(path).update({'name':$(".Name").val()});
  db.ref(path).update({'homeCountry':homeCountry});
  db.ref(path).update({'languages_I_teach':languages_I_teach});
  db.ref(path).update({'alsoSpeak':also_speak});
  db.ref(path).update({'lessonPrice':$(".Lesson_price").val()});
  db.ref(path).update({'availableSlots':availableSlots});


});

$("#read").on("click",function(event){
   db.ref("Users/Teachers/").on("value", read);
});

function calender_btn_clicked(event){

  console.log("enterd calender_btn");

  console.log("id: " + $(this).attr('id'));



  var newColor = availableColor;

  if ($( this ).css( "background-color" ) == availableColor)
    newColor = notAvailablrColor;

  $(event.delegateTarget ).css( "background-color", newColor);

  var slot = $(this).attr('id');
  if(newColor == availableColor)
    availableSlots.push(slot);
  else
    removeSlot(slot);

}

$("#date_left").on("click",function(event){
  if(weekCalenderIndx == 0)
    return;
  weekCalenderIndx--;
  build_calender();

});

$("#date_right").on("click",function(event){
  if(weekCalenderIndx == 3)
    return;
  weekCalenderIndx++;

  build_calender();

});

// btn for testing only
$("#test").on("click",function(event){
  $( ".booking_calneder" ).empty();
});


$('input[name=checkbox]').change(function(){
    if($(this).is(':checked')) {
        console.log("added: " +  $(this).value.text())
    } else {
          console.log("removed: " +  $(this).val())
    }
});




/* ---------------- Service functions -------------- */

// Returns an array of dates between the two dates
function getDates(startDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  for(var i =0; i< 7; i++) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

function create2DimArray(rows, cols){
    var arr = new Array(rows);
    for(var i = 0; i< rows; i++)
      arr[i] = new Array(cols);

    for(var i =0; i <rows; i++ )
      for(var j =0; j <cols; j++)
        arr[i][j] = false;

    return arr;
}

function build_calender(){
  console.log("enterd build_calender");
  var table ="";

  table +="<tr>";

  table +='<td class="dates_cells"> Date </td>';
  for(var i =0; i < 7; i++){
        var temp = getDates( weekCalenders[weekCalenderIndx].firstDay);
        table +='<td class="dates_cells">' + temp[i].getDate()+'/'+(temp[i].getMonth()+1)+'</td>';

  }
  table +="</tr>";

  var days  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  table +="<tr>";

  table +='<td class="days_cells"> Day </td>';
  for(var i =0; i < 7; i++)
        table +='<td class="days_cells">' +days[i]+'</td>';

  table +="</tr>";

  var hours = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00"
              ,"10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
              "21:00","22:00","23:00"];

  for(var i = 0; i < 24; i++){
    table +="<tr>";
    for(var j =0; j < 8; j++){
      var temp = getDates( weekCalenders[weekCalenderIndx].firstDay);

      if( j == 0 )
            table +='<td class="hours_cells">' +hours[i]+'</td>';
      else{
        //table += '<td> <button type="button" class="calender_btn" data-day="'+j+'" data-hour="'+i+'"></button></td>';
        var temp_id = temp[j-1].getDate()+'.'+(temp[j-1].getMonth()+1)+"_day-"+days[j-1]+"_hour-"+hours[i];

        table += '<td> <button type="button" class="calender_btn"  id="'+temp_id+'"></button></td>';

      }
    }
      table +="</tr>";
  }

  $(".booking_calneder").empty();
  $(".booking_calneder").append(table);
  $(".calender_btn").on("click",calender_btn_clicked);
  updateSlotsColors();

}




function initWeekCalendersObjects(){
  var objectArr = new Array(4);
  for(var i=0; i< objectArr.length; i++){
    var obj = {firstDay : new Date()};
    obj.firstDay.setDate(new Date().getDate() + i*7);
    objectArr[i] = obj;
}
  return objectArr;
}

function read(data){

    console.log("enter got_data");

    var teachers = data.val();
    var teachers_ids = Object.keys(teachers);
    for(var i =0; i< teachers_ids.length; i++){
      id = teachers_ids[i];
      console.log("email: " +teachers[id].userEmail);

    }
}

function upadate_array_by_checkbox(name, arr){
  var items=document.getElementsByName(name);
  for(var i=0; i<items.length; i++){
    if(items[i].type=='checkbox' && items[i].checked==true)
      arr.push(items[i].value);
  }
}

// removes the slot from the availableSlots array
function removeSlot(slot){
  const index = availableSlots.indexOf(slot);
  if (index > -1) {
    availableSlots.splice(index, 1);
  }

  console.log("availableSlots: " + availableSlots);
}

function updateSlotsColors(){
  console.log("array slots: " + availableSlots);

  for(var i =0; i<availableSlots.length; i++){
    var slot = document.getElementById(availableSlots[i])
    if(slot)
      slot.style.background=availableColor;

  }
}

function get_profile_info_from_db(data){
  console.log("enter get_profile_info_from_db");

  var teachers = data.val();
  var current_teacher = teachers[userID];
  console.log("email: " +current_teacher.userEmail);



}
