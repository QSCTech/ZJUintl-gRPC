new Promise((resolve, reject) => {
    throw(233);
    console.log(666);
}).catch(err => {
    console.log(err);
})