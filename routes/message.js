var express = require('express');
const query = require("../db");
const moment = require("moment");
var router = express.Router();


router.get('/',async (req,res,next) => {
    try {
        let seres=await query('select * from sys_message');
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