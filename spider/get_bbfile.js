var unirest = require("unirest");

var req = unirest("POST", "https://c.zju.edu.cn/bbcswebdav/pid-95188-dt-content-rid-1503296_1/xid-1503296_1");

req.headers({
    "cache-control": "no-cache",
    "X-Requested-With": "XMLHttpRequest",
    "X-Prototype-Version": "1.7",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
    "Referer": "https://c.zju.edu.cn/webapps/streamViewer/streamViewer?cmd=view&streamName=alerts&globalNavigation=false",
    "Origin": "https://c.zju.edu.cn",
    "Host": "c.zju.edu.cn",
    "Cookie": "JSESSIONID=920EFDE62C75232640E62C0D9CC277A1; _ga=GA1.3.697685599.1542525734; session_id=83A45283864CB119A38ADD0886574F98; s_session_id=9B5C3D57FFCB303A48D26B6F977D215C; web_client_cache_guid=c45c2407-2043-4324-9f39-127d9e0a8e5d; JSESSIONID=1FB6F640C5F1BACFDC19B9B829E7CE80; studentid=3170111705",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "67",
    "Connection": "keep-alive",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,la;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/javascript, text/html, application/xml, text/xml, */*"
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(`https://c.zju.edu.cn${res.headers.location}`);
});
