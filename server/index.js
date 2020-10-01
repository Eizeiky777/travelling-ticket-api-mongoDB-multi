require('dotenv').config()

// connect express in and out
const express = require("express");
const app = express();
const cors = require('cors')

// parse data yang akan datang
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// set up konfigurasi lingkungan kerja express
const config = require("./config/key");

//  connect ke database 
const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Core endpoint
app.use('/api/meteor', require('./routes/meteor_all/data_user'));

// aplikasi abc education 
app.use('/api/abcEducation', require('./routes/abc_education/users'));
// aplikasi abc finance 
app.use('/api/abcFinance', require('./routes/abc_finance/users'));
// aplikasi def finance 
app.use('/api/defFinance', require('./routes/def_finance/users'));
// aplikasi ghi education 
app.use('/api/ghiEducation', require('./routes/ghi_education/users'));


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server Running at ${port}`)
});

// NOTESS
// email admin : admin@gmail.com password: 234567 / 2345678
// email all user mail passwordnya: 234567

// expired date jwt token 1 menit