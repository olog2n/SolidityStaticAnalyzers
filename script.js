const { exec } = require('child_process');
const  fs  = require('fs');

const data = fs.readFileSync('./task.txt', 'utf8');

let temp = data.split(':\n');

temp.pop();

for(const path of temp){
    exec(`time node scc.js myth contracts/test_contracts/${path}`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
}
