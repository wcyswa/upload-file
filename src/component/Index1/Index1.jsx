/**
 * create by wangchunyan1 on 2021/3/12
 */
import React, { Component } from 'react';

import { uploadFile } from "../../util/request";

const SIZE = 10*1024*1024;
export default class Index1 extends Component{

    constructor(props) {
        super(props);
        this.myFile = React.createRef();
    }

    container = {file:null,hash:'',worker:null};
    data = [];//本地记录文件切片的上传情况
    requestList = []

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
    createFileChunk(file,size=SIZE){
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

    // 上传切片，同时过滤已上传的切片
    async uploadChunks(uploadedList = []){
        console.log(this.data,'所有切片')
        const requestList = this.data.filter(({hash})=>!uploadedList.includes(hash)).map(({chunk,hash,index})=>{
            const formData = new FormData();
            formData.append('chunk',chunk);
            formData.append('hash',hash);
            formData.append('filename',this.container.file.name);
            formData.append('fileHash',this.container.hash);
            return {formData,index}
        }).map(async ({formData,index})=>{
            await this.request({
                url:'http://localhost:3001',
                data:formData,
                requestList:this.requestList
            })
        });
        await Promise.all(requestList);
        //之前上传的切片数量+本次上传的切片数量 = 所有切片
        // 合并切片
        if(uploadedList.length+requestList.length === this.data.length){
            await this.mergeRequest();
        }
    }

    // 通知服务器合并切片
    async mergeRequest(){
        await this.request({
            url:'http://localhost:3001/merge',
            headers:{
                'content-type':'application/json'
            },
            data:JSON.stringify({
                size:SIZE,
                fileHash:this.container.hash,
                filename:this.container.file.name
            })
        })
        alert('上传成功')
    }

    onUpload=async ()=>{
        const fileList = this.myFile.current.files;
        if(!fileList.length){
            alert('请选择文件')
        }
        // 生成切片文件，获取切片数组
        const fileChunkList = this.createFileChunk(fileList[0]);
        console.log(fileChunkList,'切片后的文件',this.container)
        // 整个大文件生成hash
        // this.container.hash = await this.calculateHash(fileChunkList); // md5调用失败
        this.container.file = fileList[0];
        this.container.hash = 'testwcyswallow';

        // 根据文件名跟hash（通过文件内容生成，值唯一标识文件本身）值验证服务器是否已经存在
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
