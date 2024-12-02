const express  = require("express");
const router = express.Router();
const axios = require("axios")
const schemas = require("../models/schema");
const helperFunc = require("../helperFunc")
require("dotenv/config")

//router.post(...)

//FETCHING CITY WEATHER 
router.get('/get-city-data/:city', async(req, res)=>{
    let city = req.params.city;
    try{
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_API_KEY}`);
        res.send(result.data);
        res.end()
    }
    catch(err){
        console.log(`There was an error fetching city: ${err}`)
        res.send(false)
        res.end()
    }

})

//MAKING USER COLLECTION
router.post('/send-query-data', async(req, res) =>{
    const query = schemas.Weather;
    let {city} = req.body;
    const cityPath = `city_list.${helperFunc.titleCityFormat(city)}`
    try{
        const hasCity = await query.findOne({user_id:'test'}, {_id:0, recent_cities:1})

        //generating recent_cities list & adding it
            const cityList = hasCity['recent_cities']
            //adding newest city to front
            cityList.splice(0,0,helperFunc.titleCityFormat(city))
            //removing 4th city
            if (cityList.length > 3){
                cityList.pop()
            }
            await query.updateOne(
                {user_id:'test'},
                {$set: {recent_cities:cityList}}
            ).exec()



        //creating cities --> city_list & incrementing queries
            if (hasCity === null){
                await query.updateOne(
                    {user_id:'test'}, 
                    {$set: {[cityPath]: {queryCount:0}} }
                )
            }
            else{
                await query.updateOne(
                    {user_id:'test'},
                    {$inc: {[cityPath]: 1} }
                )
            }

    }
    catch(err){
        console.log(`There was an error posting city data: ${err}`);
        res.send(false)
    }
})

//FETCHING USER PERSONAL WEATHER DATA
router.get('/get-user-weather-data', async(req, res) =>{
    const query = schemas.Weather;
    try{
        //retrieving updated weather data
            const updatedWeatherObject = await query.findOne({user_id:'test'})
            const updatedRecentCities = updatedWeatherObject['recent_cities']
    
        //transpiling Map object from schema city_list to an usuable regular Object
            const updatedFullCities = updatedWeatherObject['city_list']
            let usuableFullCities = {}
            updatedFullCities.forEach((val, key)=>{
                usuableFullCities[key] = val
            })
                
        //sending over top three cities
            res.send(helperFunc.findThreeBest(usuableFullCities, updatedRecentCities))

    }
    catch(err){
        console.log(`There was an error retrieving user data: ${err}`);
    }
})

module.exports = router;