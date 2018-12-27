// 专门处理用户相关的接口
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';

// 获取影片列表  location:3000/api/film/list
router.get('/', function (req, res) {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      // 直接返回错误
      console.log('链接数据库失败', err);
      res.json({
        code: 1,
        msg: '网络异常, 请稍候重试',
      })
    } else {
      var db = client.db('maizuo');
      db.collection('cinemas').find().toArray(function (err, arr) {
        if (err) {
          res.json({
            code: 1,
            msg: '查询失败',
          })
        } else {
          res.json({
            code: 0,
            msg: '查询成功',
            data: arr
          })
          // 关闭服务器连接
          client.close();
        }
      })
    }
  })
})
module.exports = router;