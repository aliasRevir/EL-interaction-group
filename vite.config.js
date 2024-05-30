import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0", //ip地址
    port: 5500, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
  },
});
