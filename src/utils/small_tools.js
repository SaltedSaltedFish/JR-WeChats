
import { Modal } from 'antd-mobile';

//  深度复制
export const clone = (obj) => {
	let obj_key = {};
	for (let [key, value] of Object.entries(obj)) {
		//console.log([key, value]);
		obj_key[key] = value;
	}
	return obj_key;
};


//  查询所有的refs对象，并返回一个key_value

export const refsObj = (obj) => {

	let value = {};
	let objKeys = Object.keys(obj);

	for ( let i = 0; i < objKeys.length; i++ ) {
		let key = objKeys[i];
		let element = obj[objKeys[i]];
		//console.log(Boolean(element.dataset.must));

		if ( key == 'introduce' ) {
			element = element.textareaRef;
		};

		if ( Boolean(element.dataset.must) ) {
			if ( !element.value || element.value == ' ' ||element.value == undefined) {
				//Modal.alert('',element.dataset.name + '必填');
				return {};
			};
		};

		value[key] = element.value;

	};

	return value;
};

/*获取地址栏中的参数名称
* @param name string 参数名
* @param text string 需要查找的字符串
* */
export const GetQueryString = (name,text) => {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	//console.log(text.substr(1));
	let r = text.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	} else {
		return null;
	}// 调用方法alert(GetQueryString("参数名1"));
};