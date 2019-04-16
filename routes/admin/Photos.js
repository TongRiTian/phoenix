var express = require('express');
var qiniu = require("qiniu");
var router = express.Router();

router.get('/uploadToken', function (req, res, next) {
    var accessKey = 'VBXsqzc73vve8u1fhLfYaGTBjwvNg8-1Xb74K0Gq';
    var secretKey = 'Wu7Ujs2GgPv3aohFsLg7IE4M2BK_47qtCe6U3bpF';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {
        scope: "wangkai",
    };

    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    res.json({success: true, data:{token: uploadToken}})
});

module.exports = router;
