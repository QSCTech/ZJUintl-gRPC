/*
 * @Author: Laphets 
 * @Date: 2018-04-25 00:13:41 
 * @Last Modified by: Laphets
 * @Last Modified time: 2018-04-26 17:00:02
 */

const PROTO_PATH = __dirname + '/protos/zju_intl.proto';
const grpc = require('grpc');

let protoDescriptor = grpc.load(PROTO_PATH);
let zjuintl = protoDescriptor.zjuintl;

const connect_test = (call, callback) => {
    callback(null, { message: `Hello ${call.request.name}. You've successfully connect to our service~` });
}


const get_course = require('./spider/get_course');
const getCourse = (call, callback) => {
    // console.log(call.request);
    // callback(null, { message: `OK, ${call.request.username}` });
    get_course({ username: call.request.username, password: call.request.password }).then((result) => {
        callback(null, {
            status: 0,
            course: result
        });
    })
};



const getServer = () => {
    let server = new grpc.Server();
    server.addProtoService(zjuintl.ZJUintl.service, {
        getCourse: getCourse,
        connect_test: connect_test
    });
    return server;
}

const Server = getServer();
const port = require('./config').port;
Server.bind(port, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at ${port}`);
Server.start();