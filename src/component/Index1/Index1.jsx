/**
 * create by wangchunyan1 on 2021/3/12
 */
import React, { Component } from 'react';

import { uploadFile } from "../../util/request";

export default class Index1 extends Component{

    constructor(props) {
        super(props);
        this.myFile = React.createRef();
    }

    container = {file:null,hash:'',worker:null};
    data = [];

    request({url, method = "post", data, headers = {}, onProgress = e => e, requestList}) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = onProgress;
            xhr.open(method, url);
            Object.keys(headers).forEach(key =>
                xhr.setRequestHeader(key, headers[key])
            );
            xhr.send(data);
            xhr.onload = e => {
                // 将请求成功的 xhr 从列表中删除
                if (requestList) {
                    const xhrIndex = requestList.findIndex(item => item === xhr);
                    requestList.splice(xhrIndex, 1);
                }
                resolve({
                    data: e.target.response
                });
            };
            // 暴露当前 xhr 给外部
            requestList?.push(xhr);
        });
    }

    // 生成切片文件
    createFileChunk(file,size=10*1024*1024){
        const fileChunkList = [];
        let curSize = 0;
        while (curSize < file.size){
            fileChunkList.push({file: file.slice(curSize,curSize+size)});
            curSize+=size;
        }
        return fileChunkList;
    }

    // 给切片生成hash web-worker
    calculateHash(fileChunkList){
        return new Promise(resolve => {
            this.container.worker = new Worker('../../public/hash.js');
            this.container.worker.postMessage({fileChunkList});
            this.container.worker.onmessage = e => {
                const { percentage, hash } = e.data;
                if(hash){
                    resolve(hash);
                }
            }
        })
    }

    // 根据hash验证文件是否曾经被上传过，没有才上传
    async verifyUpload(filename,fileHash){
        const {data} = await this.request({url:'http://localhost:3001/verify',headers: {"content-type": "application/json"},data:JSON.stringify({filename,fileHash})});
        return JSON.parse(data);
    }

    onUpload=async ()=>{
        const fileList = this.myFile.current.files;
        if(!fileList.length){
            alert('请选择文件')
        }
        // 生成切片文件，获取切片数组
        const fileChunkList = this.createFileChunk(fileList);

        // 生成hash
        this.container.hash = await this.calculateHash(fileChunkList);

        const { shouldUpload, uploadedList } = await this.verifyUpload(this.container.file.name, this.container.hash);
        if(!shouldUpload){
            alert('秒传：上传成功')
            return;
        }

        this.data = fileChunkList.map(({ file }, index) => ({
            fileHash: this.container.hash,
            index,
            hash: this.container.hash + "-" + index,
            chunk: file,
            size: file.size,
            percentage: uploadedList.includes(index) ? 100 : 0
        }));
        await this.uploadChunks(uploadedList);
    }


    render() {
        return(
            <div>
                <h3>单文件上传</h3>
                <div>
                    选择文件<input type="file" ref={this.myFile}/>
                    <div>
                        <button onClick={this.onUpload}>上传</button>
                    </div>
                </div>
            </div>
        )
    }
}
