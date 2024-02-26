const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const msg1 = document.querySelector("#message-1");
const msg2 = document.querySelector("#message-2");

const gatDay = (time) => {
  var d = new Date(time * 1000);
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  var n = weekday[d.getDay()];
  return n;
};

const gatDate = (time) => {
  var d = new Date(time * 1000);
  var n = d.getDate();
  return n;
};

const gatMonth = (time) => {
  var d = new Date(time * 1000);
  var n = d.getMonth();
  return n;
};

function pad(num) {
  return ("0" + num).slice(-2);
}

function displayDay(day, index) {
  document.querySelector("#Day" + index).textContent = gatDay(day.date_epoch);
  document.querySelector("#Date" + index).textContent =
    gatDate(day.date_epoch) + " / " + gatMonth(day.date_epoch);

  const src = day.day.condition.icon;
  document.getElementById("Img" + index).src = src;

  var str = day.day.condition.text;
  var res = str.replace(/-/g, " ");

  document.querySelector("#Icon" + index).textContent = res;
  document.querySelector("#Temp" + index).textContent = "Max - Min";
  document.querySelector("#Min" + index).textContent = Math.trunc(
    day.day.maxtemp_c
  );
  document.querySelector("#Max" + index).textContent = Math.trunc(
    day.day.mintemp_c
  );
}

function displayHour(hour, index) {
  document.querySelector("#HDay" + index).textContent = gatTime(hour.time_epoch);

  const src1 = hour.condition.icon;
  document.getElementById("HImg" + index).src = src1;

  var str = hour.condition.text;
  var res = str.replace(/-/g, " ");

  document.querySelector("#HIcon" + index).textContent = res;
  document.querySelector("#HTemp" + index).textContent = hour.temp_c;
  document.querySelector("#HMin" + index).textContent = "Humidity";
  document.querySelector("#HMax" + index).textContent =
    Math.trunc(hour.humidity) + "%";

  document.querySelector("#HWMin" + index).textContent = "Wind";
  document.querySelector("#HWMax" + index).textContent = hour.wind_kph + " mph";
}

const gatTime = (time) => {
  var date = new Date(time * 1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  // var seconds = date.getSeconds();
  return pad(hours) + ":" + pad(minutes);
};
weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  msg1.textContent = "Loading...";
  msg2.textContent = "";

  const location = search.value;

  fetch("/weather?search=" + location).then((response) => {
    response.json().then((data) => {
      if (data.error) return (msg1.textContent = data.error);

      msg1.textContent = data.location;
      msg2.textContent = data.forecast;

      for (var i = 1; i < 8; i++) {
        displayHour(data.hours[i-1], i)
        displayDay(data.days[i-1], i)
      }
    });
  });
});
