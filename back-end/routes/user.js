// 专门处理用户相关的接口
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';

// 获取影片列表  location:3000/api/film/list
router.get('/login', function (req, res) {
  var phone = req.query.phone // 电话号码
  var code = req.query.code // 验证码
  if (phone == '' || code == '') {
    res.json({
      code: 1,
      msg: '电话号码或验证码不能为空',
      data: {
        'phone': phone,
        'code': code
      }
    })
  } else if (/^\d{11}$/.test(phone) && /^\d{6}$/.test(code)) {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) {
        // 直接返回错误
        console.log('链接数据库失败', err);
        res.json({
          code: 1,
          msg: '网络异常, 请稍候重试',
          data: {
            'phone': phone,
            'code': ''
          }
        })
      } else {
        var db = client.db('maizuo');
        db.collection('user').find({'phone': phone}).toArray(function (err, arr) {
          if (err) {
            res.json({
              code: 1,
              msg: '查询失败',
              data: {
                'phone': phone,
                'code': ''
              }
            })
          } else {
            res.json({
              code: 0,
              msg: '查询成功',
              data: {
                'phone': phone,
                'code': arr[0].code
              }
            })
            // 关闭服务器连接
            client.close();
          }
        })
      }
    })
  } else {
    res.json({
      code: 1,
      msg: '电话号码或验证码错误',
      data: {
        'phone': phone,
        'code': ''
      }
    })
  }
})
module.exports = router;