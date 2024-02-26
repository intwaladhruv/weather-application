const request = require("request");
//http://api.weatherapi.com/v1/forecast.json?key=2b3c16ca308a4e8d893223315241302&q=London&days=7&aqi=no&alerts=no

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherapi.com/v1/forecast.json?key=2b3c16ca308a4e8d893223315241302&q=" +
    encodeURIComponent(latitude) +
    "," +
    encodeURIComponent(longitude) +
    "&days=7&aqi=no&alerts=no";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find the location!", undefined);
    } else {
      const currentTimeEpoch = Math.floor(Date.now() / 1000);
      const next7Hours = body.forecast.forecastday[0].hour.filter((hour) => {
        return (
          hour.time_epoch >= currentTimeEpoch &&
          hour.time_epoch < currentTimeEpoch + 7 * 3600
        );
      });

      if(next7Hours.length != 7)
      {
        nextDayHours = body.forecast.forecastday[1].hour.slice(0, 7-next7Hours.length)
        next7Hours.push(...nextDayHours)
      }

      callback(undefined, {
        data:
          body.current.condition.text +
          "\nIt is currently " +
          body.current.temp_c +
          " degree out. There are " +
          body.current.precip_mm +
          "% chance of rain.",
        days: body.forecast.forecastday,
        hours: next7Hours,
      });
    }
  });
};

module.exports = forecast;
