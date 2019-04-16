var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('jsonwebtoken')
var salt = require('./constant');

var categoriesRouter = require('./routes/admin/Categories');
var productsRouter = require('./routes/admin/Products');
var usersAdminRouter = require('./routes/admin/Users');
var photosRouter = require('./routes/admin/Photos');
var homeRouter = require('./routes/home');
var cartsRouter = require('./routes/carts');
var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders');

var app = express();

//跨域
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    if (req.url != '/admin/users/login'
        && req.url != '/admin/users/register'
        && req.url != '/home'
        && req.url != '/users/login'
        && req.url != '/admin/photos/uploadToken') {
        //token可能存在post请求和get请求
        let token = req.body.token || req.query.token || req.headers.token;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: '当前接口需要认证才能访问.'
            });
        }

        jwt.verify(token, salt, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'token过期，请重新登录'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        next();
    }
})

app.use('/admin/categories', categoriesRouter);
app.use('/admin/products', productsRouter);
app.use('/admin/users', usersAdminRouter);
app.use('/admin/photos', photosRouter);
app.use('/home', homeRouter);
app.use('/carts', cartsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

module.exports = app;
