var models = require('../models');
var express = require('express');
var router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const tenpay = require('tenpay');

router.post('/', function (req, res, next) {

    //查询当前用户购物车
    models.Cart.findAll({
        where: {
            userId: req.decoded.user_id
        },
    }).then(carts => {
        if(carts.length === 0) {
            //若用户购物车为空
            return res.json({success: false, message: '购物车为空'})
        }

        //若不为空，生成新的订单记录
        // (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+ '-' + req.decoded.user_id
        const randomNum =(new Date()).getTime() + '-' + req.decoded.user_id;

        models.Order.create({status: 1, out_trade_no: randomNum, userId: req.decoded.user_id})
            .then(order => {
                const Order_products = carts.map(item => {
                    return {
                        orderId: order.id,
                        productId: item.productId,
                        number: item.number
                    }
                })

                // 订单商品表生成新的记录
                models.Order_products.bulkCreate(Order_products).then(() => {
                    //删除购物车表
                    models.Cart.destroy({
                        where: {
                            userId: req.decoded.user_id
                        }
                    });
                    models.Order_products.findAll({
                        where: {orderId: order.id},
                        include: [models.Product],
                        order: [['id', 'DESC']],
                    }).then(Order_products => {
                        res.json({success: true, message: '请求成功', data: Order_products})
                    });
                })
            })
    })
});

router.get('/', function(req, res, next) {
    models.Order.findAll({
        where: {userId: req.decoded.user_id},
        include: {
            model: models.Order_products,
            include: [{model: models.Product,}]
        },
    }).then(orders => {
        // let order = orders.map(item => {
        //      return {...item, total: 0}
        // })
        let order_products = orders.map(item => {
            return item.Order_products
        })

        let total = order_products.map(val => {
            let all = 0;
            val.forEach(item => {
                all += item.number * parseFloat(item.Product.price)
            })
            return all
        })

        res.json({orders, total})
    })
})

router.post('/pay', async function (req, res, next) {
    //获取订单号
    let out_trade_no = req.body.out_trade_no
    let order = await models.Order.findOne({
        where: {
            out_trade_no: out_trade_no
        }
    });

    let Order_products = await models.Order_products.findAll({
        where: {
            orderId: order.id
        },
        include: [models.Product],
    });

    //获取总价
    let total = 0;
    Order_products.forEach(item => {
        total += parseFloat(item.Product.price) * item.number
    })

    const config = {
        appid: 'wx4a9965771e11b4bd',
        mchid: '1230390602',
        partnerKey: 'phpwh56fgdhdghjtyeq3luiughjfeft3',
        notify_url: 'http://localhost:3000/notify',
    };

    const api = new tenpay(config, true);

    //获取微信JSSDK支付参数
    let result = await api.getPayParams({
        out_trade_no: out_trade_no,
        body: '长乐小卖部',
        total_fee: total * 100,
        openid: 'oakvM4vqiI71HzuVvCwqf_lxQxDo'
    });

    res.json({result, out_trade_no})
})


module.exports = router;
