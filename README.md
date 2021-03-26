大文件上传，断点续传（给切片编号）

原理
1.切片，通过Bold.slice切片
2.上传之前首先检查整个文件是否上传，如果部分上传，返回已经上传的代码切片
3.找出没有上传的代码，进行上传
4.上传过程中看，已经上传的，跟现在上传完成的是否达到总的上传数
5.前端告知全部上传成功，后端则开始合并切片（按照上传之前前端给切片的排序）
6.大工告成

前端：
react 页面展示
Blod#slice实现文件切片
FileReader + spark + md5 + web-worker生成hash文件
xhr发送FormData

后端：
nodejs
multiparty 处理formData

start:
npm start 启动前端服务
node server/app.js 启动后端服务


less 
将less文件编译为css文件，不能直接less文件
注意：https://github.com/ljianshu/Blog
