(function (window, document) {
    var verticalSlide = false; // 页面滑动方向
    var confettisAllow = true; // 礼花特效
    var bgmAllow = true; // BGM 功能

    var currentPosition = 0; // 记录当前页面位置
    var currentPoint = -1;   // 记录当前点的位置
    var pageNow = 1;   // 当前页码
    var points = null; // 页码数
    var pagePointView = null; // 分页符
    var pageLoading = null; // 加载动画
    var playBtn = null; // 音乐播放按钮

    var app = {
        init: function () {
            var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
            if (!mobile) {
                location.href = 'views/pc.html';
            }
            window.ontouchend = function () {
                setTimeout(function () {
                    if (pageNow == points.length && confettisAllow) {
                        confettis();
                        confettisAllow = false;
                        setTimeout(function () {
                            confettisAllow = true;
                        }.bind(this), 800);
                    }
                }.bind(this), 800);
            }
            window.onload = function () {
                var viewport = document.querySelector('#viewport');
                viewport.style.opacity = "1";
                pagePointView.style.opacity = "1";
                if (bgmAllow) {
                    playBtn.style.opacity = "1";
                }
                pageLoading.style.opacity = "0";
            }
            document.addEventListener('DOMContentLoaded', function () {
                var viewport = document.querySelector('#viewport');
                viewport.style.opacity = "0";
                var numItems = viewport.children.length;
                if (verticalSlide) {
                    viewport.style.height = numItems * 100 + '%';
                    viewport.className = "viewport-ver";
                } else {
                    viewport.style.width = numItems * 100 + '%';
                    viewport.className = "viewport";
                }
                var numItems = document.querySelectorAll('.pageview center');
                var pageNumber = document.querySelector('#pagenumber');
                pageNumber.innerHTML = '';
                for (var i = 0; i < numItems.length; i++) {
                    var div = document.createElement('div');
                    pageNumber.appendChild(div);
                }
                points = document.querySelectorAll('#pagenumber div');
                pagePointView = document.querySelector('#pagenumber');
                pagePointView.style.opacity = "0";
                if (verticalSlide) {
                    pagePointView.className = 'pagenumber-ver';
                } else {
                    pagePointView.className = 'pagenumber';
                }
                pageLoading = document.querySelector('#pageloading');
                pageLoading.style.opacity = "1";
                playBtn = document.querySelector('#playbtn');
                playBtn.style.opacity = "0";
                if (verticalSlide) {
                    app.bindVerticalTouchEvent(); // 绑定触摸事件
                } else {
                    app.bindHisTouchEvent(); // 绑定触摸事件
                }
                app.setPageNow();     // 设置初始页码
            }.bind(app), false);
        }(),

        // 页面平移
        transform: function (translate) {
            if (verticalSlide) {
                this.style.webkitTransform = 'translate3d(0, ' + translate + 'px, 0)';
            } else {
                this.style.webkitTransform = 'translate3d(' + translate + 'px, 0, 0)';
            }
            currentPosition = translate;

        },

        /**
         * 设置当前页码
         */
        setPageNow: function () {
            if (currentPoint != -1) {
                points[currentPoint].className = '';
            }
            currentPoint = pageNow - 1;
            points[currentPoint].className = 'now';
        },

        /**
         * 绑定触摸事件
         */
        bindHisTouchEvent: function () {
            var viewport = document.querySelector('#viewport');
            var pageWidth = window.innerWidth; // 页面宽度
            var maxWidth = - pageWidth * (points.length - 1); // 页面滑动最后一页的位置
            var startX, startY;
            var initialPos = 0;  // 手指按下的屏幕位置
            var moveLength = 0;  // 手指当前滑动的距离
            var direction = 'left'; // 滑动的方向
            var isMove = false; // 是否发生左右滑动
            var startT = 0; // 记录手指按下去的时间
            var isTouchEnd = true; // 标记当前滑动是否结束(手指已离开屏幕) 

            // 手指放在屏幕上
            viewport.addEventListener('touchstart', function (e) {
                e.preventDefault();
                // 单手指触摸或者多手指同时触摸，禁止第二个手指延迟操作事件
                if (e.touches.length === 1 || isTouchEnd) {
                    var touch = e.touches[0];
                    startX = touch.pageX;
                    startY = touch.pageY;
                    initialPos = currentPosition;   // 本次滑动前的初始位置
                    viewport.style.webkitTransition = ''; // 取消动画效果
                    startT = + new Date(); // 记录手指按下的开始时间
                    isMove = false; // 是否产生滑动
                    isTouchEnd = false; // 当前滑动开始
                }
            }.bind(this), false);

            // 手指在屏幕上滑动，页面跟随手指移动
            viewport.addEventListener('touchmove', function (e) {
                e.preventDefault();

                // 如果当前滑动已结束，不管其他手指是否在屏幕上都禁止该事件
                if (isTouchEnd) return;

                var touch = e.touches[0];
                var deltaX = touch.pageX - startX;
                var deltaY = touch.pageY - startY;

                var translate = initialPos + deltaX; // 当前需要移动到的位置
                // 如果translate>0 或 < maxWidth,则表示页面超出边界
                if (translate > 0) {
                    translate = 0;
                }
                if (translate < maxWidth) {
                    translate = maxWidth;
                }
                deltaX = translate - initialPos;
                this.transform.call(viewport, translate);
                isMove = true;
                moveLength = deltaX;
                direction = deltaX > 0 ? 'right' : 'left'; // 判断手指滑动的方向
            }.bind(this), false);

            // 手指离开屏幕时，计算最终需要停留在哪一页
            viewport.addEventListener('touchend', function (e) {
                e.preventDefault();
                var translate = 0;
                // 计算手指在屏幕上停留的时间
                var deltaT = + new Date() - startT;
                // 发生了滑动，并且当前滑动事件未结束
                if (isMove && !isTouchEnd) {
                    isTouchEnd = true; // 标记当前完整的滑动事件已经结束 
                    // 使用动画过渡让页面滑动到最终的位置
                    viewport.style.webkitTransition = '0.3s ease -webkit-transform';
                    if (deltaT < 300) { // 如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
                        if (currentPosition === 0 && translate === 0) {
                            return;
                        }
                        translate = direction === 'left' ?
                            currentPosition - (pageWidth + moveLength)
                            : currentPosition + pageWidth - moveLength;
                        // 如果最终位置超过边界位置，则停留在边界位置
                        // 左边界
                        translate = translate > 0 ? 0 : translate;
                        // 右边界
                        translate = translate < maxWidth ? maxWidth : translate;
                    } else {
                        // 如果滑动距离小于屏幕的50%，则退回到上一页
                        if (Math.abs(moveLength) / pageWidth < 0.5) {
                            translate = currentPosition - moveLength;
                        } else {
                            // 如果滑动距离大于屏幕的50%，则滑动到下一页
                            translate = direction === 'left' ?
                                currentPosition - (pageWidth + moveLength)
                                : currentPosition + pageWidth - moveLength;
                            translate = translate > 0 ? 0 : translate;
                            translate = translate < maxWidth ? maxWidth : translate;
                        }
                    }

                    // 执行滑动，让页面完整的显示到屏幕上
                    this.transform.call(viewport, translate);
                    // 计算当前的页码
                    pageNow = Math.round(Math.abs(translate) / pageWidth) + 1;

                    setTimeout(function () {
                        // 设置页码，DOM操作需要放到异步队列中，否则会出现卡顿
                        this.setPageNow();
                    }.bind(this), 100);
                }
            }.bind(this), false);
        },

        /**
         * 绑定触摸事件
         */
        bindVerticalTouchEvent: function () {
            var viewport = document.querySelector('#viewport');
            var pageWidth = window.innerWidth; // 页面宽度
            var pageHeight = window.innerHeight; // 页面高度
            var maxHeight = - pageHeight * (points.length - 1); // 页面滑动最后一页的位置
            var startX, startY;
            var initialPos = 0;  // 手指按下的屏幕位置
            var moveLength = 0;  // 手指当前滑动的距离
            var direction = 'left'; // 滑动的方向
            var isMove = false; // 是否发生左右滑动
            var startT = 0; // 记录手指按下去的时间
            var isTouchEnd = true; // 标记当前滑动是否结束(手指已离开屏幕) 

            // 手指放在屏幕上
            viewport.addEventListener('touchstart', function (e) {
                e.preventDefault();
                // 单手指触摸或者多手指同时触摸，禁止第二个手指延迟操作事件
                if (e.touches.length === 1 || isTouchEnd) {
                    var touch = e.touches[0];
                    startX = touch.pageX;
                    startY = touch.pageY;
                    initialPos = currentPosition;   // 本次滑动前的初始位置
                    viewport.style.webkitTransition = ''; // 取消动画效果
                    startT = + new Date(); // 记录手指按下的开始时间
                    isMove = false; // 是否产生滑动
                    isTouchEnd = false; // 当前滑动开始
                }
            }.bind(this), false);

            // 手指在屏幕上滑动，页面跟随手指移动
            viewport.addEventListener('touchmove', function (e) {
                e.preventDefault();

                // 如果当前滑动已结束，不管其他手指是否在屏幕上都禁止该事件
                if (isTouchEnd) return;

                var touch = e.touches[0];
                var deltaX = touch.pageX - startX;
                var deltaY = touch.pageY - startY;

                var translate = initialPos + deltaY; // 当前需要移动到的位置
                // 如果translate>0 或 < maxHeight,则表示页面超出边界
                if (translate > 0) {
                    translate = 0;
                }
                if (translate < maxHeight) {
                    translate = maxHeight;
                }
                deltaY = translate - initialPos;
                this.transform.call(viewport, translate);
                isMove = true;
                moveLength = deltaY;
                direction = deltaY > 0 ? 'right' : 'left'; // 判断手指滑动的方向
            }.bind(this), false);

            // 手指离开屏幕时，计算最终需要停留在哪一页
            viewport.addEventListener('touchend', function (e) {
                e.preventDefault();
                var translate = 0;
                // 计算手指在屏幕上停留的时间
                var deltaT = + new Date() - startT;
                // 发生了滑动，并且当前滑动事件未结束
                if (isMove && !isTouchEnd) {
                    isTouchEnd = true; // 标记当前完整的滑动事件已经结束 
                    // 使用动画过渡让页面滑动到最终的位置
                    viewport.style.webkitTransition = '0.3s ease -webkit-transform';
                    if (deltaT < 300) { // 如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
                        if (currentPosition === 0 && translate === 0) {
                            return;
                        }
                        translate = direction === 'left' ?
                            currentPosition - (pageHeight + moveLength)
                            : currentPosition + pageHeight - moveLength;
                        // 如果最终位置超过边界位置，则停留在边界位置
                        // 左边界
                        translate = translate > 0 ? 0 : translate;
                        // 右边界
                        translate = translate < maxHeight ? maxHeight : translate;
                    } else {
                        // 如果滑动距离小于屏幕的50%，则退回到上一页
                        if (Math.abs(moveLength) / pageHeight < 0.5) {
                            translate = currentPosition - moveLength;
                        } else {
                            // 如果滑动距离大于屏幕的50%，则滑动到下一页
                            translate = direction === 'left' ?
                                currentPosition - (pageHeight + moveLength)
                                : currentPosition + pageHeight - moveLength;
                            translate = translate > 0 ? 0 : translate;
                            translate = translate < maxHeight ? maxHeight : translate;
                        }
                    }

                    // 执行滑动，让页面完整的显示到屏幕上
                    this.transform.call(viewport, translate);
                    // 计算当前的页码
                    pageNow = Math.round(Math.abs(translate) / pageHeight) + 1;

                    setTimeout(function () {
                        // 设置页码，DOM操作需要放到异步队列中，否则会出现卡顿
                        this.setPageNow();
                    }.bind(this), 100);
                }
            }.bind(this), false);
        }
    }
})(window, document);

function play() {
    var music = document.getElementById('bgm');
    var music_btn = document.getElementById('playbtn');
    if (music.paused){
        music.play();
        music_btn.src = 'images/play.png';
    }
    else{
        music.pause();
        music_btn.src = 'images/pause.png'; 
    }
}

function confettis() {
    confetti({
        particleCount: 200,
        spread: 60,
        angle: 60,
        gravity: 0.8,
        origin: {
            x: 0.2,
            y: 0.8
        }
    });

    confetti({
        particleCount: 200,
        spread: 60,
        angle: 120,
        gravity: 0.8,
        origin: {
            x: 0.8,
            y: 0.8
        }
    });
}
