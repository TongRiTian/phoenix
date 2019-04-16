var request = require('request');
var express = require('express');
var router = express.Router();
var models  = require('../models');
var jwt = require('jsonwebtoken');
var salt = require('../constant');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

/* GET home page. */
router.post('/login', function (req, res, next) {
    let code = req.body.code

    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: 'wx4a9965771e11b4bd',
            secret: 'e94f1c12cb09e31bff0f12826f945b60',
            js_code: code
        }
    }, (err, response, data) => {
        if (response.statusCode === 200) {
            // console.log("[openid]", data.openid)
            const openid = data.openid
            models.User.findOne({
                where: {
                    openid: openid
                }
            }).then(user => {
                if (!user) {
                    models.User.create({openid: openid, admin: 0}).then(user => {
                        res.json({success: true, message: '新增成功', data: user})
                    })
                }
                var token = jwt.sign({user_id: user.id, openid: openid}, salt, {expiresIn: 60 * 60 * 24});
                res.json({
                    success: true,
                    message: '请求成功',
                    token: token
                })
            })
        } else {
            console.log("[error]", err)
            res.json(err)
        }
    })
})

module.exports = router;


