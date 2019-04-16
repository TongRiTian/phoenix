var express = require('express');
var router = express.Router();
var models  = require('../../models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

/* GET home page. */
router.get('/', function (req, res, next) {
    var keyword = req.query.name;
    var data = {};

    if(keyword){
        data.name = {
            [Op.like]: '%' + keyword + '%'
        }
    }

    models.Category.findAll({
        where: data,
        order: [['sort', 'ASC']],
    }).then(categories => {
        res.json({success: true, message: '查询成功', data: categories})
    })
});

router.get('/:id', function (req, res, next) {
    models.Category.findById(req.params.id).then(category => {
        res.json({success: true, message: '查询成功', data: category})
    })
});

router.post('/',function (req, res, next) {
    models.Category.create(req.body).then(category => {
        res.json({success: true, message: '新增成功', data: category})
    })
});

router.put('/:id',function (req, res, next) {
    models.Category.findById(req.params.id).then(category => {
        category.update(req.body)
        res.json({success: true, message: '修改成功', data: category})
    })
});

router.delete('/:id',function (req, res, next) {
    models.Category.findById(req.params.id).then(category => {
        category.destroy()
        res.json({success: true, message: '删除成功'})
    })
});

module.exports = router;
