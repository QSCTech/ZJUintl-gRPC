/*
 * @Author: Laphets 
 * @Date: 2018-04-25 00:20:17 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-04-25 00:23:05
 */

const PROTO_PATH = __dirname + '/protos/zju_intl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let zjuintl = protoDescriptor.zjuintl;

let client = new zjuintl.ZJUintl(require('./config').port, grpc.credentials.createInsecure());

const user = require('./config').test_user;

// console.log(user);

client.getCourse(user, (err, response) => {
    if (err) {
        console.log(err);
    } else {
        console.log(response);
    }
});