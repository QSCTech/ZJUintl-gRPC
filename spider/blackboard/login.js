const unirest = require("unirest");
const cheerio = require("cheerio");

/**
 * Get cookie for BlackBoard Login
 * @param {Object} data userdata
 */
const login = ({ username, password }) => {
    const data = {
        "login_uid_unicode": new Buffer(username).toString('base64'),
        "login_pwd_unicode": new Buffer(password).toString('base64')
    };
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
                const cookie = res.headers["set-cookie"];
                // console.log(cookie);
                resolve(cookie);
            }
        });
    })
}

module.exports = login