const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    user_id:{type:String, required:true},
    recent_cities: {type: [String] , required:true},
    city_list:{
        type:Map,
        of:Number
    }
})

const Weather = mongoose.model('Weather', weatherSchema, 'cities');

const mySchemas = {'Weather':Weather}

module.exports = mySchemas;