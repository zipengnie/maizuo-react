// 专门处理影片相关的接口
var express = require('express');
var router = express.Router();
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';

// 获取影片列表  location:3000/api/film/list
router.get('/list', function(req, res) {
  var pageNum = parseInt(req.query.pageNum) || 1; // 当前第几页
  var pageSize = parseInt(req.query.pageSize) || 5; // 每页显示多少条
  var type = parseInt(req.query.type) || 2; // 影片的类型，正在上映or即将上映 1-正在上映 2-即将上映
    console.log(req.query)
  // 1. 需要获取到整个影片的数据条数 - 根据 type 来区分。
  // 2. 根据传递过来的参数计算  skip  limit

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

      async.waterfall([
        function (cb) {
          var param = {};
          if (type === 1) {
            // 正在热映
            param = {
              premiereAt: { $lt: new Date().getTime() / 1000 }
            }
          } else {
            // 即将上映
            param = {
              premiereAt: { $gte: new Date().getTime() / 1000 }
            }
          }
          console.log(param)
          db.collection('films').find(param).count(function(err, num) {
            if (err) {
              cb(err);
            } else {
              console.log(num)
              cb(null, num);

            }
          })
        },

        function (num, cb) {
          var param = {};
          if (type === 1) {
            // 正在热映
            param = {
              premiereAt: { $lt: new Date().getTime() / 1000 }
            }
          } else {
            // 即将上映
            param = {
              premiereAt: { $gte: new Date().getTime() / 1000 }
            }
          }

          db.collection('films').find(param).skip(pageSize * pageNum - pageSize).limit(pageSize).toArray(function(err, data) {
            if (err) {
              cb(err);
            } else {
              cb(null, {num: num, data: data});
            }
          })
        }
      ], function(err, result) {
        if (err) {
          console.log(err);
          res.json({
            code: 1,
            msg: '错误'
          })
        } else {
          res.json({
            code: 0,
            msg: 'OK',
            data: {
              films: result.data,
              total: result.num
            }
          })
        }
        console.log(res.json.data)
        // 关闭服务器连接
        client.close();
      })
    }
  })
})


module.exports = router;
