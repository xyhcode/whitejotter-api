const crypto=require('crypto')
const multer = require("multer");
const path = require("path");
const fs=require('fs')
const query = require("../db");

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
async function inlog(clasname, time, runtime, ip, medodname, para, remak, usname) {
    let cf = await query('insert into sys_log(classes_name,create_time,run_time,ip,methods_name,paramses,remark,user_name)values (?,?,?,?,?,?,?,?)',[clasname,time,runtime,ip,medodname,para,remak,usname]);
}
module.exports={
    md5,upload,inlog
}
