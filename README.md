# gRPC service for ZJUintl
## Overview
As described above, this project is a `gRPC` service for ZJUintl Campus, it aims at providing safe and stable application interface for developers to get data they want which includes course information, exam details, exam scores etc.
For a developer who want to use our service, you do not need to learn gRPC at all, what you need to do is to install our particular SDK which will be published later.
> Hopefully, you guys will have a good developing experience.

## Server Side Deploy
```bash
npm i
npm start
```
Also, you need to create a config file yourself according to the sample given by.
```
mv config_sample.js config.js
vim config.js
```
## Endponit Lists
1. **Connect_test** - Test whether you can connect to our sevice.
```js
Accept{
    name: String   //Your name
}
```
```js
Return{
    status: String,
    message: String 
}
```
2. **getCourse** - Get the course list and time table from *PeopleSoft*
```js
Accept{
    username: String   //ZJUid
    password: String   //Password corresponding to that ZJUid
}
```
```js
Return{
    status: String
    course: [{
        id, name, time, type, room, instructor, week, month, date, weeknum
    }]
}
```
3. **getBBGradeList** - Get the course list with a sum grade from *BlackBoard*
```js
Accept{
    username: String
    password: String
}
```
```js
Return{
    status: String
    courses: [{
        name, grade, courseid
    }]
}
```
4. **getBBCertainGrade** - Get detail grade for one certain course from *BalckBoard*
```js
Accept{
    username: String
    password: String
    courseid: String
}
```
```js
Return{
    status: String
    items: [{
        name, grade
    }]
}
```

## Status Code Reference
| Case                                                     | Code        | Generated at Client or Server |
| -------------------------------------------------------- | :---------- | ----------------------------- |
| Username or password is wrong.                           | USERWRONG   | Server                        |
| Some error occurs when fetching data.                    | FETCHERROR  | Server                        |
| Some error occurs for your client.                       | CLIENTERROR | Client                        |
| Success fetching data.                                   | SUCCESS     | Both                          |
| You didn't input complete user info(username, password). | PARAMERROR  | Server                        |


## Controbutor
Laphets `i@laphets.com` 求是潮技术研发中心

**If you have any problem when using our service, pls let me know.**
