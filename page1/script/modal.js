document.addEventListener("DOMContentLoaded", function () {
  var lands = document.querySelectorAll(".land");

  // 获取弹窗
  var modal = document.getElementById("myModal");
  // 打开弹窗的按钮对象
  var btn_cancel = document.getElementById("btn_cancel");
  // 链接
  var btn_enter = document.getElementById("btn_enter");

  // 获取 <span> 元素，用于关闭弹窗
  var span = document.querySelector(".close");

  lands.forEach(function (land) {
    land.addEventListener("click", function () {
      var process = parseInt(land.getAttribute("data-level"));
      var modalTitleElement = document.querySelector(".modal-title");

      if (localStorage.getItem("maxProcess") >= process) {
        modal.style.display = "block";
        modalTitleElement.textContent = "开始第" + process + "关！";

        btn_enter.onclick = function () {
          localStorage.setItem("onProcess", process);

          var url = "./new.html";
          window.location.href = url;
        };
      }
    });
  });

  // 点击取消 / 点击 <span> (x) / 在用户点击其他地方时, 关闭弹窗
  btn_cancel.onclick = function () {
    modal.style.display = "none";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
