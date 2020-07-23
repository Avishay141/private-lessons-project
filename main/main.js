const db = firebase.database();
var userID = get_userID_from_url();
//var database = firebase.database();
const
  range = document.getElementById('rangeSlider'),
  rangeV = document.getElementById('rangeV'),
  setValue = () => {
    const
      newValue = Number((range.value - range.min) * 100 / (range.max - range.min)),
      newPosition = 10 - (newValue * 0.2);
    rangeV.innerHTML = `<span>${range.value}</span>`;
    rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
  };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);





/////////////---------- Read Teachers for search
$("#edit_teacher_profile").on("click", function () {
  window.location = "../teacher_page/teacher.html?uid=" + userID;
});





function read(data) {

  var selected_Language = $("#ddl_language").children("option:selected").val();
  var selected_Origin = $("#ddl_origin").children("option:selected").val();
  var selected_Price = document.getElementById("rangeSlider").value;
  console.log("requested language: " + selected_Language);
  console.log("requested origin: " + selected_Origin);
  console.log("requested price: " + selected_Price);
  console.log("search results: ");


  var teachers = data.val();
  var teachers_ids = Object.keys(teachers);
  var res = [];
  var res_size = 0;
  for (var i = 0; i < teachers_ids.length; i++) {
    id = teachers_ids[i];

    if (teachers[id].languages_I_teach && teachers[id].lessonPrice && teachers[id].homeCountry) {
      console.log("a");
      console.log(teachers[id].lessonPrice <= selected_Price);
      console.log(teachers[id].homeCountry == selected_Origin);
      if (search_language(teachers[id].languages_I_teach, selected_Language) &&
        teachers[id].lessonPrice <= selected_Price &&
        teachers[id].homeCountry == selected_Origin) {
        res.push({ name: teachers[id].name, email: teachers[id].userEmail });
        console.log("res item number: " + res_size + " name:" + res[res_size].name + " email: " + res[res_size].email + " \n");
        res_size++;
      }
    }
  }


  update_html_profiles(teachers[id].name, teachers[id].userEmail, res_size);


}

function search_language(languages, selected_Language) {
  for (var i = 0; i < languages.length; i++) {
    if (languages[i] == selected_Language) {
      console.log("b");
      return true;
    }
  }
  return false;
}


$("#searchBtn").on("click", function (event) {
  db.ref("Users/Teachers/").on("value", read);
});


function update_html_profiles(name, email, res_size) {
  $(".profiles").empty();

  for (var x = 0; x < res_size; x++) {
    var html_string = "<div class=\"card\" style=\"width:250px\" imgstyle= >"
      + "<img class=\"card-img-top\" src=\"https://www.w3schools.com/bootstrap4/img_avatar1.png\" alt=\"Card image\" style=\"width:100%\">"
      + "<div class=\"card-body\">"
      + "<h4 class=\"card-title\">" + name + "</h4>"
      + "<p class=\"card-text\">Email:" + email + " \n</p>"
      + "<a href=\"#\" class=\"btn btn-primary\">See Profile</a>"
      + "</div>"
      + "</div>";
    $(".profiles").append(html_string);

  }

}



/*

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     window.location = "../login/index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});*/


function get_userID_from_url() {
  var res = location.search.substring(1).split("=")[1];
  console.log("userID from url: " + res);
  return res;
}

$("#logout_btn").on("click", function () {
  firebase.auth().signOut();
});