const unirest = require("unirest");

const got = require('got')

const { upload } = require("../../minio/minio")

const getRealLoc = (cookie, url) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", `https://c.zju.edu.cn${url}`);
        req.headers({
            "cache-control": "no-cache",
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": "1.7",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
            "Referer": "https://c.zju.edu.cn/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts&globalNavigation=false",
            "Origin": "https://c.zju.edu.cn",
            "Host": "c.zju.edu.cn",
            "Cookie": cookie,
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": "67",
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,la;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/javascript, text/html, application/xml, text/xml, */*"
        });

        req.end(function (res) {
            if (res.error) {
                reject(res.error)
                return
            }
            if (!res.headers.location) {
                reject('No redirect URL')
                return
            }
            resolve(`https://c.zju.edu.cn${res.headers.location}`);
        });
    })
}

const saveToMinio = async (cookie, url, name) => {
    const stream = got.get(url, {
        headers: {
            cookie
        },
        stream: true
    })
    const etag = await upload(name, stream)
    return etag
}

const login = require('./login')
/***
 * @Target: '/bbcswebdav/pid-93562-dt-content-rid-1446934_1/xid-1446934_1'
 */
const main = async (user, target) => {
    try {
        const cookie = await login(user)

        const realLoc = await getRealLoc(cookie, target)
        const etag = await saveToMinio(cookie, realLoc, `${user.username}/${realLoc.replace('https://c.zju.edu.cn/bbcswebdav/', '')}`)
        return etag
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = main

// main({
//     username: '3170111705',
//     password: ''
// }, '/bbcswebdav/pid-93562-dt-content-rid-1446934_1/xid-1446934_1')