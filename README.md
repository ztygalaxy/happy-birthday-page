<p align="center">
    <img width="100" height="100" src="icon.png" alt="logo">
</p>

# happy-birthday-page

### 一个 HTML 动态网页生日贺卡，送给好朋友的生日礼物。

<img src="demo.jpeg" style="width: 300px" />

### 🎉 演示

访问 [Happy Birthday](https://tyzhang.top/happy-birthday-pages/) 预览， 或者扫描下方二维码，点击音乐按钮可播放或者暂停 BGM。

<img src="qcode.png" style="width: 100px" />

### 🔨 快速开始

- 在 `index.html` 中，每一个 `.pageview` 标签代表一个页面，可以**自由增删页面**，或修改里面的文字。

  ```html
  <div class="pageview" style="background-image: url(images/img01.jpg); background-position: center center; background-size: cover; background-repeat: no-repeat; width: 100%; height: 100%;">
      <center style="margin-top: 15%">
          <h1 style="font-size: 50px;color: #FFFFFF">Hello</h1>
          <h2 style="font-size: 45px;color: #FFFFFF">World</h2>
          <h3 style="font-size: 30px;color: #FFFFFF">To : Username</h3>
      </center>
  </div>                 
  ```

- 修改 `index.html` 中有关音乐的部分以**替换 BGM**。

  ```html
  <audio id="bgm" src="http://download.tyzhang.top/files/bgm.mp3" loop="loop"></audio>
  ```

- 修改 `js/app.js`  中的页面方向参数，**横向或者纵向滑动**。

   ```javascript
   var vertical = false; // 页面滑动方向
   ```

- `/images` 下存放了每一页的**背景图**。

- `Fork` 并修改后，发布为 `GitHub Pages` 即可。

### 🎤 其他

首次提交：`2017-03-27`

最新提交：`2024-06-10`

记得给我一颗star，有问题可以[邮件](mailto:zhangty1996@163.com)给我。