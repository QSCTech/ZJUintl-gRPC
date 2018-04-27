/*
 * @Author: Laphets 
 * @Date: 2018-04-25 00:13:41 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-04-27 16:27:42
 */

const PROTO_PATH = __dirname + '/protos/zju_intl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let zjuintl = protoDescriptor.zjuintl;

/**
 * connect_test resolver
 * @param {*} call 
 * @param {*} callback 
 */
const connect_test = (call, callback) => {
    callback(null, { message: `Hello ${call.request.name}. You've successfully connect to our service~` });
}


/**
 * getCourse resolver
 * @param {*} call 
 * @param {*} callback 
 */
const get_course = require('./spider/get_course');
const getCourse = (call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {
            status: 'PARAMERROR'
        });
        return;
    }
    get_course({ username: call.request.username, password: call.request.password }).then((result) => {
        callback(null, {
            status: 'SUCCESS',
            course: result
        });
    }).catch((err) => {
        callback(null, {
            status: err.status
        });
    })
};

const get_bbgrade = require('./spider/get_bbgrade');
const getBBGradeList = (call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {
            status: 'PARAMERROR'
        });
        return;
    };
    get_bbgrade.get_totalgrade({ username: call.request.username, password: call.request.password }).then((result) => {
        callback(null, {
            status: 'SUCCESS',
            courses: result
        });
    })
}





/**
 * Create a grpc server
 */
const getServer = () => {
    let server = new grpc.Server();
    server.addProtoService(zjuintl.ZJUintl.service, {
        getCourse: getCourse,
        connect_test: connect_test,
        getBBGradeList: getBBGradeList
    });
    return server;
}

const Server = getServer();
const port = require('./config').port;
Server.bind(port, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at ${port}`);
Server.start();