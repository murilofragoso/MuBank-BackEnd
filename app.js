var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var transRouter = require('./routes/transaction')

var app = express();

const cors = require('cors')
app.use(cors())

const db = require('./config/database');
db('mongodb+srv://muFragoso:mu310898bank@mubank.t2hrd.mongodb.net/MuBank?retryWrites=true&w=majority');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/transaction', transRouter)

module.exports = app;
