/**
 * Created by admin on 2017/7/12.
 */

import React,{Component} from 'react';
import { Modal } from 'antd-mobile';
require("es6-promise").polyfill();
require("isomorphic-fetch");
// 需要替换测试地址，暂时的处理方式
let URL = httpRequest;

function checkStatus (res){
    if (res.status >= 200 && res.status < 300) {
        return res;
    }
    var error = new Error(res.statusText);
    error.res = res;
    throw error;
};

/*
* @param
* -1 全局返回异常
* 0 成功
* 1 失败
* -2 没有权限
* -3 需要登录
* */
function checkCode (res){
    //console.log(res);
    if (res.errorCode == -1) {
	    //alert('系统错误，请稍后在试');
    } else if(res.errorCode == -3) {
        //console.log('登录信息过期');
        Modal.alert('','登录信息过期');
        window.location.href = '#/login';
    } else if (res.errorCode == 1) {
	    //alert('系统错误，请稍后在试');
        //message.warning(res.errorMsg);
    } else if (res.errorCode == -2) {
	    //alert('系统错误，请稍后在试');
    }
};

function timeout(promise) {
    return new Promise(function(resolve, reject) {
        //  超时控制
        setTimeout(function() {
            reject({timeout:'timeout'});
        }, 100000000000);
        promise.then(resolve, reject);
    })
}

function test (url) {
    var reg = new RegExp('login');
    var regCode = new RegExp('getImageCode');

    reg.test(url);
    //console.log(url,reg.test(url),regCode.test(url));
}
class _Api {
    constructor(){
        this.get = (url,postData) => {

            if (postData) {
                let a = Object.keys(postData);
                let text = '';
                a.map(s=>{
                    if ( postData[s] && postData[s] != ' ') {
	                    text += (s + '=' + postData[s] + '&');
                    };
                    // !postData[s]?postData[s] = '':postData[s];
                    // text += (s + '=' + postData[s] + '&');
                });
                url = url+ '?'+ text;
            } else {
                url +='?'
            }

            //url += 'apptoken='+localStorage.token + '&userAccount=' + localStorage.userAccount;
            let request = new Request(URL+url,{
                method:'GET'
            });
            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json()
                })
                .then(json => {

                    checkCode(json);
                    return json
                })
                .catch(error => {
                    console.log(error,error.timeout);
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
        this.post = (url,postData) =>{
            if(url.indexOf('login')!=0 && url.indexOf('getImageCode')!=0 && url.indexOf('empLogin') != 0) {
                //url = url+'?access_token='+token;
                //postData.apptoken = token;

                //postData.apptoken = localStorage.token;
                //postData.userAccount = localStorage.userAccount;
            }
            let formData = new FormData();

            for (let v in postData) {
                if(!postData[v]) {
                    postData[v] = '';
                }
                formData.append(v,postData[v]);
                //console.log(postData);
            };
            let request = new Request(URL+url,{
                method:'POST',
                body:formData,
                //credentials: "include"    //  携带cookie
            });

            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json();
                })
                .then(json => {
                    checkCode(json);
                    return json
                })
                .catch(error => {
                    //console.log(error,error.timeout);
                    if(error.timeout == 'timeout') {
                        //message.warning('服务器请求超时')
                    }
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
        this.put = (url,putData) => {
	        let formData = new FormData();

	        for (let v in putData) {
		        if(!putData[v]) {
			        putData[v] = '';
		        }
		        formData.append(v,putData[v]);
		        //console.log(postData);
	        };
	        let request = new Request(http + 'ZDQ/' +url,{
		        method:'POST',
		        body:formData,
		        //credentials: "include"    //  携带cookie
	        });

	        return timeout(fetch(request))
		        .then(res => {
			        checkStatus(res);
			        return res.json();
		        })
		        .then(json => {
			        checkCode(json);
			        return json
		        })
		        .catch(error => {
			        //console.log(error,error.timeout);
			        if(error.timeout == 'timeout') {
				        //message.warning('服务器请求超时')
			        }
			        //message.warning('服务器请求超时');
			        return error;
		        });
        };
    }
}

let Api = new _Api();

export default Api
