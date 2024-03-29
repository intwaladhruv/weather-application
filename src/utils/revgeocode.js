const request = require('request')

const revgeocode = (lat, lng, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(lng) + ',' + encodeURIComponent(lat) + '.json?access_token=pk.eyJ1IjoicGVsbXNiIiwiYSI6ImNrMDdpYjQ0ajN6YmYzZ3V0aHBkMWI3czAifQ.uWuz-DR9k-xHXuQN17hVVQ'

    request({ url, json: true }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features == 0) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = revgeocode