/*
 * @Author: Laphets
 * @Date: 2018-04-25 00:13:41
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-11-24 20:56:01
 */

const PROTO_PATH = __dirname + '/protobuf/ZJUIntl/ZJUIntl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let ZJUIntl = protoDescriptor.ZJUIntl;

/**
 * connect_test resolver
 * @param {*} call
 * @param {*} callback
 */
const connect_test = (call, callback) => {
    callback(null, {message: `Hello ${call.request.name}. You've successfully connect to our service~`});
}

/**
 * getCourse resolver
 * @param {*} call
 * @param {*} callback
 */
const get_course = require('./spider/get_course');
const getCourse = (call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {status: 'PARAMERROR'});
        return;
    }
    get_course({username: call.request.username, password: call.request.password}).then((result) => {
        callback(null, {
            status: 'SUCCESS',
            course: result
        });
    }).catch((err) => {
        callback(null, {status: err.status});
    })
};

const get_bbgrade = require('./spider/blackboard/get_bbgrade');
/**
 * getBBGradeList resolver
 * @param {*} call
 * @param {*} callback
 */
const getBBGradeList = (call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {status: 'PARAMERROR'});
        return;
    };
    get_bbgrade
        .get_totalgrade({username: call.request.username, password: call.request.password})
        .then((result) => {
            callback(null, {
                status: 'SUCCESS',
                courses: result
            });
        })
        .catch(err => {
            callback(null, {status: err.status});
        })
}

/**
 * getBBCertainGrade resolve
 * @param {*} call
 * @param {*} callback
 */
const getBBCertainGrade = (call, callback) => {
    if (!call.request.username || !call.request.password || !call.request.courseid) {
        callback(null, {status: 'PARAMERROR'});
        return;
    };
    get_bbgrade
        .get_certaingrade({username: call.request.username, password: call.request.password, courseid: call.request.courseid})
        .then(result => {
            // console.log(result);
            callback(null, {
                status: 'SUCCESS',
                items: result
            });
        })
        .catch(err => {
            callback(null, {status: err.status});
        })
}

/**
 * Create a grpc server
 */
const getServer = () => {
    let server = new grpc.Server();
    server.addProtoService(ZJUIntl.IntlService.service, {
        getCourse: getCourse,
        connect_test: connect_test,
        getBBGradeList: getBBGradeList,
        getBBCertainGrade: getBBCertainGrade
    });
    return server;
}

const argv = require('minimist')(process.argv.slice(2));

const Server = getServer();
const port = require('./config').port;
Server.bind(`0.0.0.0:${argv['port'] || port}`, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at 0.0.0.0:${argv['port'] || port}`);
Server.start();