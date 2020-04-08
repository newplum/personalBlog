function getNow() {
    var now = Date.now() / 1000;
    var date = new Date(now * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '';
    return Y+M+D;
}

module.exports.getNow = getNow;