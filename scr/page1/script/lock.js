// for check
// console.log(
//   localStorage.getItem("onProcess"),
//   localStorage.getItem("maxProcess")
// );

// localStorage.setItem("onProcess", process);  在modal.js中实现
if (localStorage.getItem("maxProcess") == null) {
  localStorage.setItem("maxProcess", 1);
}

var maxProcess = parseInt(localStorage.getItem("maxProcess"));
var lands = document.querySelectorAll(".land");
lands.forEach(function (land) {
  var landLevel = parseInt(land.getAttribute("data-level"));
  if (landLevel <= maxProcess) {
    land.classList.add("unlocked");
    land.classList.remove("locked");
  } else {
    land.classList.add("locked");
    land.classList.remove("unlocked");
    var landTitle = land.querySelector("span");
    landTitle.textContent = landTitle.textContent + "(locked)";
  }
});
