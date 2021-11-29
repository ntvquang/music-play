const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const playList = $(".playlist");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Do Toc 2",
      singer: "Domixi",
      // path: '../img/doctoc2.jpg'
      path: "./assets/music/DoToc2.mp3",
      image: "./assets/img/doctoc2.jpg",
    },
    {
      name: "Fly Away",
      singer: "TheFatRatAnjuli",
      path: "./assets/music/FlyAway-TheFatRatAnjulie.mp3",
      image: "./assets/img/flyAway.jpg",
    },
    {
      name: "Sugar",
      singer: "Maroon5",
      path: "./assets/music/Sugar-Maroon5.mp3",
      image: "./assets/img/sugar.jpg",
    },
    {
      name: "Sai Gon Hom Nay Mua",
      singer: "JSOLHoangDuyen",
      path: "./assets/music/SaiGonHomNayMua-JSOLHoangDuyen.mp3",
      image: "./assets/img/saigonhomnaymua.jpg",
    },
    {
      name: "Waiting For Love",
      singer: "Avicii",
      path: "./assets/music/WaitingForLove-Avicii.mp3",
      image: "./assets/img/waitingforlove.jpg",
    },
    {
      name: "Wake Me Up",
      singer: "Avicii",
      path: "./assets/music/WakeMeUpRadioEdit-Avicii.mp3",
      image: "./assets/img/Avicii_Wake_Me_Up.jpg",
    },
  ],

  // render ra danh sách bài hát
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `;
    });
    playList.innerHTML = htmls.join("");
  },

  // hàm xử lý sự kiện
  hanleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // xử lý thu nhỏ CD khi croll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lý CD xoay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý khi click vào nút play || pause
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi play bài hát
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi pause bài hát
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // xử lý lấy thời gian hiện tại của bài hát
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lý khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };

    // next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.render();
      audio.play();
    };

    // prev bài hát
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.render();
      audio.play();
    };

    // khi bài hát ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // bật tắt random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // bật tắt repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //phát 1 bài hát khi click vào nó
    playList.onclick = function (e) {
      const nodeSong = e.target.closest(".song:not(.active)");
      if (nodeSong || e.target.closest(".option")) {
        // xử lý khi click vào bài hát
        if (nodeSong && !e.target.closest(".option")) {
          _this.currentIndex = Number(nodeSong.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if (e.target.closest(".option")) {
          console.log(e.target);
        }
      }
    };
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  // xử lý khi next bài hát
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  // xử lý khi prev bài hát
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  // random bài hát
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  // xử lý load ra bài hát hiện tại
  loadCurrentSong: function () {
    header.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  start: function () {
    this.defineProperties();
    // gọi lại hàm xử lý sự kiện
    this.hanleEvent();
    // load ra bài hát hiện tại
    this.loadCurrentSong();
    // render ra danh sách bài hát
    this.render();
  },
};
app.start();
