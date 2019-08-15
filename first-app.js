const fs = require('fs');

const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done');
        }, 1500);
    });

    return promise;    
};
//fs.writeFileSync('./hello.txt', 'hello from nodejs\n');

setTimeout(() => {
    console.log('timer is done');
    fetchData()
    .then(text => {
        console.log(text);
        return fetchData();
        /*
        fetchData().then(text2 => {
            console.log(text2);
        })*/
    })
    .then(text2 => {
        console.log(text2);
    });
}, 100);
