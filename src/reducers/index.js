/**
 * Created by admin on 2017/7/6.
 */
import {combineReducers} from 'redux';
import * as reducer from './reducers';
import * as purVip from './purVip';
import * as loginInfo from './loginInfo';
import * as MaskState from './mask';
import * as ReleaseState from './release';

import Store from '../middlewares/configureStore';

var saveState = (state) => {
	console.log(state);
	try {
		var serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch (err) {
		// ...错误处理
	}
};

var loadState = () => {
	try { // 也可以容错一下不支持localStorage的情况下，用其他本地存储
		var serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			return undefined;
		} else {
			return JSON.parse(serializedState);
		}
	} catch (err) {
		// ... 错误处理
		return undefined;
	}
};

var reducers = combineReducers({
	...reducer,
	...purVip,
	...loginInfo,
	...MaskState,
	...ReleaseState,
});

// window.onbeforeunload = (e) => {
// 	var state = Store.getState();
// 	saveState(state);
// };

export default reducers;