const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log('connected');
}).catch((err)=>{
    console.log(err);
});

let initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "66ddce7251b1b24bbebad03a"
    }))
    await Listing.insertMany(initData.data);
    console.log("data initiallized")
}
initDb();