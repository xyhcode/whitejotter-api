var express = require('express');
const query = require("../db");
var router = express.Router();

/**
 * 获取菜单栏
 */
router.get('/',async (req,res,next) => {
    try {
        let sere=await query('select * from admin_menu where parent_id=?',[0]);
        for (const item of sere) {
            let nk=await query('select * from admin_menu where parent_id=?',item.id);
            item.children=nk
        }
        res.send({
            code:200,
            msg:'获取成功！',
            data:sere
        })
    }catch (e) {
        next(e);
    }
})

/**
 * 用户验证
 */
router.get('/authentication',async (req,res,next) => {
    try {
        res.send({
            code:200,
            msg:'身份验证成功！'
        })
    }catch (e) {
        next(e);
    }
})

module.exports=router
