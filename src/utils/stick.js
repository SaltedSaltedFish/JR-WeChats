
/*时间对比换算*/
class Stick {
	constructor(){


		this.timeHuan=obj=>{
			console.log(obj);
			let time1=new Date(obj.replace(/-/g, "/"));
			console.log(time1);
			time1=time1.getTime();
			let time2=parseInt(obj.split(" ")[1].split(":")[0])*3600+parseInt(obj.split(" ")[1].split(":")[1])*60+parseInt(obj.split(" ")[1].split(":")[2]);
			obj=parseInt(time1)+time2*1000;
			return obj;
		};

		this.isStick = obj => {

			let stick_Date= new Date(obj.replace(/-/g, "/"));
			let date = new Date();
			stick_Date = stick_Date.getTime();
			date = date.getTime();
			//
			let isSticks = stick_Date > date;
			let stickTime = isSticks?this.deadLine(stick_Date - date):null;
			//console.log(date.getTime());
			//console.log(stick_Date.getTime());
			//console.log(stick_Date.getTime() > date.getTime());

			return ({isSticks,stickTime})
		};

		this.deadLine = mss => {
			let array = [];
			let days = parseInt(mss / (1000 * 60 * 60 * 24));
			let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = parseInt((mss % (1000 * 60)) / 1000);
			//console.log(days + "天");
			//console.log(hours + "小时");
			//console.log(minutes + "分钟");
			//console.log(seconds + "秒");
			if (days > 0) {
				array.push(days + '天');
			};
			if (hours > 0) {
				array.push(hours + '小时');
			};
			if (minutes > 0) {
				array.push(minutes + '分钟');
			};
			if (seconds > 0) {
				array.push(seconds + '秒');
			};

			//console.log(array.join(''));
			return array.join('');
		};
	}
}

Stick = new Stick();
export default Stick;