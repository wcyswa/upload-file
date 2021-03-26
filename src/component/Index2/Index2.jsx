/**
 * create by wangchunyan1 on 2021/3/12
 */
import React, { Component } from 'react';

export default class Index2 extends Component{


    jsonP({url,params,callback}){
        console.log(url,params,callback,'法法')
        return new Promise((resolve,reject)=>{
            let script = document.createElement('script');
            window[callback] = function(data) {
                console.log('发放')
                resolve(data);
                document.body.removeChild(script);
            }
            params = {...params,callback}
            let args = [];
            for(let key in params){
                args.push(`${key}=${params[key]}`)
            }
            script.src = `${url}?${args.join('&')}`;
            document.body.appendChild(script);
        })
    }

    clickMe(){
        this.jsonP({
            url:'http://localhost:3001/say',
            params:{wd:'i am full'},
            callback:this.show()
        }).then(data=>{
            console.log(data)
        })
    }

    show(data){
        console.log('看起',data)
    }

    render() {
        return(
            <div>
                <button onClick={this.clickMe.bind(this)}>点击</button>
            </div>
        )
    }
}
