
const roundUp = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

const roundDown = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.floor(num * precision) / precision;
}

const displayTime = () => {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

module.exports = {
    roundUp,
    roundDown,
    displayTime,
};
