/*
 * @Author: Laphets
 * @Date: 2018-04-25 00:08:10
 * @Last Modified by: Laphets
 * @Last Modified time: 2019-02-17 21:29:43
 */

const unirest = require("unirest");
const cheerio = require("cheerio");

/**
 * Login and get the cookie
 * @param {object} data Data for user
 */
const login = require("./login")

/**
 * Get the weekly schedule table
 * @param {Array} cookie Authority Cookie
 */
const get_schedule_tabel = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("GET", "http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSEN" +
                "RL_SCHD_W.GBL");
        req.query({"ICAGTarget": "start"});
        req.headers({
            "Postman-Token": "e885e6e1-c9e2-4e51-9c69-3e91dd1621a9",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/65.0.3325.181 Safari/537.36",
            "Upgrade-Insecure-Requests": "1",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/c/NUI_FRAMEWORK.PT_AGSTARTPAGE" +
                    "_NUI.GBL?CONTEXTIDPARAMS=TEMPLATE_ID%3aPTPPNAVCOL&scname=ADMN_ENROLLMENT1",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                    "q=0.8"
        });
        req.end(function (res) {

            if (res.error) 
                reject(res.error);
            try {

                let $ = cheerio.load(res.body);
                if ($('#win0divPAGECONTAINER').text() == 'You are not authorized for this page.') {
                    //Wrong username or password
                    throw('USERWRONG');
                }
                let course = [];
                // console.log($('#WEEKLY_SCHED_HTMLAREA').html());
                let Entities = require('html-entities').XmlEntities;
                entities = new Entities();

                $('.SSSTEXTWEEKLY').each(function (i, elem) {
                    let result = $(elem)
                        .html()
                        .split('<br>');

                    // console.log(111); console.log(result);
                    let flag = `${result[0].split('-')[0]} ${result[2]} ${result[3].split('-')[0]}`.replace(/[ ]/g, "");
                    // console.log(flag);
                    course.push({
                        id: result[0],
                        name: entities.decode(result[1]),
                        type: result[2],
                        time: result[3],
                        room: entities.decode(result[4]),
                        instructor: entities.decode(result[6]),
                        flag
                    });
                });
                // console.log($('#WEEKLY_SCHED_HTMLAREA').text());
                // //resolve($('#WEEKLY_SCHED_HTMLAREA').html()); console.log(course);
                // console.log(res.body);
                resolve(course);
            } catch (error) {
                reject(error);
            }
        });
    });
}

/**
 * Doing some tricky thing emmmm.
 * @param {Array} cookie cookie for auth
 */
const step_1 = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("GET", "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_MD_SP_F" +
                "L.GBL");
        req.query({
            "Action": "U",
            "MD": "Y",
            "GMenu": "SSR_STUDENT_FL",
            "GComp": "SSR_START_PAGE_FL",
            "GPage": "SSR_START_PAGE_FL",
            "scname": "CS_SSR_MANAGE_CLASSES_NAV"
        });

        req.headers({
            "Postman-Token": "7a1a6a42-08b4-d1f9-44e9-d4a763a4e464",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Upgrade-Insecure-Requests": "1",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/c/NUI_FRAMEWORK.PT_LANDINGPAGE" +
                    ".GBL",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                    "q=0.8"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            resolve();
            // console.log(res.body);
        });

    })
}
/**
 * Doing some tricky thing emmmm.
 * @param {Array} cookie cookie for auth
 */
const step_2 = (cookie) => {
    return new Promise((resolve, reject) => {
        var req = unirest("GET", "http://scrsprd.zju.edu.cn/psc/CSPRD_newwin/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_ST" +
                "ART_PAGE_FL.GBL");

        req.query({
            "Page": "SSR_START_PAGE_FL",
            "Action": "U",
            "scname": "CS_SSR_MANAGE_CLASSES_NAV",
            "MD": "Y",
            "ICDoModal": "1",
            "ICGrouplet": "1",
            "ICLoc": "1",
            "nWidth": "286",
            "nHeight": "0"
        });

        req.headers({
            "Postman-Token": "1bb1664b-9db6-9a69-9da6-bc53462aaa5a",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_MD_SP_F" +
                    "L.GBL?Action=U&MD=Y&GMenu=SSR_STUDENT_FL&GComp=SSR_START_PAGE_FL&GPage=SSR_START" +
                    "_PAGE_FL&scname=CS_SSR_MANAGE_CLASSES_NAV",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Content-Type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "*/*"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            
            try {
                let $ = cheerio.load(res.body);
                //console.log(res.body);
                resolve($('li').attr('onclick').split(`'`)[1]);
            } catch (error) {
                reject(error);
            }
        });

    })
}
/**
 * Doing some tricky thing emmmm.
 * @param {Array} cookie cookie for auth
 */
const step_3 = (cookie, url) => {
    return new Promise((resolve, reject) => {

        const req = unirest("GET", url);
        req.query({"Page": "SSR_VW_CLASS_FL", "pslnkid": "CS_S201605040129258749603935"});

        req.headers({
            "Postman-Token": "b24ecf0b-eb85-dcc9-de06-37c74a60c065",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_MD_SP_F" +
                    "L.GBL?Action=U&MD=Y&GMenu=SSR_STUDENT_FL&GComp=SSR_START_PAGE_FL&GPage=SSR_START" +
                    "_PAGE_FL&scname=CS_SSR_MANAGE_CLASSES_NAV",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "*/*"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            let $ = cheerio.load(res.body);
            let ICElementNum = $('#ICElementNum').val();
            let ICStateNum = $('#ICStateNum').val();
            let ICSID = $('#ICSID').val();
            resolve({ICElementNum, ICStateNum, ICSID})
            // console.log(res.body);
        });

    })
}

/**
 * Getting the course details from another page
 * @param {Array} cookie cookie
 * @param {Number} ICElementNum
 * @param {Number} ICStateNum
 * @param {Number} ICSID
 * @param {*} info
 */
const step_4 = (cookie, ICElementNum, ICStateNum, ICSID, info) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_COMPONE" +
                "NT_FL.GBL");

        req.headers({
            "Postman-Token": "6ff85b8e-49fb-16dc-1842-5c5d0a6d2963",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_MD_SP_F" +
                    "L.GBL?Action=U&MD=Y&GMenu=SSR_STUDENT_FL&GComp=SSR_START_PAGE_FL&GPage=SSR_START" +
                    "_PAGE_FL&scname=CS_SSR_MANAGE_CLASSES_NAV",
            "Origin": "http://scrsprd.zju.edu.cn",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Content-Type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "*/*"
        });

        req.form({
            "ICAJAX": "1",
            "ICNAVTYPEDROPDOWN": "0",
            "ICType": "Panel",
            "ICElementNum": ICElementNum,
            "ICStateNum": ICStateNum,
            "ICAction": "DERIVED_SSR_FL_SSR_VW_CLSCHD_OPT$81$",
            "ICXPos": "0",
            "ICYPos": "0",
            "ResponsetoDiffFrame": "-1",
            "TargetFrameName": "None",
            "FacetPath": "None",
            "ICFocus": "",
            "ICSaveWarningFilter": "0",
            "ICChanged": "-1",
            "ICAutoSave": "0",
            "ICResubmit": "0",
            "ICSID": ICSID,
            "ICActionPrompt": "false",
            "ICTypeAheadID": "",
            "ICBcDomData": "C~UnknownValue~EMPLOYEE~HRMS~NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~PT_LANDINGPAGE~Stu" +
                    "dent Center~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOY" +
                    "EE/HRMS/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~UnknownValue",
            "ICDNDSrc": "",
            "ICPanelHelpUrl": "",
            "ICPanelName": "",
            "ICPanelControlStyle": "pst_side2-disabled pst_side1-fixed pst_side2-hidden pst_panel-mode",
            "ICFind": "",
            "ICAddCount": "",
            "ICAPPCLSDATA": "",
            "win1hdrdivPT_SYSACT_HELP": "psc_hidden",
            "DERIVED_SSR_FL_SSR_VW_CLSCHD_OPT$81$": "D"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            try {
                let $ = cheerio.load(res.body);
                let courses = [];
                $('.ps_box-scrollarea-row').each(function (i, elem) {
                    // console.log("begin");
                    let time = '';
                    $(elem)
                        .find('.psc_halign-left')
                        .children()
                        .each(function (i1, elem1) {
                            if (i1 == 2) {
                                time = $(elem1).text();
                            }
                        });
                    const tmp = time.split(' ');
                    let [week,
                        month,
                        date] = tmp;
                    let map = {
                        'Monday': 1,
                        'Tuesday': 2,
                        'Wednesday': 3,
                        'Thursday': 4,
                        'Friday': 5,
                        'Saturday': 6,
                        'Sunday': 7
                    }
                    let weeknum = map[week];
                    // let courses = [];
                    $(elem)
                        .find('tr')
                        .each(function (i1, elem1) {
                            let flag = '',
                                starttime = '';
                            $(elem1)
                                .find('td')
                                .each(function (i2, elem2) {
                                    if (i2 == 0) {
                                        //Time console.log($(elem2).text().replace(/[\n]/g, "")) console.log();
                                        starttime = $(elem2)
                                            .find('.ps_box-value')
                                            .text();
                                    } else if (i2 == 1) {
                                        // Course and location let all = $(elem2).find('a').text(); console.log(all);
                                        flag = $(elem2)
                                            .find('a')
                                            .text()
                                            .replace(/[ ]/g, "");
                                        // onecourse.location = $(elem2)     .find('.ps_box-value')     .text();
                                        // console.log($(elem2).find('a').text());
                                        // console.log($(elem2).find('.ps_box-value').text());
                                    }
                                    // console.log(i2, $(elem2).text());
                                });
                            flag = `${flag}${starttime}`.replace(/[ ]/g, "");
                            
                            console.log(flag);
                            const ojbk = info[flag];
                            if (ojbk) {
                                //Every-Two-Week
                                courses.push({
                                    id: ojbk.id,
                                    name: ojbk.name,
                                    time: ojbk.time,
                                    category: ojbk.type,
                                    place: ojbk.room,
                                    teacher: ojbk.instructor,
                                    week,
                                    month,
                                    date,
                                    weeknum
                                });
                            }
                        });
                    // console.log("end");
                });
                // console.log(courses); console.log(res.body);
                resolve(courses);
            } catch (error) {
                reject(error);
            }
        });

    })
}

const prase_info = (courses) => {
    let info = {};
    for (let i in courses) {
        if (!info[courses[i].flag]) {
            info[courses[i].flag] = courses[i];
        }
    }
    return info;
    // console.log(info);
}

/**
 * TOD
 * @param {*} cookie 
 * @param {*} ICElementNum 
 * @param {*} ICStateNum 
 * @param {*} ICSID 
 * @param {*} info 
 */
const get_course_another_way = (cookie, ICElementNum, ICStateNum, ICSID, info) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_COMPONE" +
            "NT_FL.GBL");

        req.headers({
            "Postman-Token": "6ff85b8e-49fb-16dc-1842-5c5d0a6d2963",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_MD_SP_F" +
                "L.GBL?Action=U&MD=Y&GMenu=SSR_STUDENT_FL&GComp=SSR_START_PAGE_FL&GPage=SSR_START" +
                "_PAGE_FL&scname=CS_SSR_MANAGE_CLASSES_NAV",
            "Origin": "http://scrsprd.zju.edu.cn",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Content-Type": "application/x-www-form-urlencoded",
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "*/*"
        });

        req.form({
            "ICAJAX": "1",
            "ICNAVTYPEDROPDOWN": "0",
            "ICType": "Panel",
            "ICElementNum": ICElementNum,
            "ICStateNum": ICStateNum,
            "ICAction": "SSR_ENTRMCUR_VW_TERM_DESCR30$1",
            "ICXPos": "0",
            "ICYPos": "0",
            "ResponsetoDiffFrame": "-1",
            "TargetFrameName": "None",
            "FacetPath": "None",
            "ICFocus": "",
            "ICSaveWarningFilter": "0",
            "ICChanged": "-1",
            "ICAutoSave": "0",
            "ICResubmit": "0",
            "ICSID": ICSID,
            "ICActionPrompt": "false",
            "ICTypeAheadID": "",
            "ICBcDomData": "C~UnknownValue~EMPLOYEE~HRMS~NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~PT_LANDINGPAGE~Stu" +
                "dent Center~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOY" +
                "EE/HRMS/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~UnknownValue",
            "ICDNDSrc": "",
            "ICPanelHelpUrl": "",
            "ICPanelName": "",
            "ICPanelControlStyle": "pst_side2-disabled pst_side1-fixed pst_side2-hidden pst_panel-mode",
            "ICFind": "",
            "ICAddCount": "",
            "ICAPPCLSDATA": "",
            "win1hdrdivPT_SYSACT_HELP": "psc_hidden",
            "DERIVED_SSR_FL_SSR_VW_CLSCHD_OPT$81$": "D"
        });

        req.end(function (res) {
            if (res.error)
                reject(res.error);
            try {
                console.log(info)
                const $ = cheerio.load(res.body);
                // const course = []

                $('.ps_box-scrollarea-row').each((index, element) => {
                    // Find the name
                    let label = '', name = '';
                    $(element).find('.ps_box-group .psa_display-block .ps_box-value').each((index, element) => {
                        switch (index) {
                            case 0: {
                                
                                label = $(element).text();
                                break;
                            }
                            case 1: {
                                break;
                            }
                            case 2: {
                                name = $(element).text();
                                break;
                            }
                        }
                    })
                    const flag_pre = `${label}${starttime}`.replace(/[ ]/g, "");
                    console.log(label)
                })
                // console.log(res.body);
                // resolve(courses);
            } catch (error) {
                reject(error);
            }
        });

    })
}

//'2:30PM'
const { parse_time } = require('./utils')

const generate_contine_number = (start, end) => {
    const tmp = [];
    for (let x = start; x <= end; x++) {
        tmp.push(x);
    }
    return tmp;
}

const easy_prase = (course) => {
    const new_course = []
    // for (let i = 1; i <= 7; i++) {
    //     new_course.push([])
    // }

    course.forEach((item) => {
        let time = item.time.split(' - ');
        let startTime = parse_time(time[0]),
            endTime = parse_time(time[1]);
        let duration = 0
        if (endTime.hour === startTime.hour) {
            duration = endTime.min - startTime.min
        } else {
            duration += 60 - startTime.min
            duration += endTime.min
            duration += 60 * (endTime.hour - startTime.hour - 1)
        }
        // const duration = (endtime.hour-startTime.hour)*60+()
        new_course.push({
            ...item,
            startTime,
            endTime,
            duration
        })
    })

    return new_course
}

const process_course = (courses) => {
    let map = {};
    for (let i in courses) {
        if (!map[courses[i].id]) {
            map[courses[i].id] = []
        }
        map[courses[i].id].push(courses[i]);
    }
    // console.log(map);
    let new_course = [];
    for (let i in map) {
        //i => courseid
        const course = map[i];
        // console.log(course);
        let cur = {
            fullid: course[0].id,
            category: course[0].category,
            id: course[0].id,
            year: "2017-2018",
            name: course[0].name,
            teacher: course[0].teacher,
            semester: "SpringSummer",
            determined: true,
            place: [],
            time: []
        };
        for (let j in course) {
            const item = course[j];
            // console.log(item);
            let time = item.time.split(' - ');
            let startTime = parse_time(time[0]), endTime = parse_time(time[1]);
            // console.log(time);
            // console.log(startTime, endTime);
            let cur_time = {
                startTimeHour: startTime.hour,
                startTimeMinute: startTime.min,
                endTimeHour: endTime.hour,
                endTimeMinute: endTime.min,
                time: generate_contine_number(startTime.hour-7, endTime.hour-7),
                week: {
                    type: 'both',
                    weeks: []
                },
                day: ~~item.date + 1,
                desc: ''
            };
            console.log(cur_time);
            cur.place.push(item.place);
            cur.time.push(cur_time);
        }
        new_course.push(cur);
    }
    // for (let i in new_course) {
    //     console.log(new_course[i].time);
    // }
    // console.log(new_course);


    // for (let i in courses) {
    //     let time = courses[i].time.split(' - ');
    //     let startTime = parse_time(time[0]), endTime = parse_time(time[1]);
    //     new_course.push({
    //         id: courses[i].id,
    //         name: courses[i].name,
    //         category: courses[i].category,
    //         place: courses[i].place,
    //         teacher: courses[i].teacher,
    //         week: courses[i].week,
    //         day: courses[i].date,
    //         time: {
    //             startTime,endTime
    //         }
    //     })
    // }
    return new_course;
}

const main = async(user) => {
    try {
        const cookie = await login(user);

        const course = await get_schedule_tabel(cookie);

        const info = prase_info(course);
        await step_1(cookie);
        const url = await step_2(cookie);
        const {ICElementNum, ICStateNum, ICSID} = await step_3(cookie, url);
        const courses = await step_4(cookie, ICElementNum, ICStateNum, ICSID, info);
        if (!courses.length) {
            throw 'FETCHERROR';
        }
        return easy_prase(courses);
    } catch (error) {
        if (error == `USERWRONG`) {
            return Promise.reject({status: 'USERWRONG', error});
        } else {
            return Promise.reject({status: 'FETCHERROR', error});
        }
    }
};

module.exports = main;

/**
 * Just for test
 */
// main({username: 'wenqing.17@intl.zju.edu.cn', password: ''}).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })