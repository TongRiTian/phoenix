var models  = require('../models');
var express = require('express');
var router  = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op

/* GET home page. */
router.get('/', function (req, res, next) {
    models.Category.findAll({
        include: [models.Product],
        order: [['sort', 'ASC']]
    }).then(categories => {
        res.json({success: true, message: '查询成功', categories: categories})
    })
});

module.exports = router;
