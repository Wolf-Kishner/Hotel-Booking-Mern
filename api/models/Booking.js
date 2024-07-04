const mongoose = require("mongoose");
//Reference to another Database
const  bookingSchema = new mongoose.Schema({
    place : {type : mongoose.Schema.Types.ObjectId , required: true , ref:'Place'} , 
    user : {type:mongoose.Schema.Types.ObjectId}, 
    checkIn : { type : Date , required: true} ,
    checkOut : { type : Date , required: true} ,
    fullName : {type:String} ,
    mobile : {type: String , required : true} ,
    guests: {type : Number, default :1},
    price : Number ,
})

const bookingModel = mongoose.model('booking',bookingSchema);
module.exports = bookingModel;