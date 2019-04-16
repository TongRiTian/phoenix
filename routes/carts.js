var models = require('../models');
var express = require('express');
var router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET home page. */
router.get('/', function (req, res, next) {
    models.Cart.findAndCountAll({
        where: {
            userId: req.decoded.user_id
        },
        include: [models.Product],
        order: [['id', 'DESC']],
    }).then(carts => {
        let total = 0;
        carts.rows.forEach(item => {
            total += parseFloat(item.Product.price) * item.number
        })
        carts.total = total;
        res.json({success: true, message: '查询成功', data: carts})
    })
});

router.delete('/delete', function (req, res, next) {
    models.Cart.destroy({
        where: {
            userId: req.decoded.user_id
        }
    }).then(cart => {
        res.json({success: true, message: '删除成功'})
    })
});

router.delete('/delete/:id', function (req, res, next) {
    models.Cart.findById(req.params.id).then(cart => {
        cart.destroy()
        res.json({success: true, message: '删除成功'})
    })
});

router.put('/update', function (req, res, next) {
    let type = req.body.type;
    let cart_id = req.body.cart_id;

    models.Cart.findById(cart_id).then(cart => {
        if (type === 'inc') {
            cart.increment('number')
            return res.json({success: true, message: '修改成功'})
        }

        if (cart.number > 1) {
            cart.decrement('number')
            return res.json({success: true, message: '修改成功'})
        }

        cart.destroy()
        res.json({success: true, message: '删除成功'})
    })
});

router.post('/create/:id', function (req, res, next) {
    let productId = req.params.id;

    // models.Cart.findOrCreate({
    //     where: {
    //         productId: productId,
    //         userId: req.decoded.user_id
    //     },
    //     defaults: {
    //         number: 1,
    //         userId: req.decoded.user_id,
    //         productId: productId
    //     }
    // }).spread((cart, created) => {
    //     console.log(created)
    //     if (!created) {
    //         models.Cart.findOne({where: {productId: productId}}).then(cart => {
    //             return cart.increment('number')
    //         }).then(cart => {
    //             res.json({success: true, message: '修改成功'})
    //         })
    //     }
    //     res.json({success: true, message: '添加成功', data: cart})
    // })

    models.Cart.findOne({
        where: {
            productId: productId,
            userId: req.decoded.user_id
        }
    }).then(cart => {
        if (cart) return cart.increment('number');

        models.Cart.create({
            number: 1,
            productId: productId,
            userId: req.decoded.user_id
        }).then(cart => {
            res.json({success: true, message: '新增成功', data: cart})
        })
    }).then(cart => {
        res.json({success: true, message: '添加成功'})
    })
});

module.exports = router;
