setInterval(function(){
  var date = new Date()
var y = date.getFullYear();
var m = date.getMonth()+1;
var d = date.getDate();
var hour = date.getHours();
var min = date.getMinutes();
var sec = date.getSeconds();
y = (y<10) ? "0" + y  : y ;
m = (m<10) ? "0" + m  : m ;
d = (d<10) ? "0" + d  : d ;
hour = (hour < 10) ? "0" + hour : hour;
min = (min < 10) ? "0" + min : min;
sec = (sec < 10) ? "0" + sec : sec;
document.getElementById("time").innerHTML = y+"/"+m+"/"+d+" "+hour+":"+min+":"+sec;
},1000)
