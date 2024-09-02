import { Color, Graphics, Node, UITransform, sys } from "cc";
import { GameUtils } from "../../../Scripts/game/utils/GameUtils";
import { WebGameUtils } from "../../../Scripts/webutils/WebGameUtils";
import { DefaultToast } from "../../UIKit/Example/DefaultToast";

export class Utils {
    /**
     * 判断两个值是否相等
     */
    public static valueEqual(value1, value2) {
        if (value1 == null || value2 == null) {
            return false;
        }
        return value1.toString() == value2.toString();
    }
    /**
     * 获取从min-max之间的值
     * @param min
     * @param max
     */
    public static rang(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
    /**
     * 将val的值限制起来
     * @param val
     * @param minLmc
    public static limit(val: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, val));
    }
    public static accMul(num1, num2) {
        // return Number(new Big(num1).mul(new Big(num2)).round(2, 0));
    }
    /**
     * 计算两点距离
     * @param p1
     * @param p2
     * @returns {number}
     */
    public static distance(p1: any, p2: any): number {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    public static S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    /**
     * 判断直线A是否与线段B相交（线面相交）
     * @param A 线段A的一个端点
     * @param B 线段A的一个端点
     * @param C 线段B的一个端点
     * @param D 线段B的一个端点
     * @returns {boolean}
     */
    public static lineIntersectSide(A: any, B: any, C: any, D: any): boolean {
        var fC: number = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        var fD: number = (D.y - A.y) * (A.x - B.x) - (D.x - A.x) * (A.y - B.y);
        if (fC * fD > 0) {
            return false;
        }
        return true;
    }
    /**
     * 判断直线A是否与线段B相交（面面相交）
     * @param A 线段A的一个端点
     * @param B 线段A的一个端点
     * @param C 线段B的一个端点
     * @param D 线段B的一个端点
     * @returns {boolean}
     */
    public static sideIntersectSide(A: any, B: any, C: any, D: any): boolean {
        if (!Utils.lineIntersectSide(A, B, C, D))
            return false;
        if (!Utils.lineIntersectSide(C, D, A, B))
            return false;
        return true;
    }
    /**
     * 通过边获取角度
     * @param oppositeSideLen 对边长
     * @param adjacentSide 邻边长
     */
    public static getAngleBySide(oppositeSideLen: number, adjacentSideLen: number): number {
        return Math.atan(oppositeSideLen / adjacentSideLen) * (180 / Math.PI);
    }

    /**
     * 返回以x轴右方为0开始的顺时针旋转的角度
     * centralPointX:中心点x坐标
     * centralPointY:中心点y坐标
     * distancePointX:距离点x坐标
     * distancePointY:距离点y坐标
     */
    public static pointAmongAngle(centralPointX: number, centralPointY: number, distancePointX: number, distancePointY: number): number {
        let valueX = distancePointX - centralPointX;
        let valueY = distancePointY - centralPointY;
        let m_pDegrees = 0;
        if (valueX == 0 && valueY == 0) {
            return 0;
        }
        else if (valueX >= 0 && valueY >= 0) {
            m_pDegrees = Math.atan(valueY / valueX) * 180 / Math.PI;
        }
        else if (valueX <= 0 && valueY >= 0) {
            m_pDegrees = Math.atan(Math.abs(valueX) / valueY) * 180 / Math.PI + 90;
        }
        else if (valueX <= 0 && valueY <= 0) {
            m_pDegrees = Math.atan(Math.abs(valueY) / Math.abs(valueX)) * 180 / Math.PI + 180;
        }
        else if (valueX >= 0 && valueY <= 0) {
            m_pDegrees = Math.atan(valueX / Math.abs(valueY)) * 180 / Math.PI + 270;
        }
        return m_pDegrees;
    }
    /**
     * 一维数组转二维数组
     * @param arr   要转换的数组
     * @param cols  单行列数
     */
    public static arrToArr2(arr: any[], cols: number): any[] {
        let arr2: any[] = [];
        if (arr) {
            let rowArr: any[];
            for (let i: number = 0, iLen: number = arr.length; i < iLen; i++) {
                if (i % cols === 0) {
                    rowArr = [];
                    arr2.push(rowArr);
                }
                rowArr.push(arr[i]);
            }
        }
        return arr2;
    }

    /**
     * 从地址上获取key
     * @param name {string} 要获取的key名称
     * @returns {string} key值
     * @platform Web
     * @code utf-8
     */
    public static getURLQueryString(name: string, useTrueUrl: boolean = true): string {
        if (sys.isBrowser) {
            var url: string;
            if (useTrueUrl && WebGameUtils.SECERT_TOKEN) {
                url = decodeURIComponent(WebGameUtils.SECERT_TOKEN);
            } else {
                url = decodeURIComponent(window.location.href);
            }
            url = url.replace(/&quot/g, "\"");
            var r;
            if (url.indexOf("#?") > 0) {
                url = url.replace("#?", "&");
                r = url.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
            } else {
                if (useTrueUrl && WebGameUtils.TRUE_SEARCH) {
                    r = WebGameUtils.TRUE_SEARCH.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"))
                } else {
                    r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"))
                }
            }
            return r ? r[2] : "";
        }
        return "";
    }
    /**
        * 元素是否包含在Array里
        * @param el
        * @param arr
        * @returns {boolean}
        */
    static isElinArr(el: any, arr: any[]) {
        return arr.indexOf(el) > -1;
    }
    public static angle(startx, starty, endx, endy) {
        let diff_x = endx - startx;
        let diff_y = endy - starty;
        // 返回角度，不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    }
    /**
     * 2个Array是否有相交元素
     * @param arr1
     * @param arr2
     */
    static isArrCrossing(arr1: any[], arr2: any[]) {
        for (var i = 0; i < arr1.length; i++) {
            if (Utils.isElinArr(arr1[i], arr2)) {
                return true;
            }
        }
        return false;
    }
    public static removeArrayItem(arr: Array<any>, item: any) {
        var index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
    public static directionSort(dealer: number, playerLength) {
        let dirArr = [];
        for (let i = dealer + 1; i <= playerLength; i++) {
            dirArr.push(i);
        }
        for (let i = 1; i < dealer; i++) {
            dirArr.push(i);
        }
        dirArr.push(dealer);
        return dirArr;
    }

    /**
     * 角度转化弧度
     * @param val
     */
    public static ang2rad(val: number): number {
        return val / 180 * Math.PI;
    }

    /**
     * 点是否在矩形中
     * @param collX 
     * @param collY 
     * @param collW 
     * @param collH 
     * @param vc2 
     */
    public static collectHasPoint(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number): boolean {
        return (x2 >= x1 && x2 <= x1 + h1) && (y2 >= y1 && y2 <= y1 + h1)
    }


    public static randomArrValue(arr: any[]) {
        return arr[Math.floor((Math.random() * arr.length))];
    }


    public static mapValue2List(map: Map<any, any>) {
        let list = [];
        map.forEach((value, key) => {
            list.push(value);
        })
        return list;
    }

    public static replaceString(inputString: string, searchString: string, replaceString: string): string {
        return inputString.replace(new RegExp(searchString, 'g'), replaceString);
    }

    //检测字符串是否纯数字
    public static checkIsPureNum(str: string) {
        if (Number(str) + "" !== NaN + "") {
            return true;
        } else {
            return false;
        }
    }

    //检测字符串是否纯字母
    public static checkIsPureAbc(str: string) {
        let isletter = /^[a-zA-Z]+$/.test(str);
        return isletter;
    }

    //生成二维码
    public static QRCreate(node: Node, url) {
        if (!node) return
        let ctx = node.getComponent(Graphics)
        ctx.clear();
        let qrcode = new window['QRCode'](-1, 1)
        qrcode.addData(url)
        qrcode.make()
        ctx.fillColor = Color.BLACK
        let tileW = node.getComponent(UITransform).width / qrcode.moduleCount
        let tileH = node.getComponent(UITransform).height / qrcode.moduleCount
        for (let row = 0; row < qrcode.moduleCount; row++) {
            for (let col = 0; col < qrcode.moduleCount; col++) {
                if (qrcode.isDark(row, col)) {
                    let W = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
                    let H = (Math.ceil(row + 1) * tileW - Math.floor(row * tileW))
                    ctx.rect(Math.round(col * tileW), Math.round(row * tileH), W, H)
                    ctx.fill()
                }
            }
        }
    }

    /**
     * H5复制
     *
     * @static
     * @param {*} string
     * @return {*} 
     */
    public static webCopyString(string) {
        if (sys.isBrowser) {
            navigator.clipboard.writeText(string);
        } else {
            GameUtils.setClipBordStr(string);
        }
        DefaultToast.instance.showText("复制成功")
    }

    /**
     * 截取字符长度
     * @param name //需要截取的字符串
     * @param len  //需要的长度 默认12字节
     */
    public static getShortName(name, len = 10, fromEnd = false) {
        let zifulen = name.length;
        let zijielen = name.replace(/[^\x00-\xff]/g, '**').length;
        if (zijielen <= len) {
            return name;
        }
        let result = "";
        let j = 0;
        if (fromEnd) {
            for (let i = zifulen - 1; i >= 0; i--) {
                let char = name.charAt(i);
                if (char.charCodeAt() > 255) {
                    j += 2;
                } else {
                    j++;
                }
                if (j <= len) {
                    result += char;
                } else {
                    return "..." + result;
                }
            }
        } else {
            for (let i = 0; i < zifulen; i++) {
                let char = name.charAt(i);
                if (char.charCodeAt() > 255) {
                    j += 2;
                } else {
                    j++;
                }
                if (j <= len) {
                    result += char;
                } else {
                    return result + "...";
                }
            }
        }

    }

    /**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

    // 日期格式化
    static parseTime(time, pattern) {
        if (arguments.length === 0 || !time) {
            return null
        }
        const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
                time = parseInt(time)
            } else if (typeof time === 'string') {
                time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
            }
            if ((typeof time === 'number') && (time.toString().length === 10)) {
                time = time * 1000
            }
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    }


    public static arrayHebing(arr: any) {
        const mergedObject = {};
        for (const obj of arr) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (!mergedObject.hasOwnProperty(key)) {
                        mergedObject[key] = obj[key];
                    } else {
                        mergedObject[key] = Array.from(new Set([...mergedObject[key], ...obj[key]]));
                    }
                }
            }
        }
        return mergedObject;
    }

    /**
     * 将数组中 指定的参数 返回一个新的数组
     * @param arr 
     * @param key 
     * @returns 
     */
    public static extractValuesByKey(arr, key) {
        if (!Array.isArray(arr)) {
            return [];
        }

        const extractedValues = [];
        for (const obj of arr) {
            if (obj && typeof obj === 'object' && key in obj) {
                extractedValues.push(obj[key]);
            }
        }

        return extractedValues;
    }
}