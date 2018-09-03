import Api from '../api/request';

export const update = (type,state) => ({
	type,
	state,
});


//手动调用获取数据的aciton
export const getData = (path, postData,type) => {
	return dispatch => {
		return Api.get(path,postData)
			.then(state => {
				//  用来做请求判断
				//console.log(state);
				return state
			})
			.then( state => {
				dispatch(update(type,state.data));
				return state
			})
	}
};

export const postData = (path, postData,type) => {
	return dispatch => {
		return Api.post(path,postData)
			.then(state => {
				//  用来做请求判断
				//console.log(state);
				return state
			})
			.then( state => {
				dispatch(update(type,state.data));
				return state
			})
			//.then( state => dispatch(update(type,state.data)))
	}
};

export const post = (path, postData,type) => {
	return dispatch => {
		return Api.post(path,postData)
			.then(state => {
				//  用来做请求判断
				//console.log(state);
				return state
			})
		//.then( state => dispatch(update(type,state.data)))
	}
};

export const get = (path, postData,type) => {
	return dispatch => {
		return Api.get(path,postData)
			.then(state => {
				//  用来做请求判断
				//console.log(state);
				return state
			})
		//.then( state => dispatch(update(type,state.data)))
	}
};