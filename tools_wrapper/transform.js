const XLSX = require("xlsx");
const  fs  = require('fs');
const { last } = require("lodash");

const timing = require('./timingedit.json').elapsed;
const names = require('./names.json').names;
const versions = require('./versions.json').versions;
const numberOfLines = require('./lines.json').number;

var note = [];

function toMS(time) {
    var leftToken = time.split(':')[0];
    var middleToken = time.split(':')[1].split('.')[0];
    var rightToken = time.split(':')[1].split('.')[1];

    const ms = Number(rightToken) + Number(middleToken) * 100 + Number(leftToken) * 6000

    return ms;
}

function toTime(ms) {
    var temp = ms;
    var Minutes;
    var Seconds;
    var Milliseconds;

    if(temp < 100){
        return (`0:0.${temp}`);
    } else if (temp < 6000) {
        Seconds = Math.floor(temp / 100);
        Milliseconds = temp % 100;

        return (`0:${Seconds}.${Milliseconds}`);
    } else {;
        Minutes = Math.floor(ms / 6000);
        temp -= Minutes * 6000;
        Seconds = Math.floor(temp / 100);
        Milliseconds = temp % 100;
    
        return(`${Minutes}:${Seconds}.${Milliseconds}`);
    }
}

var lastTime = toMS(timing[0]);

for(i = 1; i < timing.length; i++) {
    var time = toMS(timing[i]);
    var temp = 0;

    if(lastTime != time) {
        temp = time - lastTime;
    }
    note.push({
        names: names[i], 
        lines: numberOfLines[i],
        time: toTime(temp), 
        version: versions[i]
    });

    lastTime = time;
}

const worksheet = XLSX.utils.json_to_sheet(note);
const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "SlitherResults");

XLSX.writeFile(workbook, "SlitherResults.xlsx");
