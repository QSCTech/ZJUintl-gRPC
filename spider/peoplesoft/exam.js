const unirest = require("unirest");
const cheerio = require("cheerio");
const cheerioTableparser = require('cheerio-tableparser');
const login = require('./login')

const { parse_time, parse_date } = require('./utils')

const parse_data = (data) => {
    // Class, Description, Exam Type, Exam Date, Schedule, Room, Seat Number
    const res = [];
    for (let i = 0; i < data[0].length - 1; i++)
        res.push({
            class: '',
            description: '',
            type: '',
            dateStr: '',
            date: null,
            time: '',
            room: '',
            seat: '',
            startTime: null,
            endTime: null,
        })
    for (let i = 0; i < data.length; i++) {
        switch (i) {
            case 0:     // class
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].class = item.split('\n')[0];
                });
                break;
            case 1:     // description
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].description = item;
                });
                break;
            case 2: // type
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].type = item;
                });
                break;
            case 3: //date
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].dateStr = item;
                    res[index - 1].date = parse_date(item);
                });
                break;
            case 4: // time
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].time = item;
                    const tmp = item.split(' - ');
                    res[index - 1].startTime = parse_time(tmp[0])
                    res[index - 1].endTime = parse_time(tmp[1])
                });
                break;
            case 5: // room
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].room = item;
                });
                break;
            case 6: // seat
                data[i].forEach((item, index) => {
                    if (!index)
                        return;
                    res[index - 1].seat = item;
                });
                break;
            default:
                break;
        }
    }
    return res;
}

const get_exam = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("GET", "http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_EXAM_L.GBL");
        req.query({
            "ICAGTarget": "start",
            "": ""
        });

        req.headers({
            "cache-control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
            "Upgrade-Insecure-Requests": "1",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL?CONTEXTIDPARAMS=TEMPLATE_ID%3aPTPPNAVCOL&scname=ADMN_ENROLLMENT1",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,la;q=0.7",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
        });

        req.end(function (res) {
            if (res.error) {
                reject(res.error);
                return;
            }
            const $ = cheerio.load(res.body);
            cheerioTableparser($);
            const data = $(".PSLEVEL1GRIDWBO").parsetable(false, false, true);
            // console.log($('.PABOLDTEXT').text())
            resolve(parse_data(data));
        });
    })
}

const main = async (user) => {
    try {
        const cookie = await login(user);
        const res = await get_exam(cookie);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
module.exports = main
// main({
//     username: '3170111705',
//     password: ''
// }).then(res => {
//     console.log(res)
// })