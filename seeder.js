const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/bootcamps');

// Connect to db
mongoose.connect(process.env.NODE_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Read json files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'
    ));

// import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data imported...');
    } catch (error) {
        console.error(error);
    }
    process.exit();
}

// remove data
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data destroyed');
    } catch (error) {
        console.error(error);
    }
    process.exit();
}

if(process.argv[2] === '-i' ){
    importData();
}
else if(process.argv[2] === '-d'){
    deleteData();
}