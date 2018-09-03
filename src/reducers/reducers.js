/**
 * Created by admin on 2017/7/6.
 */


export const EmployeeWorksheetList = (state = {name:'emp'},action) => {
	//console.log(action.type);
	switch (action.type) {
		case '2':
			return action;
		default:
			return state;
	}
};