const mysql=require('mysql')
const dboptions= require('./config')
//创建连接池
const pool=mysql.createPool(dboptions);
//查询方法
function query(sql,params){
    return new Promise((resolve,reject) => {
        pool.getConnection((err,conn)=>{
            if(err){
                reject(err);
                return;
            }
            //执行sql语句
            conn.query(sql,params,(err,result)=>{
                conn.release();
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
    })
}
module.exports=query
