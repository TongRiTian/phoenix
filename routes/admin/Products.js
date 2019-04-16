var express = require('express');
var router = express.Router();
var models  = require('../../models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

/* GET home page. */
router.get('/', function (req, res, next) {
    var currentPage = req.param('currentPage') == undefined ? 1 : req.param('currentPage')
    var pageSize = req.param('pageSize') == undefined ? 5 : req.param('pageSize')

    var keyword = req.query.name;
    var data = {};

    if(keyword){
        data.name = {
            [Op.like]: '%' + keyword + '%'
        }
    }

    models.Product.findAndCountAll({
        include: [models.Category],
        where: data,
        order: [['id', 'ASC']],
        offset: (currentPage - 1) * pageSize,
        limit: parseInt(pageSize)
    }).then(result => {
        res.json({
            list: result.rows,
            pagination: {
                current: parseInt(currentPage),
                pageSize: parseInt(pageSize),
                total: result.count
            }
        })
    })
    // Category.findAll({
    //     where: data,
    //     order: [['sort', 'ASC']]
    // }).then(categories => {
    //     res.json({success: true, message: '查询成功', data: categories})
    // })
});

router.get('/:id', function (req, res, next) {
    models.Product.findById(req.params.id).then(category => {
        res.json({success: true, message: '查询成功', data: category})
    })
});

router.post('/',function (req, res, next) {
    models.Product.create(req.body).then(category => {
        res.json({success: true, message: '查询成功', data: category})
    })
});

router.put('/:id',function (req, res, next) {
    models.Product.findById(req.params.id).then(product => {
        product.update(req.body)
        res.json({success: true, message: '修改成功', data: product})
    })
});

router.delete('/:id',function (req, res, next) {
    models.Product.findById(req.params.id).then(category => {
        category.destroy()
        res.json({success: true, message: '删除成功'})
    })
});

module.exports = router;
