const unirest = require("unirest");

const getSpecJSession = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("GET", "https://c.zju.edu.cn/webapps/streamViewer/streamViewer");
        req.query({
            "cmd": "view",
            "streamName": "alerts",
            "globalNavigation": "false"
        });
        req.headers({
            "cache-control": "no-cache",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
            "Upgrade-Insecure-Requests": "1",
            "Referer": "https://c.zju.edu.cn/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=AlertsOnMyBb_____AlertsTool",
            "Host": "c.zju.edu.cn",
            "Cookie": cookie,
            "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,la;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
        });

        req.end(function (res) {
            if (res.error) {
                reject(res.error);
                return
            }

            const cookie = res.headers["set-cookie"];
            // console.log(cookie);
            resolve(cookie);
        });

    })
}


const prase_cookie = (cookie) => {
    let st = ''
    cookie.map((item) => {
        st += (`${item.split('; ')[0]}; `)
    })
    console.log(st)
    return st;
}

const request = (cookie) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "https://c.zju.edu.cn/webapps/streamViewer/streamViewer");
        req.headers({
            "cache-control": "no-cache",
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": "1.7",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
            "Referer": "https://c.zju.edu.cn/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts&globalNavigation=false",
            "Origin": "https://c.zju.edu.cn",
            "Host": "c.zju.edu.cn",
            // "Cookie": prase_cookie(cookie),
            "Cookie": cookie,
            "Content-Type": "application/x-www-form-urlencoded",
            // "Connection": "keep-alive",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,la;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/javascript, text/html, application/xml, text/xml, */*"
        });

        req.form({
            "cmd": "loadStream",
            "streamName": "alerts",
            "providers": "{}",
            "forOverview": "false"
        });

        req.end(function (res) {
            if (res.error) {
                reject(res.error);
                return
            };
            const body = JSON.parse(res.body);
            const data = body.sv_streamEntries;
            const noticeList = []
            data.map((item) => {
                const specific = item.itemSpecificData
                const notification = specific.notificationDetails
                const content = specific.contentDetails
                noticeList.push({
                    time: item.se_timestamp,
                    title: specific.title,
                    type: item.extraAttribs.event_type,
                    courseId: item.se_courseId,
                    sourceId: notification.sourceId,
                    itemUrl: item.se_itemUri,
                    author: {
                        firstName: notification.announcementFirstName || '',
                        lastName: notification.announcementLastName || '',
                    },
                    body: notification.announcementBody,
                    seen: notification.seen,
                    content: {
                        extraData: content ? content.contentSpecificExtraData : '',
                        fileUrl: content ? content.contentSpecificFileData : '',
                    }
                })
            })
            resolve(noticeList)
        });
    })
}

const login = require('./login')


const exist = (ins) => ins && ins.length;

const fetchData = async (user) => {
    try {
        let cnt = 0,
            maxTry = 3,
            res = [];
        while (cnt++ < maxTry) {
            const cookie1 = await login(user)
            const specCookie1 = await getSpecJSession(cookie1);
            const res1 = await request(specCookie1)

            const cookie2 = await login(user)
            const specCookie2 = await getSpecJSession(cookie2);
            const res2 = await request(specCookie1)

            if (exist(res1)) {
                res = res1
                break
            }
            if (exist(res2)) {
                res = res2;
                break
            }
        }

        if (!exist(res)) {
            throw 'Error'
        }
        return res;

    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = fetchData

// const main = async () => {
//     const res = await fetchData({
//         username: '3170111705',
//         password: ''
//     })
//     console.log(res)
// }

// main()