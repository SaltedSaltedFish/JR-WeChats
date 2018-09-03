
let array = [],ages = [];

for (let i = 10;i<70;i++ ) {
	ages.push({
		value:i,
		label:i
	});
};

ages.push({
	value:'不限',
	label:'不限'
});

array.push(ages);

export const tab = [
	{ title: '文章转发'},
	{ title: '投票'},
	{ title: '点赞留言'},
];

export const gender = [
	[
		{
			value:'男',
			label:'男'
		},{
			value:'女',
			label:'女'
		},{
			value:'不限',
			label:'不限'
		}
	]
];

export const frequency = [
	[
		{
			value:'一万次',
			label:'一万次'
		},{
			value:'二万次',
			label:'二万次'
		},{
			value:'三万次',
			label:'三万次'
		}
	]
];

export const age = array;
