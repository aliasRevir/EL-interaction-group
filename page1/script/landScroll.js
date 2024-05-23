document.querySelector(".landContainer").addEventListener(
  "wheel",
  function (e) {
    e.preventDefault(); // 阻止默认行为（垂直滚动）

    // 滚动方向（1 为向下，-1 为向上）
    var scrollAmount = e.deltaY < 0 ? 150 : -150; // 根据你的需求调整滚动量

    // 更新容器的scrollLeft属性
    this.scrollLeft -= scrollAmount;

    // 可选：如果你不希望滚动超过容器的边界，可以添加以下逻辑
    if (this.scrollLeft < 0) {
      this.scrollLeft = 0;
    } else if (this.scrollWidth - this.scrollLeft < this.clientWidth) {
      this.scrollLeft = this.scrollWidth - this.clientWidth;
    }
  },
  { passive: false }
); // 注意：如果页面需要高性能的滚动，可以将{ passive: false }改为{ passive: true }，但这会阻止你阻止默认行为
