const REST_API_URL = "https://real-awesome-backend.herokuapp.com";
let currentPage = null;
let receivedData = null;
let arrivalTime = false;

const FAVORITE_ROUTE = {
  starting_point: "Garching",
  destination: "Westpark",
  time_fav: "09:00",
  time_commute: "04:00",
};

// Initialization code
document.addEventListener("init", function (event) {
  var currentPage = event.target;

  if (currentPage.id == "page4") {
    currentPage.querySelector("#push-button").onclick = function () {
      getResponse();
    };
  }
});

function popPageCustom() {
  document.querySelector("#myNavigator").popPage();
}

function setDate(date) {
  d = new Date(date);
  dt = d.getDate();
  mn = d.getMonth();
  mn++;
  yy = d.getFullYear();
  return dt + "/" + mn + "/" + yy;
}

function getResponse() {
  //Sending data to server
  let sendData = {
    starting_point: $("#starting-point").val(),
    destination: $("#ending-point").val(),
    time: `${$("#time").val()}:00`,
    date: setDate($("#date").val()),
    arrive_by: arrivalTime,
  };

  // let sendData = {
  //   starting_point: "Westpark",
  //   destination: "Münchner Freiheit",
  //   time: "09:35",
  //   date: "05/05/2020",
  //   arrival_time: arrivalTime,
  // };

  if (!isEmpty(sendData)) {
    ons.notification.alert("All fields are mandatory!");
  } else if (sendData.starting_point == sendData.destination) {
    ons.notification.alert(
      "Starting point and Destination should not be same!"
    );
  } else {
    $.ajax({
      type: "POST",
      url: `${REST_API_URL}/query`,
      data: sendData,
      dataType: "json",
    })
      .done((receivedDataLocal) => {
        receivedData = receivedDataLocal;
        // Changing to 2nd screen
        document
          .querySelector("#myNavigator")
          .pushPage("page2.html")
          .then(() => {
            setContentOnScreenTwo(receivedData);
          });

        //Receiving data from server
        //console.log(receivedData);
      })
      .catch((error) => {
        //Got error from server
        ons.notification.alert("Something went wrong!");
        console.log(error.responseText);
      });
  }
}

function isEmpty(sendData) {
  return (
    sendData.starting_point != "" &&
    sendData.destination != "" &&
    sendData.time != "" &&
    sendData.date != ""
  );
}

function setContentOnScreenTwo(receivedData) {
  //Setting route info
  $("#start-end").text(
    `${receivedData.starting_point} - ${receivedData.destination} `
  );
  //Setting arrival time info
  $("#arrival-time").html(`<b>${receivedData.time.slice(0, -3)}</b>`);

  //Replacing "receivedData.results" with "cardInfo"
  let cardInfo = receivedData.results;

  //Setting rec start time info
  $("#rec-start-time").text(
    `${cardInfo.recommendation.start_time.slice(0, -3)}`
  );

  //Setting rec end time info
  $("#rec-end-time").text(`${cardInfo.recommendation.end_time.slice(0, -3)}`);

  //Setting  info
  $("#rec-crowd-level").html(`<b>${cardInfo.recommendation.crowd_level}</b>`);

  //Setting Arrive/Leave Title
  if (arrivalTime) {
    $("#time-toggle").text("Arrive by ");
  } else {
    $("#time-toggle").text("Leave at ");
  }

  setContentOnScreenTwoForOtherOptions(cardInfo);
}

function setContentOnScreenTwoForOtherOptions(cardInfo) {
  //getting the object keys
  let keys = Object.keys(cardInfo);
  //finding the "recommendation" index
  let index = keys.indexOf("recommendation");
  //deleting the "recommendation" index
  keys.splice(index, 1);

  setContentOnScreenTwoForOtherOptionsDynamically(cardInfo, keys);
}

function setContentOnScreenTwoForOtherOptionsDynamically(cardInfo, keys) {
  let finalHtmlResponse = "";

  keys.forEach((key) => {
    finalHtmlResponse += prepareHTML(cardInfo[key], key);
  });

  $(finalHtmlResponse).insertAfter("#other-options-card");
}

function prepareHTML(othersData, key) {
  let htmlRespose = `<div class="col-12" onclick="navigateToScreen3('${key}')">
<div class="card card-custom-margin">
  <div class="card-body">
    <div class="d-inline">
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="29" height="18" fill="#005AA3" />
        <path
          d="M12.4801 3.09091V10.2074C12.4801 11.8054 11.3828 12.956 9.56108 12.956C7.73935 12.956 6.64205 11.8054 6.64205 10.2074V3.09091H5.32102V10.3139C5.32102 12.5511 6.99361 14.1918 9.56108 14.1918C12.1286 14.1918 13.8011 12.5511 13.8011 10.3139V3.09091H12.4801ZM19.9446 14.1491C22.1498 14.1758 23.5881 12.5138 23.5881 10.4844C23.5881 8.375 22.0273 6.86222 20.1577 6.86222C19.0337 6.86222 18.0696 7.41087 17.473 8.31108H17.3878C17.3931 5.63175 18.4265 4.09233 20.115 4.09233C21.2656 4.09233 21.9581 4.81676 22.2031 5.81818H23.5028C23.2365 4.10298 21.9474 2.92045 20.115 2.92045C17.6594 2.92045 16.152 5.09375 16.152 8.97159C16.152 13.0039 18.1548 14.1278 19.9446 14.1491ZM19.9446 12.9773C18.5756 12.9773 17.5742 11.8107 17.5795 10.5057C17.5849 9.20064 18.6342 8.03409 19.9872 8.03409C21.3242 8.03409 22.3096 9.13139 22.3096 10.4844C22.3096 11.8693 21.2816 12.9773 19.9446 12.9773Z"
          fill="white"
        />
      </svg>
    </div>

    <div class="d-inline">
      <span class="card-start-time d-inline"> ${othersData.start_time.slice(
        0,
        -3
      )} </span>
      <span>
        <ons-icon
          class="icon-size"
          icon="md-arrow-right"
        ></ons-icon>
      </span>
      <span class="arrival-time">${othersData.end_time.slice(0, -3)}</span>
    </div>

    <div class="col-12 crowd-bar crowd-bar-${othersData.crowd_level}">

        Crowd on the route: <span> <b> ${othersData.crowd_level} </b></span>
    </div>
  </div>
</div>
</div>`;

  return htmlRespose;
}

function navigateToScreen3(key) {
  document
    .querySelector("#myNavigator")
    .pushPage("page3.html")
    .then(() => {
      let cardInfo = receivedData.results[key];

      //Setting route info
      $("#start-end-screen3").text(
        `${receivedData.starting_point} - ${receivedData.destination} `
      );

      //Setting screen3 start time info
      $("#start-time-screen3").text(`${cardInfo.start_time.slice(0, -3)}`);

      //Setting screen3 end time info
      $("#end-time-screen3").text(`${cardInfo.end_time.slice(0, -3)}`);

      //Setting  -screen3 info
      $("#crowd-level-screen3").html(`<b>${cardInfo.crowd_level}</b>`);

      $(".crowd-bar-dynamic").addClass(`crowd-bar-${cardInfo.crowd_level}`);
    });
}

function activeTimeOption(param) {
  $(".active").removeClass("active");
  $(`.input-group-prepend > #${param}`).addClass("active");
  if (param == "leave-at") {
    arrivalTime = false;
  } else {
    arrivalTime = true;
  }
}

function pushPage(param) {
  tabmenuToggle(param);

  document
    .querySelector("#myNavigator")
    .pushPage(`page${param == "favorite" ? "4" : "1"}.html`);
}

function disablePastDates() {
  let today = new Date().toISOString().split("T")[0];
  $("input#date").attr("min", today);
}

function setFavoriteRoute(param) {
  tabmenuToggle("favorite");
  document
    .querySelector("#myNavigator")
    .pushPage(`page4.html`)
    .then(() => {
      $("select#starting-point").val(
        param == "commute"
          ? FAVORITE_ROUTE.destination
          : FAVORITE_ROUTE.starting_point
      );
      $("select#ending-point").val(
        param == "commute"
          ? FAVORITE_ROUTE.starting_point
          : FAVORITE_ROUTE.destination
      );
      $("input#time").val(
        param == "commute"
          ? FAVORITE_ROUTE.time_commute
          : FAVORITE_ROUTE.time_fav
      );
      param == "commute"
        ? activeTimeOption("leave-at")
        : activeTimeOption("arrive-by");
      $("input#date").val(todayDate());
    });
}

function todayDate() {
  return new Date().toJSON().slice(0, 10).replace(/-/g, "-").toString();
}

function tabmenuToggle(param) {
  $(".inactive-tabmenu").removeClass("inactive-tabmenu");
  $(`#${param}`).addClass("inactive-tabmenu");
}
