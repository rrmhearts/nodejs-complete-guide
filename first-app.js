const fs = require('fs');

const fetchData = (callback) => {
    setTimeout(() => {
        callback('Done');
    }, 1500);
};
//fs.writeFileSync('./hello.txt', 'hello from nodejs\n');

setTimeout(() => {
    console.log('timer is done');
    fetchData((text) => {
        console.log(text);
    });
}, 100);
