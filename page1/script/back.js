// 如果通过：返回onProcess，如果onProcess > maxProcess ,更新maxProcess
// 不通过不改
// 返回首页

var pass = document.getElementById("Pass");
var notPass = document.getElementById("NotPass");

pass.onclick = function(){
    var maxProcess = parseInt(localStorage.getItem("maxProcess"));
    var onProcess = parseInt(localStorage.getItem("onProcess"));
    maxProcess = maxProcess > (onProcess+1) ? maxProcess : (onProcess+1);
    localStorage.setItem("maxProcess",maxProcess);
    
    var url = "./index.html";
    window.location.href = url;
};


notPass.onclick = function(){
    var url = "./index.html";
    window.location.href = url;
}