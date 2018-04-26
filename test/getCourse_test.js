const getCourse = require('../spider/get_course');

getCourse({ username: '3170111705', password: 'asdfghjkl' }).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
    })
