var http =  require("http")
var fs = require("fs") // 读取文件1
var server = http.createServer()

server.on('request',function(req,res){
  // 读取文件2
  var url = req.url
  if(url === '/'){
    fs.readFile("../../index.html",function(err,data){
      if(err){
        res.setHeader("content-Type","text/plain,chartset=utf-8")
        console.log("404无法读取文件")
      }else if(data){
        res.setHeader("content-Type","text/html,chartset=utf-8")
        res.end(data)
      }
    })
  }
})


// 绑定端口号启动服务器
server.listen(3000,function(){
  console.log('服务器启动成功 可通过 http://127.0.0.1:3000 访问')
})


