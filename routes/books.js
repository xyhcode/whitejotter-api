var express = require('express');
const query = require("../db");
const moment = require("moment");
var router = express.Router();

/**
 * 获取所有的图书
 */
router.get('/',async (req, res, next) => {
    try {
        let seres = await query('select a.*,b.name from sys_book as a inner join category as b on a.cid=b.id');
        let allbook=[];
        //重新修改数据格式
        seres.forEach((item) =>{
            let obj={
                id:item.id,
                cover:item.cover,
                title:item.title,
                author:item.author,
                date:item.date,
                press:item.press,
                abs:item.abs,
                create_time:item.create_time,
                is_delete:item.is_delete,
                category:{
                    id: item.cid,
                    name:item.name
                }
            }
            allbook.push(obj);
        });
        res.send({
            code:200,
            msg:'获取成功！',
            data:allbook
        })
    } catch (e) {
        next(e);
    }
})

/**
 * 分类查询
 */
router.get('/:cid/cate',async (req,res, next) => {
    let cid=parseInt(req.params.cid);
    console.log("25:"+cid)
    try {
        if(cid===0){
            let seres = await query('select * from sys_book');
            res.send({
                code:200,
                msg:'获取成功！',
                data:seres
            })
        }else{
            let seres=await query('select * from sys_book where cid=?',[cid]);
            res.send({
                code:200,
                msg: '获取成功！',
                data:seres
            })
        }
    }catch (e) {
        next(e);
    }
})

/**
 * 搜索
 */
router.get('/search',async (req,res,next) => {
    console.log(req.query.keywords);
    try {
        let seres=await query('select * from sys_book where title like ? or author like ?',['%'+req.query.keywords+'%','%'+req.query.keywords+'%']);
        res.send({
            code:200,
            msg: '获取成功！',
            data:seres
        })
    }catch (e) {
        next(e);
    }
})


/**
 * 删除图书
 */
router.post('/delete',async (req, res, next) => {
    try {
        let debooks = await query('delete from sys_book where id =?', [req.body.id]);
        res.send({
            code: 200,
            msg: '删除成功！'
        })
    } catch (e) {
        next(e);
    }
});


/**
 * 添加图书 || 编辑图书
 */
router.post('/editadd',async (req, res, next) => {
    let {id, cover, title, author, date, press, abs, category} = req.body;
    try {
        console.log(id, cover, title, author, date, press, abs, category);
        let time=moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
        let msg = '';
        if (id == null || id == '') {
            let ins = await query('insert into sys_book(cover,title,author,date,press,abs,cid,create_time,is_delete)values (?,?,?,?,?,?,?,?,?)',[cover,title,author,date,press,abs,category.id,time,0]);
            msg='添加成功！';
        } else {
            let upb=await query('update sys_book set cover=?,title=?,author=?,date=?,press=?,abs=?,cid=?,create_time=? where id=?',[cover,title,author,date,press,abs,category.id,time,id]);
            msg='修改成功！';
        }
        res.send({
            code: 200,
            msg:msg
        })
    } catch (e) {
        next(e);
    }
})


module.exports=router
