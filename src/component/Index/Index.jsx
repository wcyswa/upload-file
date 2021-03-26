/**
 * create by wangchunyan1 on 2021/3/12
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Index extends Component{

    render() {
        return(
            <div>
                <ul>
                    <li>
                        <Link to='/index1'>文件上传</Link>
                        <Link to='/index2'>跨域</Link>
                    </li>
                </ul>
            </div>
        )
    }
}
