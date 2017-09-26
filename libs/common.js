var toDou = function(n){
    return n<10 ? '0'+n : ''+n;
}

module.exports = {
    time2date: function(timesTemp){
        var oDate = new Date();
        oDate.setTime(timesTemp*1000);

        return oDate.getFullYear() + '-' + toDou(oDate.getMonth()+1) + '-' + toDou(oDate.getDate()) + ' ' + toDou(oDate.getHours() + ':' + toDou(oDate.getMinutes()) + ':' + toDou(oDate.getDay()));
    }
}