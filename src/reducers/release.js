
import { GETCLASSIFY } from '../actions/release';

export const ReleaseState = (state = {data:[]},action) => {
	//console.log(action);
	switch (action.type) {
		case GETCLASSIFY:
			return {data:action.state};
		default:
			return state;
	}
};