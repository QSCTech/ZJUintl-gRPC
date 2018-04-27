/*
 * @Author: Laphets
 * @Date: 2018-04-22 00:42:03
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-04-27 09:04:52
 */

const PROTO_PATH = __dirname + '/protos/zju_intl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let zjuintl = protoDescriptor.zjuintl;

let client = new zjuintl.ZJUintl(require('./config').port, grpc.credentials.createInsecure());

const user = require('./config').test_user;


// Code for connect test
// client.connect_test({name: 'lapehts'}, (err, response) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(response);
//     }
// });

//Code for get course(time table)
client.getCourse({ username: test_user.user, password: test_user.password }, (err, response) => {
    if (err) {
        console.log(err);
    } else {
        console.log(response);
    }
})