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
安装了lite-server
lite-server // to run


less 
将less文件编译为css文件，不能直接less文件
注意：https://github.com/ljianshu/Blog



跨域
同源策略是一种约定，是浏览器核心也是最基本的安全功能，缺少同源，浏览器很容易受到xss，csrf等攻击
同源：协议+域名+端口三者相同
跨域：协议、域名、端口有一个不同都是跨域

同源策略的内容：
cookie，localStorage,indexDB存储性内容
dom节点
ajax请求发送后，被浏览器拦截

以下三个标签允许跨域加载资源
<img src=XXX>
<link href=XXX>
<script src=XXX>

跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了

跨域解决方案
1.jsonp
原理：借助script标签
实现流程
    1.声明一个回调，其函数名如show,当参数值，传递给跨域请求数据的服务器，函数形参为要获取目标数据（服务器返回的data）
    2.创建一个script标签，把跨域的api数据接口地址，给script的src,还要在这个地址中向服务器传递该函数名
    3.服务器收到请求，需要特殊处理：把函数名和它需要给你的数据拼接成一个字符串，eg：传递的是show,准备的数据是show('不爱')
    4.最后服务器把准备的数据通过http协议返回给客户端，客户端再调用执行之前声明的回调函数show,对返回数据进行操作
代码地址：前端jsonp.html  后端server/app.js

2.cros 需要浏览器和后端同时支持，ie8和9通过XDomainRequest实现

