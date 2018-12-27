// 专门处理影片相关的接口
var express = require('express');
var router = express.Router();
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';


// 获取影片列表  location:3000/api/film/list
router.get('/', function(req, res) {
  var filmId = parseInt(req.query.filmId); // 电影id
    console.log(req.query.filmId)
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      // 直接返回错误
      console.log('链接数据库失败', err);
      res.json({
        code: 1,
        msg: '网络异常, 请稍候重试'
      })
    } else {
      var db = client.db('maizuo');
        db.collection('films').find({'filmId': filmId}).toArray(function(err, data) {
          if (err) {
            res.json({
              code: 1,
              msg: '查询数据失败'
            })
          } else {
            res.json({
              code: 0,
              msg: '查询数据成功',
              data: data
            })
          }
        // 关闭服务器连接
        client.close();
      })
    }
  })
})


module.exports = router;
