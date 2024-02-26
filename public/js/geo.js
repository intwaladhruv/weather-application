const msg_1 = document.querySelector('#message-1')
const msg_2 = document.querySelector('#message-2')

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {

  msg1.textContent = 'Loading...'
  msg2.textContent = ''

  const lat = position.coords.latitude
  const lng = position.coords.longitude
  fetch('/defaultweatherforlocation?lat=' + lat + '&lng=' + lng).then((response) => {
    response.json().then((data) => {
      if (data.error)
        return msg1.textContent = data.error

      msg1.textContent = data.location
      msg2.textContent = data.forecast
      for (var i = 1; i < 8; i++) {
        displayHour(data.hours[i-1], i)
        displayDay(data.days[i-1], i)
      }

    })
  })
}