
/*暂时不清楚*/
class PickerData {
	constructor(){

		this.seasons = obj => {
			let array = [];
			obj.map(s=>
				array.push({value:s.id+'-'+s.name,label:s.name})
			);
			return array;
		};
	}
}

PickerData = new PickerData();
export default PickerData;