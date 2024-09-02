export class TimeUtils {


    private static checkTime(i) { //将0-9的数字前面加上0，例1变为01
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    public static dateFormatLefer(leftTime: number) {
        let days = Math.floor(leftTime / 60 / 60 / 24); //计算剩余的天数
        let hours = Math.floor(leftTime / 60 / 60 % 24); //计算剩余的小时
        let minutes = Math.floor(leftTime / 60 % 60);//计算剩余的分钟
        let seconds = Math.floor(leftTime % 60);//计算剩余的秒数
        hours = this.checkTime(hours);
        minutes = this.checkTime(minutes);
        seconds = this.checkTime(seconds);
        if (days > 0) {
            return days + "d " + hours + ":" + minutes + ":" + seconds;
        } else {
            return hours + ":" + minutes + ":" + seconds;
        }
    }


    public static formatGameTime(gameTime: number) {
        let days = Math.floor(gameTime / 60 / 60 / 24); //计算剩余的天数
        let hours = Math.floor(gameTime / 60 / 60 % 24); //计算剩余的小时
        let minutes = Math.floor(gameTime / 60 % 60);//计算剩余的分钟
        let seconds = Math.floor(gameTime % 60);//计算剩余的秒数
        hours = this.checkTime(hours);
        minutes = this.checkTime(minutes);
        seconds = this.checkTime(seconds);
        let str = minutes + ":" + seconds;
        if (hours > 0) {
            str = hours + ":" + str
        }
        if (days > 0) {
            str = days + "d " + str
        }
        return str;
    }

    /**
     * 格式化时间戳
     * @param  {string} fmt 格式化模版
     * @param  {number} time    单位秒
     * @return string 
     */
    public static dateFormatMS(fmt: string, time: number): string {
        let date = new Date(time);
        let o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }


    public static compareTime(timeStr1, timeStr2) {
        let time1 = new Date(timeStr1).getTime();
        let time2 = new Date(timeStr2).getTime();
        return time1 > time2;
    }
}