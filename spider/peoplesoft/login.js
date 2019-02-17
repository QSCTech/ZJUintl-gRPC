const unirest = require("unirest");

/**
 * Login and get the cookie
 * @param {object} data Data for user
 */
const login = (user, lang = 'ENG') => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "http://scrsprd.zju.edu.cn/psp/CSPRD/?&cmd=login&languageCd=ENG");
        req.headers({
            "Postman-Token": "b5f9d7dd-ef66-9a31-9199-9350cbf2c05a",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                "q=0.8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like " +
                "Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "Origin": "http://scrsprd.zju.edu.cn",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Host": "scrsprd.zju.edu.cn"
        });
        req.form({
            "userid": user.username,
            "pwd": user.password,
            "ptlangcd": lang,
            "Submit": "Login",
            "timezoneOffset": "0"
        });
        req.end(function (res) {
            if (res.error)
                reject(res.error);
            // console.log(res.body);
            let cookie = res.headers["set-cookie"];
            // console.log(cookie);
            resolve(cookie);
        });
    });
}

module.exports = login