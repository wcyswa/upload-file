/**
 * create by wangchunyan1 on 2021/3/12
 */

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append('token','wcy');
    formData.append('file', file);
    formData.append('name', file.name);
    const serverUrl = 'http://localhost:3001/';
    console.log(file,formData,'格式化数据')
    const myHeaders = new Headers();

    // myHeaders.append('Content-Type', 'application/json; charset=UTF-8');

    return fetch(serverUrl,{
        headers:myHeaders,
        method:'post',
        body:formData
    }).then((response)=>{
        if (!response.ok) {
            throw new Error('uploadFile !response.ok');
        }
        return response.json();
    }).catch((err)=>{
        throw err;
    })
}
