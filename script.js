$(document).ready(function () {
  $("#submit").on("click", function () {
    var input = $("#search").val();
    $("#search").val("");
    currentWeather(input);
    fiveDay(input);
  });

  function makeBtn(params) {
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(params);
    $(".history").append(li);
  }

  $(".history").on("click", "li", function () {
    currentWeather($(this).text());
    fiveDay($(this).text());
  });

  var apiKey = "1fdfe5fe82e8e426d71955f5623c6d0b";
  function currentWeather(input) {
    var weatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: weatherQueryURL,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (history.indexOf(input) === -1) {
          history.push(input);
          window.localStorage.setItem("history", JSON.stringify(history));
          makeBtn(input);
        }
        $(".test").empty();
        var date = moment().format("MMM Do YY");
        var result = date.bold();
        var cityName = $("<h3>").addClass("card-title").text(response.name);
        var card = $("<div>").addClass("card");
        var wind = $("<p>")
          .addClass("card-text")
          .text(`Wind-Speed: ${response.wind.speed}`);
        var hum = $("<p>")
          .addClass("card-text")
          .text(`Humidity: ${response.main.humidity}`);
        var temp = $("<p>")
          .addClass("card-text")
          .text(`temp: ${response.main.temp}`);
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
        );
        cityName.append(img);
        cardBody.append(cityName, result, temp, hum, wind);
        card.append(cardBody);
        $(".test").append(card);
        uvIndex(response.coord.lat, response.coord.lon); //apply to forecast
      },
    });
  }
  var history = JSON.parse(localStorage.getItem("history")) || [];
  if (history.length > 0) {
    currentWeather(history[history.length - 1]);
  }
  for (var i = 0; i < history.length; i++) {
    makeBtn(history[i]);
  }

  function uvIndex(latitude, longitude) {
    var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=1fdfe5fe82e8e426d71955f5623c6d0b`;

    $.ajax({
      url: uvURL,
      type: "GET",
      dataType: "json",
      success: function (response) {
        uv = response.value;
        console.log(uv);
        var uvDis = $("<p>").addClass("card-text").text(`Uv index ${uv}`);
        $(".test .card-body").append(uvDis);

        if (response.value < 11 && response.value > 7) {
          uvDis.css("color", "red");
        } else if (response.value < 7 && response.value > 5) {
          uvDis.css("color", "orange");
        } else if (response.value < 5 && response.value > 2) {
          uvDis.css("color", "yellow");
        } else if (response.value >= 11) {
          uvDis.css("color", "purple");
        }
      },
    });
  }

  //5day
  function fiveDay(input) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=1fdfe5fe82e8e426d71955f5623c6d0b&units=imperial`;

    $.ajax({
      url: queryURL,
      type: "GET",
      dataType: "json",
      success: function (response) {
        console.log(response);
        $("#fiveDisplay .row").empty();

        for (var i = 0; i < response.list.length; i++) {
          if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-white");
            var body = $("<div>").addClass("card-body");
            var date = $("<h5>")
              .addClass("card-title")
              .text(new Date(response.list[i].dt_txt).toLocaleDateString());
            var img = $("<img>").attr(
              "src",
              "http://openweathermap.org/img/w/" +
                response.list[i].weather[0].icon +
                ".png"
            );
            var temp = $("<p>")
              .addClass("card-text")
              .text("Temp: " + response.list[i].main.temp_max + " °F");
            var hum = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + response.list[i].main.humidity + "%");
            col.append(card.append(body.append(date, img, temp, hum)));
            $("#fiveDisplay .row").append(col);
          }
        }
      },
    });
  }
});
