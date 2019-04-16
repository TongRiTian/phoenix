var express = require('express');
var router = express.Router();
var models  = require('../../models');
var jwt = require('jsonwebtoken')
var salt = require('../../constant');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

router.post('/login',function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if(!username || !password){
        req.status = '404'
        req.send({
            message: '用户名和密码必须填写',
            success: false
        })
        return;
    }

    models.User.findOne({
        where: {
            username: username,
            password: password,
        }
    }).then(user => {
        if (!user) {
            res.json({success: false, message: '用户名或密码错误！'})
        }

        var token = jwt.sign({user_id: user.id, username: username}, salt, {expiresIn: 60 * 60 * 24});
        res.json({
            success: true,
            message: '请求成功',
            token: token
        })
    })
});

module.exports = router;
