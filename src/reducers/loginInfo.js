
import * as sign from '../actions/signIn';

export const LoginInfo = (state = {
	data:{},
	disabled:true,
	sedCode:false,
	waitTime:60,
},action) => {
	//console.log(action);
	switch (action.type) {
		case sign.SIGNIN:
			state.data = action.state;
			return state;
			break;
		case sign.UPBUTTON:
			state.disabled = action.state;
			return state;
			break;
		case sign.VERCODE:
			state.sedCode = action.state;
			return state;
			break;
		case sign.WAITTIME:
			state.waitTime--;
			return state;
			break;
		default:
			return state;
	}
};