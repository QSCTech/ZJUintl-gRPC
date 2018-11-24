const minio = require('minio')
const got = require('got')
const { CookieJar } = require('tough-cookie');

const minioClient = new minio.Client({
    endPoint: '10.202.68.181',
    port: 9000,
    useSSL: false,
    accessKey: 'qsmQSaSMkgKK6PbV7L7n',
    secretKey: '9ncUOUMtRVCpjT6D4mCztKRGy8NUeLui'
})

const upload = (fileName, stream) => {
    // console.log(fileName)
    return new Promise((resolve, reject) => {
        minioClient.putObject('bbfiles', fileName, stream, (err, etag) => {
            if (err) {
                reject(err)
            } else {
                resolve(etag)
            }
        })
    })
}

module.exports = { upload }