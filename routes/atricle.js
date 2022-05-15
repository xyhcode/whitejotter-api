var express = require('express');
const query = require("../db");
const {upload} = require("../utils/index");
const moment = require("moment");
const {inlog} = require("../utils");
var router = express.Router();

/**
 * 查询文章 && 分页
 */
router.get('/:pagesize/:page',async (req, res, next) => {
    let pagesize = parseInt(req.params.pagesize);
    let page = parseInt(req.params.page);
    try {
        //起始值 (当前页-1)*大小
        let startpage=(page-1)*pagesize;
        let setal=await query('select count(*) as count from sys_article');

        let seres = await query('select * from sys_article limit ?,?',[startpage,pagesize]);
        let obj ={
            total:setal[0].count,
            content:seres
        }
        res.send({
            code:200,
            msg:'获取成功！',
            data:obj
        })
    }catch (e) {
        next(e)
    }
})

/**
 * 文章详情
 */
router.get('/:id',async (req, res, next) => {
    let id = parseInt(req.params.id);
    try {
        let seres = await query('select * from sys_article where id=?', [id]);
        res.send({
            code:200,
            msg:'获取成功！',
            data:seres[0]
        })
    } catch (e) {
        next(e);
    }
});

/**
 * 图片上传
 */
router.post('/img/upimg',upload.single('headimg'),async (req,res,next) => {
    console.log(req.file);
    let imgpath=req.file.path.split('public')[1];
    let imgurl=`http://127.0.0.1:3000${imgpath}`;
    res.send({
        code:201,
        msg:'上传成功！',
        data:imgurl
    })
})

/**
 * 添加文章
 */
router.post('/create',async (req, res, next) => {
    let {id, articleTitle, articleContentMd, articleContentHtml, articleAbstract, articleCover, articleDate,usname} = req.body;
    console.log(id, articleTitle, articleContentMd, articleContentHtml, articleAbstract, articleCover, articleDate,usname);
    let msg='';
    try {
        await inlog(req);
        let time=moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
        if (id === undefined) {
            let adarticle = await query('insert into sys_article(article_title,article_content_html,article_content_md,article_abstract,article_cover,create_time,is_delete,username)values(?,?,?,?,?,?,?,?)',[articleTitle,articleContentHtml,articleContentMd,articleAbstract,articleCover,time,0,usname]);
            msg='添加成功！';
        } else {
            console.log(1);
            let up = await query('update sys_article set article_title=?,article_content_html=?,article_content_md=?,article_abstract=?,article_cover=?,create_time=? where id=?',[articleTitle,articleContentHtml,articleContentMd,articleAbstract,articleCover,time,id]);
            msg='修改成功！';
        }
        res.send({
            code: 200,
            msg:msg
        });
    } catch (e) {
        next(e);
    }
})

/**
 * 删除文章
 */
router.delete('/del/:id',async (req,res,next) => {
    let arid=req.params.id;
    try {
        await inlog(req);
        let deres=await query('delete from sys_article where id =?',[arid]);
        res.send({
            code: 200,
            msg: '删除成功！'
        })
    }catch (e) {
        next(e);
    }
})


module.exports = router;
