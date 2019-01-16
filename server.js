/*
 * @Author: Laphets
 * @Date: 2018-04-25 00:13:41
 * @Last Modified by: Laphets
 * @Last Modified time: 2019-01-16 22:28:59
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
const get_course = require('./spider/peoplesoft/get_course');
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

const GPA_service = require('./spider/peoplesoft/grade');

const GetGPATermInfo = async (call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {
            status: {
                code: 400,
                info: 'PARAMERROR',
            }
        });
        return;
    };
    try {
        callback(null, {
            status: {
                code: 200,
                info: 'SUCCESS',
            },
            terminfo: await GPA_service.get_term({
                username: call.request.username,
                password: call.request.password,
            })
        });
        return;
    } catch (error) {
        console.log(error);
        callback(null, {
            status: {
                code: 500,
                info: 'FETCHERROR',
            }
        });
    }
}
const GetGPAInfo = async (call, callback) => {
    if (!call.request.username || !call.request.password || !call.request.term) {
        callback(null, {
            status: {
                code: 400,
                info: 'PARAMERROR',
            }
        });
        return;
    };
    try {
        const GPA = await GPA_service.get_grade({
            username: call.request.username,
            password: call.request.password,
            term: call.request.term,
        })
        callback(null, {
            status: {
                code: 200,
                info: 'SUCCESS',
            },
            termgpa: GPA.termgpa,
            cumulativegpa: GPA.cumulativegpa,
            gpainfo: GPA.gpainfo,
        });
        return;
    } catch (error) {
        console.log(error);
        callback(null, {
            status: {
                code: 500,
                info: 'FETCHERROR',
            }
        });
    }
}

const get_exam = require('./spider/peoplesoft/exam')
const GetExamInfo = async(call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {
            status: {
                code: 400,
                info: 'PARAMERROR',
            }
        });
        return;
    };
    try {
        callback(null, {
            status: {
                code: 200,
                info: 'SUCCESS',
            },
            examinfo: await get_exam({
                username: call.request.username,
                password: call.request.password,
            })
        });
        return;
    } catch (error) {
        callback(null, {
            status: {
                code: 500,
                info: 'FETCHERROR',
            }
        });
    }
}



const get_bbgrade = require('./spider/blackboard/get_bbgrade');
/**
 * getBBGradeList resolver
 * @param {*} call
 * @param {*} callback
 */
const GetGradeList = (call, callback) => {
    if (!call.request.username || !call.request.password) {
        callback(null, {
            status: {
                code: 400,
                info: 'PARAMERROR',
            }
        });
        return;
    };
    get_bbgrade
        .get_totalgrade({username: call.request.username, password: call.request.password})
        .then((result) => {
            callback(null, {
                status: {
                    code: 200,
                    info: 'SUCCESS'
                },
                gradelist: result
            });
        })
        .catch(err => {
            callback(null, {
                status: {
                    code: 500,
                    info: err.status,
                }
            });
        })
}

/**
 * getBBCertainGrade resolve
 * @param {*} call
 * @param {*} callback
 */
const GetCertainGrade = (call, callback) => {
    if (!call.request.username || !call.request.password || !call.request.courseId) {
        callback(null, {
            status: {
                code: 400,
                info: 'PARAMERROR',
            }
        });
        return;
    };
    get_bbgrade
        .get_certaingrade({username: call.request.username, password: call.request.password, courseid: call.request.courseid})
        .then(result => {
            // console.log(result);
            callback(null, {
                status: {
                    code: 200,
                    info: 'SUCCESS'
                },
                gradeitem: result
            });
        })
        .catch(err => {
            callback(null, {
                status: {
                    code: 500,
                    info: err.status,
                }
            });
        })
}

const get_alert = require('./spider/blackboard/alerts')
const GetAlertList = (call, callback) => {
    // Since it may occur some problem inside ZJU net
    // Try to request from server of Alicloud
    get_alert({
        username: call.request.username,
        password: call.request.password,
    }).then((res) => {
        callback(null, {
            status: {
                code: 200,
                info: 'SUCCESS'
            },
            alertlist: res
        });
    }).catch((error) => {
        callback(null, {
            status: {
                code: 500,
                info: error,
            }
        });
    })
}

const clientBB = new ZJUIntl.BlackBoardService(`106.14.216.254:50053`, grpc.credentials.createInsecure());
GetAlertListFromAlicloud = (call, callback) => {
    clientBB.GetAlertList({
        username: call.request.username,
        password: call.request.password
    }, (err, res) => {
        if (err) {
            callback(null, {
                status: {
                    code: 500,
                    info: err,
                }
            });
        } else {
            callback(null, res)
        }
    })
}

const file_saver = require('./spider/blackboard/filesaver')
const GetFileEtag = (call, callback) => {
    file_saver({
        username: call.request.username,
        password: call.request.password,
    }, call.request.fileUrl).then((res) => {
        callback(null, {
            status: {
                code: 200,
                info: 'SUCCESS'
            },
            etag: res.etag,
            filePath: res.filePath
        });
    }).catch((error) => {
        callback(null, {
            status: {
                code: 500,
                info: error,
            }
        });
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
        GetExamInfo: GetExamInfo,
        GetGPAInfo: GetGPAInfo,
        GetGPATermInfo: GetGPATermInfo,
    });
    server.addProtoService(ZJUIntl.BlackBoardService.service, {
        GetGradeList: GetGradeList,
        GetCertainGrade: GetCertainGrade,
        // GetAlertList: GetAlertList,
        GetAlertList: GetAlertListFromAlicloud,
        GetFileEtag: GetFileEtag
    })
    return server;
}

const argv = require('minimist')(process.argv.slice(2));

const Server = getServer();
const port = require('./config').port;
Server.bind(`0.0.0.0:${argv['port'] || port}`, grpc.ServerCredentials.createInsecure());
console.log(`Server is running at 0.0.0.0:${argv['port'] || port}`);
Server.start();