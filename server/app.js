/**
 * create by wangchunyan1 on 2021/3/12
 */

const Controller = require("./controller");
const http = require("http");
const server = http.createServer();

const controller = new Controller();

server.on("request", async (req, res) => {
    console.log('@@@@@@@@@@',req)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.status = 200;
        res.end();
        return;
    }
    if (req.url === "/verify") {
        await controller.handleVerifyUpload(req, res);
        return;
    }

    if (req.url === "/merge") {
        await controller.handleMerge(req, res);
        return;
    }

    if (req.url === "/") {
        console.log('结果')
        await controller.handleFormData(req, res);
    }
});

server.listen(3001, () => console.log("正在监听 3001 端口"));
