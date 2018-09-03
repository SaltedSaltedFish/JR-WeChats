/**
 * Created by admin on 2017/8/3.
 * 时间格式转换  yyyy-mm-dd || yyyy-mm-dd hh:mm
 */

function zero(m){
    return m<10?'0'+m:m;
}


function tool (obj,type) {
    var date = new Date(obj);
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    m = zero(m);
    d = zero(d);

    if (type == 'minutes') {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        hours = zero(hours);
        minutes = zero(minutes);
        return y + '-' + m + '-' + d +' '+ hours + ':'+ minutes + ':00';
    } else if (type == 'year') {
	    return y;
    } else {
		return y+'-'+m+'-'+d;
    }

}


class _TimeConversion {
    constructor(){

        this.TIME = obj => {
            return tool(obj)
        };

        this.time = obj => {
            return tool(obj,'minutes');
        };

        this.search = obj => {
            //console.log(obj);
        };

        this.date = _ => {
            let date_ = this.TIME(new Date());
            return date_;
        };

        this.getTime = (time) => {
            time = time?new Date(time):new Date();
            return time.getTime();
        };

        this.year = time => {
	        return tool(time,'year');
        };
    }
}

var TimeConversion = new _TimeConversion();

export default TimeConversion;

