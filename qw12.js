document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("video");
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // Если это Safari, добавляем атрибут controls
      video.setAttribute("controls", "true");
    } else {
      // Добавляем обработчик события при наведении (hover in)
      video.addEventListener("mouseenter", function() {
        if (video.paused) {
          video.play();
        }
      });

      // Добавляем обработчик события при уходе курсора (hover out)
      video.addEventListener("mouseleave", function() {
        if (!video.paused) {
          video.pause();
         video.load(); // Приостанавливаем видео и загружаем его снова, чтобы вернуться к началу
        }
      });
    }

    // Определение текущей ширины экрана
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var posterLarge = "https://uploads-ssl.webflow.com/64dbaedaa43534ca3aefcca6/64e3623fae422be3ed58da89_MF_cover.webp"; // Замените на URL постера для больших экранов
    var posterSmall = "https://uploads-ssl.webflow.com/64dbaedaa43534ca3aefcca6/64e61fbbcd30fdd79985fb12_MF_mobile.png"; // Замените на URL постера для маленьких экранов
    var currentPoster = screenWidth < 479 ? posterSmall : posterLarge;

    // Установка текущего постера
    video.poster = currentPoster;

    // Ваш код для ленивой загрузки видео и другие функции
    if ("IntersectionObserver" in window) {
      var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(video) {
          if (video.isIntersecting) {
            for (var source in video.target.children) {
              var videoSource = video.target.children[source];
              if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = videoSource.dataset.src;
              }
            }
            video.target.load();
            video.target.classList.remove("lazy-video");
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });

      var lazyLoadVideos = [].slice.call(document.querySelectorAll("video.lazy-video"));
      lazyLoadVideos.forEach(function(lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }

    // Ваш скрипт для автоматического воспроизведения на мобильных
    if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const videos = document.querySelectorAll('video');

      const options = {
        threshold: 0.5
      };

      const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, options);

      videos.forEach(video => {
        observer.observe(video);
      });
    }
  });
