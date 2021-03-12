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

    onUpload=async ()=>{
        const fileList = this.myFile.current.files;
        if(!fileList.length){
            alert('请选择文件')
        }
        const promise = [];
        for(let file of fileList){
            console.log(file,'文件')
            promise.push(await uploadFile(file));
        }
        const result = Promise.all(promise);
        console.log(result,'结果')
    }

    request

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
