const recording = require('./recording')
const config = require('./config')
const schedule = require('node-schedule');
schedule.scheduleJob(`*/${config.regularTime} * * * *`, function(){
    recording()
});
recording()
