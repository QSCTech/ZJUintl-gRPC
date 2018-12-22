/*
 * @Author: Laphets
 * @Date: 2018-04-22 00:42:03
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-12-22 17:52:22
 */

const PROTO_PATH = __dirname + '/protobuf/ZJUIntl/ZJUIntl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let ZJUIntl = protoDescriptor.ZJUIntl;
const argv = require('minimist')(process.argv.slice(2));
// let clientIntl = new ZJUIntl.IntlService(`10.202.68.181:8890`
//     , grpc.credentials.createInsecure());
// let clientBB = new ZJUIntl.BlackBoardService(`10.202.68.181:8890`
//     , grpc.credentials.createInsecure());
// let clientIntl = new ZJUIntl.IntlService(`106.14.216.254:50053`
//     , grpc.credentials.createInsecure());
// let clientBB = new ZJUIntl.BlackBoardService(`106.14.216.254:50053`
//     , grpc.credentials.createInsecure());

// let clientBB = new ZJUIntl.BlackBoardService(`0.0.0.0:50053`
//     , grpc.credentials.createInsecure());
let clientIntl = new ZJUIntl.IntlService(`0.0.0.0:50053`
    , grpc.credentials.createInsecure());

const user = require('./test_user').test_user;

// clientIntl.GetExamInfo({
//     username: user.username,
//     password: user.password
// }, (err, response) => {
//         if (err) {
//             console.log(err)
//         }
//     console.log(response)
// })

// const meta = new grpc.Metadata()
// meta.add('Host', 'zjuintl.rpc.zjuqsc.com')

// Code for connect test
// clientIntl.connect_test({ name: 'lapehts' }, (err, response) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(response);
//     }
// });

//Code for get course(time table)
// clientIntl.getCourse({ username: user.username, password: user.password }, (err, response) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(response);
//     }
// })

// clientBB.GetAlertList({
//     username: user.username,
//     password: user.password
// }, (err, res) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(res)
//     }

// })


// clientBB.GetGradeList({
//             username: user.username,
//             password: user.password
//         }, (err, response) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(response);
//     }
// });

// client.getBBCertainGrade({ username: user.username, password: user.password, courseid: user.courseid }, (err, response) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(response);
//     }
// })