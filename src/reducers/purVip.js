
import { GETPURVIP } from '../actions/pruVip';

export const PurVipStore = (state = {data:[]},action) => {
	//console.log(action);
	switch (action.type) {
		case GETPURVIP:
			return {data:action.state};
		default:
			return state;
	}
};