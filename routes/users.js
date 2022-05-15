var express = require('express');
const query = require("../db");
const {PWD_SALT,PRIVATE_KEY,EXPIRED}=require('../utils/constant')
const jwt=require('jsonwebtoken')
const {md5, inlog} = require("../utils");
const {response} = require("express");
var router = express.Router();

/* GET users listing. */
/**
 * 用户登入
 */
router.post('/login', async function (req, res, next) {
  let {username, password} = req.body;
  try {
    password = md5(`${password}${PWD_SALT}`);
    let seus=await query('select * from admin_user where username=?',[username]);
    if(seus.length!==0){
      let seres = await query('select * from admin_user where username =? and password=?', [username, password]);
      if (seres.length>0) {
        if(seres[0].enabled===0){
          res.send({
            code:203,
            msg: '该用户已被禁用！'
          })
        }else{
          let sinresult=seres[0];
          //生成token
          let token=jwt.sign({sinresult},PRIVATE_KEY,{expiresIn:EXPIRED});
          let obj = {
            id:seres[0].id,
            username:seres[0].username,
            name:seres[0].name,
            phone:seres[0].phone,
            email:seres[0].email,
            enabled:seres[0].enabled,
            is_delete:seres[0].is_delete,
            identity:seres[0].identity,
            token:`Bearer ${token}`
          }
          res.send({
            code:200,
            msg:'登入成功！',
            data:obj
          })
        }
      }else{
        res.send({
          code:201,
          msg:'账号或密码错误！'
        })
      }
    }else{
      res.send({
        code:-1,
        msg:'用户未注册！'
      })
    }
  } catch (e) {
    next(e);
  }

});

/**
 * 用户注册
 */
router.post('/register',async (req, res, next) => {
  let {username,password,name,phone,email}=req.body;
  console.log(username,name,password,phone,email);
  username=username | '白卷';
  try{
    let se=await query('select * from admin_user where username = ?',[username]);
    if(se.length>0){
      res.send({
        code:101,
        msg:'账号已注册！'
      })
    }else{
      password=md5(`${password}${PWD_SALT}`);
      console.log(password);
      let ins=await query('insert into admin_user(username,password,name,phone,email,enabled,is_delete,identity) values (?,?,?,?,?,?,?,?)',[username,password,name,phone,email,1,0,0]);
      let serus=await query('select * from admin_user where id = ?',[ins. insertId]);
      res.send({
        code:200,
        msg:'注册成功',
        data:serus[0]
      })
    }
  }catch(e){
    next(e);
  }
})
/**
 * 获取所有的用户信息
 */
router.get('/',async (req,res, next) => {
  try {
    await inlog(req);
    let seres=await query('select * from admin_user');
    for (const item of seres) {
      let renj=await query('select * from admin_user_role where uid=?',[item.id]);
      item.roles=renj;
    }
    console.log(seres);
    res.send({
      code: 200,
      msg:'获取成功！',
      data:seres
    })
  }catch (e) {
    next(e);
  }
});

/**
 * 获取所有的权限
 */
router.get('/role',async (req,res, next) => {
  try {
    await inlog(req);
    let resse=await query('select * from admin_role');
    res.send({
      code: 200,
      msg:'获取成功！',
      data:resse
    })
  }catch (e) {
    next(e);
  }
})

/**
 * 是否禁用
 * @type {Router}
 */
router.put('/status',async (req, res, next) => {
  let {enabled,username}=req.body;
  try {
    await inlog(req);
    let mk;
    if(enabled=="true"){
      mk=0;
    }else{
      mk=1
    };
    let resse=await query('update admin_user set enabled=? where username=?',[mk,username]);
    res.send({
      code: 200,
      msg:'修改成功!'
    })
  }catch (e) {
    next(e);
  }
});

/**
 * 重置密码
 * @type {Router}
 */
router.put('/respassword',async(req, res, next)=>{
  let {username}=req.body;
  try {
    let password=md5(`123${PWD_SALT}`)
    let resse=await query('update admin_user set password=? where username=?',[password,username]);
    res.send({
      code: 200,
      msg:'修改成功！'
    })
  }catch (e) {
    next(e);
  }
});

/**
 * 编辑用户
 */
router.put('/editus',async (req, res, next)=>{
  //roles 用户选择的权限
  let {id,username,name,phone,email,roles}=req.body;
  console.log(roles);
  try {
    await inlog(req);
    let rese=await query('select * from admin_user where name = ?',[name]);
    if(rese.length!==0){
      res.send({
        code: 201,
        msg:'用户名重复！'
      })
    }else{
      //修改基本数据
      let up=await query('update admin_user set name=?,phone=?,email=? where id=?',[name,phone,email,id]);
      //查询用户的所有权限
      let useroles=await query('select * from admin_user_role where uid=?',[id]);
      //let insad=await query('insert into admin_user_role(uid,rid) values (?,?)',[id,v]);
      //let delin=await query('delete from admin_user_role where uid = ? and rid = ?',[id,item]);
      res.res({
        code: 200,
        msg:'修改成功'
      })
    }
  }catch (e) {
    next(e);
  }
});
module.exports = router;
