# gRPC service for ZJUintl
## Overview
As described above, this project is a `gRPC` service for ZJUintl Campus, it aims at providing safe and stable application interface for developers to get data they want which includes course information, exam details, exam scores etc.
For a develop who want to use our service, you do not need to learn gRPC at all, what you need to do is to install our particular SDK which will be published later.
> Hopefully, you guys will have a good developing experience.


## Endponit Lists
### connect_test
Accepts
```js
{
    name: ''    //Your name
}
```
Returns
```js
{
    status: ''
    message: '' 
}
```
### getCourse
```js
{
    username: '',   //ZJUid
    password: ''    //Password corresponding to that ZJUid
}
```
```js
{
    status: '',
    course: [{
        id, name, time, type, room, instructor, week, month, date, weeknum
    }]
}
```


## Status Code Reference
| Case                                  | Code        | Generated at Client or Server |
| ------------------------------------- | :---------- | ----------------------------- |
| Username or password is wrong.        | USERWRONG   | Server                        |
| Some error occurs when fetching data. | FETCHERROR  | Server                        |
| Some error occurs for your client.    | CLIENTERROR | Client                        |

## Controbutor
Laphets `i@laphets.com` 求是潮技术研发中心

**If you have any problem when using our service, pls let me know.**
