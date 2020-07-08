setTimeout(function(){location.reload()},500000); //指定1秒刷新一次
// window.onload = function() {
  // 1---轮播图
  var mySwiper = new Swiper ('.swiper1', {
    direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    autoplay: {
      delay: 5000,//1秒切换一次
    },
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },
    
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // 如果需要滚动条
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  })  
// 2
  var swiper = new Swiper('.swiper2', {
    autoplay: {
      delay: 3000,//1秒切换一次
    },
    observer:true,
    observeParents:true,
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      // rotate: 50,
      // stretch: 0,
      // depth: 180,
      // modifier:1,
      slideShadows : true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  });
  // 3.
  var swiper = new Swiper('.swiper3', {
    observer:true,
    observeParents:true,
    autoplay: {
      delay: 3000,//1秒切换一次
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // 4
  var swiper = new Swiper('.swiper4', {
    observer:true,
    observeParents:true,
    autoplay: {
      delay: 3000,//1秒切换一次
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: true,
    },
  });


// }

// 2---滚动列表
function Scroll() { }
Scroll.prototype.upScroll = function (dom, _h, interval) {
  var dom = document.getElementById(dom);
  var timer = setTimeout(function () {

    var _field = dom.firstElementChild;
    _field.style.marginTop = _h;
    clearTimeout(timer);
  }, 1000)
  setInterval(function () {
    var _field = dom.firstElementChild;
    _field.style.marginTop = "0px";
    dom.appendChild(_field);
    var _field = dom.firstElementChild
    _field.style.marginTop = _h;
  }, interval)
}
var myScroll = new Scroll();

/*这是启动方式*/
/*
 * demo 父容器(ul)的id
 * -36px 子元素li的高度
 * 3000  滚动间隔时间
 * 每次滚动持续时间可到css文件中修改
 */
myScroll.upScroll("demo", "-36px", 4000);