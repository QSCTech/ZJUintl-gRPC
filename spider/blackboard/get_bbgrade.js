/*
 * @Author: Laphets
 * @Date: 2018-04-26 20:57:12
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-11-24 23:22:35
 */

const unirest = require("unirest");
const cheerio = require("cheerio");

/**
 * Get cookie for BlackBoard Login
 * @param {Object} data userdata
 */
const get_cookie_bb = (data) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "https://c.zju.edu.cn/webapps/bb-sso-BBLEARN/authValidate/customLoginFromLogin");
        req.headers({
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://c.zju.edu.cn/",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                    "q=0.8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "Origin": "https://c.zju.edu.cn",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Host": "c.zju.edu.cn"
        });
        req.form(data);
        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            
            //Check the username and password
            if (res.status == '302') {
                reject('USERWRONG');
            } else {
                let cookie = res.headers["set-cookie"];
                // console.log(cookie);
                resolve(cookie);
            }

        });
    })
}

/**
 * Get course list with total grade.
 * @param {Array} cookie cookie
 */
const get_grade_bb = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "https://c.zju.edu.cn/webapps/streamViewer/streamViewer");
        req.headers({
            "Cache-Control": "no-cache",
            "Cookie": cookie,
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://c.zju.edu.cn/webapps/streamViewer/streamViewer?cmd=view&streamName=mygra" +
                    "des&globalNavigation=false",
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": "1.7",
            "Accept": "text/javascript, text/html, application/xml, text/xml, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Origin": "https://c.zju.edu.cn",
            //"Content-Length": "69",
            "Connection": "keep-alive",
            "Host": "c.zju.edu.cn"
        });

        req.form({"cmd": "loadStream", "streamName": "mygrades", "providers": "{}", "forOverview": "false"});

        req.end(function (res) {
            if (res.error) 
                throw(res.error);
            try {
                let arr = JSON.parse(res.body);
                // console.log(arr);
                let courselist = arr.sv_extras.sx_filters[0].choices;
                // console.log(arr.sv_extras.sx_filters[0].choices); for (let x in
                // arr.sv_extras.sx_filters[0].choices) {
                // console.log(arr.sv_extras.sx_filters[0].choices[x]); }
                let result = [];
                for (let i in arr.sv_streamEntries) {
                    let grade = arr.sv_streamEntries[i].itemSpecificData.gradeDetails.grade;
                    if (grade !== '-') {
                        // let url = `https://c.zju.edu.cn${arr.sv_streamEntries[i].se_rhs}`;
                        let name = courselist[arr.sv_streamEntries[i].se_courseId];
                        let courseid = arr.sv_streamEntries[i].se_courseId;
                        result.push({name, grade, courseid});
                        // console.log(url); console.log() console.log(`课程${course} 的成绩为
                        // ${grade}(total)`);
                    }
                }
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    })
}

/**
 * Get grade detail for a particular course.
 * @param {Array} cookie cookie
 * @param {string} id id for a certain course
 */
const get_one_grade = (cookie, id) => {
    return new Promise((resolve, reject) => {
        const req = unirest("GET", "https://c.zju.edu.cn/webapps/bb-mygrades-BBLEARN/myGrades");
        //2823 2848
        req.query({"course_id": id, "stream_name": "mygrades"});

        req.headers({
            "Cookie": cookie,
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                    "q=0.8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Upgrade-Insecure-Requests": "1",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Host": "c.zju.edu.cn"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            var $ = cheerio.load(res.body);
            let onecourse_grade = [];
            $('.sortable_item_row').each(function (i, elem) {
                let name = '',
                    grade = '';
                $(elem)
                    .children()
                    .each(function (i1, elem1) {
                        if ($(elem1).find('a').length) {
                            if (i1 == 0) {
                                name = $(elem1)
                                    .children('a')
                                    .text()
                                    .replace(/(^\s*)|(\s*$)/g, "");
                            } else if (i1 == 2) {
                                grade = $(elem1)
                                    .text()
                                    .replace(/(^\s*)|(\s*$)/g, "");
                            }
                        } else {
                            if (i1 == 0) {
                                name = $(elem1)
                                    .text()
                                    .replace(/(^\s*)|(\s*$)/g, "");
                            } else if (i1 == 2) {
                                grade = $(elem1)
                                    .text()
                                    .replace(/(^\s*)|(\s*$)/g, "");
                            }
                        }
                    });
                onecourse_grade.push({name, grade});
            });
            resolve(onecourse_grade);
        });
    })
}

const login = require('./login')

/**
 * Get total grade list.
 * @param {Object} user user information
 */
const get_totalgrade = async(user) => {
    try {
        // let data_bb = {
        //     "login_uid_unicode": new Buffer(user.username).toString('base64'),
        //     "login_pwd_unicode": new Buffer(user.password).toString('base64')
        // };
        const cookie_bb = await login(user);
        const grade = await get_grade_bb(cookie_bb);
        return grade;
    } catch (error) {
        if (error == 'USERWRONG') {
            return Promise.reject({status: 'USERWRONG', error})
        } else {
            return Promise.reject({status: 'FETCHERROR', error})
        }
    }
}

/**
 * Get grade detail for one course.
 * @param {Object} user user information
 * @param {string} courseid course id in string
 */
const get_certaingrade = async(user) => {
    try {
        // let data_bb = {
        //     "login_uid_unicode": new Buffer(user.username).toString('base64'),
        //     "login_pwd_unicode": new Buffer(user.password).toString('base64')
        // };
        const cookis_bb = await login(user);
        const onecourse_grade = await get_one_grade(cookis_bb, user.courseid);
        return onecourse_grade;
    } catch (error) {
        if (error == 'USERWRONG') {
            return Promise.reject({status: 'USERWRONG', error})
        } else {
            return Promise.reject({status: 'FETCHERROR', error})
        }
    }
}

module.exports = {
    get_certaingrade,
    get_totalgrade
}
//'_2823_1'