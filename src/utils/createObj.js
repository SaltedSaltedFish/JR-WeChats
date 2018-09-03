
export const CreateObj = (obj) => {
	let areaArray = [];
	//console.log(obj,areaArray);
	obj.map((s,v)=>
		areaArray[v] = {
			value:s,
			label:s
		}
	);
	return areaArray;
};