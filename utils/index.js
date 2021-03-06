const crypto=require('crypto')
const multer = require("multer");
const path = require("path");
const fs=require('fs')
const query = require("../db");
const moment = require("moment");


//文件上传
let upload=multer({
    storage:multer.diskStorage({
        destination:function (req,file,cb) {
            let date=new Date();
            let year=date.getFullYear();
            let month=(date.getMonth()+1).toString().padStart(2,'0')
            let day=date.getDate();
            let dir=path.join(__dirname,'../public/uploads/'+year+month+day);
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir,{recursive:true});
            }
            cb(null,dir);
        },
        //设置文件名
        filename:function (req,file,cb) {
            let filsname=Date.now()+path.extname(file.originalname);
            cb(null,filsname);
        }
    })
})
//密码加密
function md5(str){
    //参数为String类型
    return crypto.createHash('md5').update(String(str)).digest('hex')
}

//添加日志
async function inlog(req) {
    //获取用户名
    let usname=req.auth.sinresult.username || '游客';
    //时间格式化
    let time=moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    //获取用户IP
    let ip= req.ipInfo.ip.substr(7);
    //获取请求的地址
    let path=req.originalUrl;
    //获取请求参数
    let parm=req.query;
    let tsate=false;
    //判断对象是否为空
    for (const parmKey in parm) {
        tsate=true
    }
    if(tsate==false){
        parm='暂无参数...'
    }else{
        parm=parm;
    }
    //获取请求的方法
    let method=req.method;
    console.log(usname,time,ip,path,parm);
    try {
        let cf = await query('insert into sys_log(classes_name,create_time,run_time,ip,methods_name,paramses,user_name) values (?,?,?,?,?,?,?)', [path,time,time,ip,method,parm,usname]);
    }catch (e) {
        throw new Error(e);
    }
}
module.exports={
    md5,upload,inlog
}
