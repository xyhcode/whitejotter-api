var express = require('express');
const query = require("../db");
const moment = require("moment");
const {inlog} = require("../utils");
var router = express.Router();

/**
 * 获取所有的广告
 */
router.get('/',async (req, res, next) => {
    try {
        await inlog(req);
        let seres = await query('select * from sys_banner');
        res.send({
            code: 200,
            msg: '获取成功！',
            data:seres
        })
    } catch (e) {
        next(e);
    }
})


module.exports=router;
