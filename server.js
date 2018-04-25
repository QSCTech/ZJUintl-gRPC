/*
 * @Author: Laphets 
 * @Date: 2018-04-25 00:13:41 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-04-25 00:22:14
 */

const PROTO_PATH = __dirname + '/protos/zju_intl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let zjuintl = protoDescriptor.zjuintl;

const get_course = require('./spider/get_course');
const getCourse = (call, callback) => {
    get_course(call.request).then(res => {
        console.log(res);
    })
};

const getServer = () => {
    let server = new grpc.Server();
    server.addProtoService(zjuintl.ZJUintl.service, {
        getCourse: getCourse
    });
    return server;
}

const Server = getServer();
const port = require('./config').port;
Server.bind(port, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at ${port}`);
Server.start();