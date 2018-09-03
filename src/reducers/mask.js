
/*遮罩二维码状态*/

import { UPDATEMASK,CLOSEMASK,PROMPT } from '../actions/mask';

export const MaskState = (
	state = {
		isShow:false,
		headimgurl:''
	},action) => {
	//console.log(action);
	switch (action.type) {
		case UPDATEMASK:
			return {
				isShow:true,
				...action.state
			};
		case CLOSEMASK:
			return {
				isShow:false,
				headimgurl:''
			};
		case PROMPT:
			return {
				isShow:true,
				...action.state
			};
		default:
			return state;
	}
};