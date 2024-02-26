const path = require('path')
const express = require('express')
const ejs = require('ejs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const revgeocode = require('./utils/revgeocode')
const port = process.env.PORT || 3000

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
const viewDirectory = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(express.static(publicDirectoryPath))

app.set('view engine', 'ejs')
app.set('views', viewDirectory)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Bluesky'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About us',
        name: 'Bluesky'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        desc1: 'Enter the city name in the given search bar and press the search button',
        desc2: 'Result will be displayed below in the form of some text',
        desc3: 'It also displays for next 7 hrs and next 7days too.',
        name: 'Bluesky'
    })
})

app.get('/weather', (req, res) => {
    
    if(!req.query.search){
        return res.send({
            error: 'You must provide search term.'
        })
    }
    geocode(req.query.search, (error, {latitude, longitude, location} = {}) => {
        if (error)
            return res.send({ error })
    
        forecast(latitude, longitude, (error,forecastdata) => {
            if (error)
                return res.send({ error })
            
            res.send({
                forecast: forecastdata.data,
                location,
                address: req.query.search,
                days: forecastdata.days,
                hours:forecastdata.hours
            })
        })
    })
    
})

app.get('/defaultweatherforlocation', (req, res) => {
    if(req.query.lat && req.query.lng)
    {
        revgeocode(req.query.lat, req.query.lng, (error, {latitude, longitude, location} = {}) => {
            if (error)
                return res.send({ error })
        
            forecast(latitude, longitude, (error, forecastdata) => {
                if (error)
                    return res.send({ error })
                
                res.send({
                    forecast: forecastdata.data,
                    location,
                    address: req.query.search,
                    days: forecastdata.days,
                    hours:forecastdata.hours
                    })
            })
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        errorMsg: 'Help artical not found',
        name: 'Bluesky'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        errorMsg: 'Page not found',
        name: 'Bluesky'
    })
})

app.listen(port, () => {
    console.log('server started at ' + port)
})