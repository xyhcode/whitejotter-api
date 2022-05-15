var express = require('express');
const query = require("../db");
const moment = require("moment");
var router = express.Router();

//获取所有订单
router.get('/',async (req, res, next) => {
    try {
        let seres = await query('select * from sys_order');
        res.send({
            code: 200,
            msg: '获取成功！',
            data:seres
        })
    } catch (e) {
        next(e);
    }
});

//获取流水
router.get('/flow',async (req,res,next) => {
    try {
        let seres=await query('select * from sys_flow');
        res.send({
            code: 200,
            msg:'获取成功！',
            data:seres
        })
    }catch (e) {
        next(e);
    }
})

module.exports=router;
