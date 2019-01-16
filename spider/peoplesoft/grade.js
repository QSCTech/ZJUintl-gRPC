const unirest = require("unirest");
const superagent = require("superagent");
const cheerio = require("cheerio");

const step_1 = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("GET", "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SS" +
                "R_ACAD_REC_FL.GBL");

        req.headers({
            "Postman-Token": "79ec31bf-f923-0fc1-b50c-ad5641f3a6bb",
            "Cookie": cookie,
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SS" +
                    "R_ACAD_REC_FL.GBL",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                    "q=0.8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Upgrade-Insecure-Requests": "1",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Host": "scrsprd.zju.edu.cn"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            let $ = cheerio.load(res.body);
            let ics = $('#ICSID').val();
            let ICStateNum = $('#ICStateNum').val();
            resolve({ICStateNum, ics});
            // console.log(res.body);
        });

    })
}

const step_2 = (cookie, lastNum, ics) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SS" +
                "R_ACAD_REC_FL.GBL");

        req.headers({
            "Postman-Token": "c9b2e59b-8ae8-6a77-b893-f82a1950ecf4",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SS" +
                    "R_ACAD_REC_FL.GBL",
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
            "ICElementNum": "1",
            "ICStateNum": lastNum,
            "ICAction": "SCC_LO_FL_WRK_SCC_VIEW_BTN$1",
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
            "ICSID": ics,
            "ICActionPrompt": "false",
            "ICTypeAheadID": "",
            "ICBcDomData": "C~UnknownValue~EMPLOYEE~HRMS~NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~PT_LANDINGPAGE~Stu" +
                    "dent Center~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPL" +
                    "OYEE/HRMS/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~UnknownValue*C~UnknownValue~EMPLOYE" +
                    "E~HRMS~SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~SSR_CRSE_HIST_FL~Academic Rec" +
                    "ords~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HR" +
                    "MS/c/SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~UnknownValue*C~UnknownValue~EMP" +
                    "LOYEE~HRMS~SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~SSR_CRSE_HIST_FL~Academic" +
                    " Records~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYE" +
                    "E/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~UnknownValue*C~UnknownValue" +
                    "~EMPLOYEE~HRMS~SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~SSR_CRSE_HIST_FL~Acad" +
                    "emic Records~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMP" +
                    "LOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~UnknownValue",
            "ICDNDSrc": "",
            "ICPanelHelpUrl": "",
            "ICPanelName": "",
            "ICPanelControlStyle": "pst_side2-disabled pst_side1-fixed pst_side2-hidden pst_panel-mode",
            "ICFind": "",
            "ICAddCount": "",
            "ICAPPCLSDATA": "",
            "win1hdrdivPT_SYSACT_HELP": "psc_hidden"
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            let $ = cheerio.load(res.body);
            // console.log(res.body);
            let semester = [];
            $(`ul[class="ps_grid-body"]`)
                .find('a')
                .each(function (i, elem) {
                    semester.push({
                        id: $(elem).attr('id'),
                        name: $(elem).text()
                    })
                })
            //console.log(semester);
            let newNum = $('#ICStateNum').val();
            resolve({newNum, semester});
        });

    })
}

const step_3 = (cookie, lastNum, ics, term) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SS" +
                "R_ACAD_REC_FL.GBL");

        req.headers({
            "Postman-Token": "bd068f1f-bc25-52a8-737c-14adc84ea868",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                    "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Referer": "http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SS" +
                    "R_ACAD_REC_FL.GBL",
            "Origin": "http://scrsprd.zju.edu.cn",
            "Host": "scrsprd.zju.edu.cn",
            "Cookie": cookie,
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": "1535",
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "*/*"
        });

        req.form({
            "ICAJAX": "1",
            "ICNAVTYPEDROPDOWN": "0",
            "ICType": "Panel",
            "ICElementNum": "1",
            "ICStateNum": lastNum,
            "ICAction": term,
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
            "ICSID": ics,
            "ICActionPrompt": "false",
            "ICTypeAheadID": "",
            "ICBcDomData": "C~UnknownValue~EMPLOYEE~HRMS~NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~PT_LANDINGPAGE~Stu" +
                    "dent Center~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPL" +
                    "OYEE/HRMS/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL~UnknownValue*C~UnknownValue~EMPLOYE" +
                    "E~HRMS~SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~SSR_CRSE_HIST_FL~Academic Rec" +
                    "ords~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYEE/HR" +
                    "MS/c/SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~UnknownValue*C~UnknownValue~EMP" +
                    "LOYEE~HRMS~SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~SSR_CRSE_HIST_FL~Academic" +
                    " Records~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLOYE" +
                    "E/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~UnknownValue*C~UnknownValue" +
                    "~EMPLOYEE~HRMS~SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~SSR_VWGD_TERM_FL~Sele" +
                    "ct a Value~UnknownValue~UnknownValue~http://scrsprd.zju.edu.cn/psc/CSPRD_1/EMPLO" +
                    "YEE/HRMS/c/SSR_STUDENT_ACAD_REC_FL.SSR_ACAD_REC_FL.GBL~UnknownValue",
            "ICDNDSrc": "",
            "ICPanelHelpUrl": "",
            "ICPanelName": "",
            "ICPanelControlStyle": "pst_side2-disabled pst_side1-fixed pst_side2-hidden pst_panel-mode",
            "ICFind": "",
            "ICAddCount": "",
            "ICAPPCLSDATA": ""
        });

        req.end(function (res) {
            if (res.error) 
                reject(res.error);
            let $ = cheerio.load(res.body);
            let GPA = {};
            GPA.semester = $('#TERM_TBL_DESCR').text();
            GPA.thead = [];
            //console.log(res.body); console.log($('li').text());
            GPA.record = [];
            $('li').each(function (i, elem) {
                if ($(elem).attr('role') == "button") {
                    let cur = $(elem)
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, "")
                        .split('\n');
                    GPA[cur[0]] = cur[1];
                }
            });
            $('thead')
                .children()
                .children()
                .each(function (i, elem) {
                    GPA
                        .thead
                        .push($(elem).text());
                });
            $('tbody')
                .children()
                .each(function (i, elem) {
                    // $(elem).children().children().children().each(function (i1, elem1) {
                    // console.log(i1); })
                    let course = {};
                    $(elem)
                        .find('td')
                        .each(function (i1, elem1) {
                            let label = $(elem1)
                                .find('.ps-label')
                                .text().replace(/[ ]/g, "").toLowerCase();
                            let value = $(elem1)
                                .find('.ps_box-value')
                                .text();
                            course[label] = value;
                            // console.log(label, value) console.log('begin'); console.log($(elem1).html());
                            // console.log('end');
                        });
                    GPA
                        .record
                        .push(course);
                })
            // console.log(GPA);
            resolve(GPA);
        });

    })
}

/**
 * Login and get the cookie
 * @param {object} data Data for user
 */
const login = require("./login")

const get_term = async({username, password}) => {
    try {
        const cookie = await login({username, password});
        const {ICStateNum, ics} = await step_1(cookie);
        const {newNum, semester} = await step_2(cookie, ICStateNum, ics);
        return semester;
    } catch (error) {
        return Promise.reject(error);
    }
}

const get_grade = async ({username, password, term}) => {
    try {
        const cookie = await login({username, password});
        const {ICStateNum, ics} = await step_1(cookie);
        const {newNum, semester} = await step_2(cookie, ICStateNum, ics);
        const GPA = await step_3(cookie, newNum, ics, term);
        return {
            termgpa: GPA['Term GPA'],
            cumulativegpa: GPA['Cumulative GPA'],
            gpainfo: GPA.record
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

module.exports = { get_term, get_grade }

// get_term({
//     username: '3170111705',
//     password: ''
// })

// get_grade({
//     username: '3170111705',
//     password: '',
//     term: 'TERM$2'
// }).then(res => {
//     console.log(res);
// })