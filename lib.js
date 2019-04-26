"use strict";
const { exec } = require('child_process');

function RpiThrottled(){
  this.underVoltage = false;
  this.frequencyCapped = false;
  this.throttled = false;
  this.underVoltageOccurred = false;
  this.frequencyCappedOccurred = false;
  this.throttledOccurred = false;
  this.update();
};

RpiThrottled.prototype = {
  update: function(){
    let that = this;
    exec('vcgencmd get_throttled', (err, stdout, stderr) => {
      if (err) {
        console.log("Error executing vcgencmd:" + err);
        return;
      }
      var number = parseInt(stdout.replace("throttled=",""), 16);
      that.underVoltage = (number >> 0) & 1;
      that.frequencyCapped = (number >> 1) & 1;
      that.throttled = (number >> 2) & 1;
      that.underVoltageOccurred = (number >> 16) & 1;
      that.frequencyCappedOccurred = (number >> 17) & 1;
      that.throttledOccurred = (number >> 18) & 1;
    });
  },
  printData: function(){
    console.log("Throttled................: " + this.throttled);
    console.log("Under Voltage............: " + this.underVoltage);
    console.log("Frequency Capped.........: " + this.frequencyCapped);
    console.log("Throttling Occurred......: " + this.throttledOccurred);
    console.log("Under Voltage Occurred...: " + this.underVoltageOccurred);
    console.log("Frequency Capped Occurred: " + this.frequencyCappedOccurred);
  }
}

module.exports = RpiThrottled;
