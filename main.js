const player = document.querySelector('.footer-control');
const heading = document.querySelector('.main-section-body-name');
var playlist = document.querySelector('.main-section-body-music-list');
const cdThumb = document.querySelector('.main-section-body-img');
const audio = document.querySelector('#audio');
const cdFooter = document.querySelector('.footer-cd-img');
const cdFooterSong = document.querySelector('.footer-music-content-song');
const cdFooterAuthor = document.querySelector('.footer-music-content-author');
const playBtn = document.querySelector('.btn-toggle-play');
const nextBtn = document.querySelector('.btn-next');
const previousBtn = document.querySelector('.btn-previous');
const progress = document.querySelector('#progress');
const randomBtn = document.querySelector('.btn-random');
const repeatBtn = document.querySelector('.btn-repeat');
console.log(playBtn);
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Em hát ai nghe',
            singer: 'Orange',
            path: './assets/musics/song1.m4a',
            image: './assets/img/image1.jpg'
        },
        {
            name: 'Dịu dàng em đến',
            singer: 'Erik ft NinzaZ',
            path: './assets/musics/song2.m4a',
            image: './assets/img/image2.jpg'
        },
        {
            name: 'Hương',
            singer: 'Văn Mai Hương',
            path: './assets/musics/song3.m4a',
            image: './assets/img/image3.jpg'
        },
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: './assets/musics/song4.m4a',
            image: './assets/img/image4.jpg'
        },
        {
            name: 'Có hẹn với thanh xuân',
            singer: 'Monstar',
            path: './assets/musics/song5.mp3',
            image: './assets/img/image5.jpg'
        },
        {
            name: 'Phải chăng em đã yêu',
            singer: 'JukySan, RedT',
            path: './assets/musics/song6.mp3',
            image: './assets/img/image6.jpg'
        },
        {
            name: 'Khi em lớn',
            singer: 'Orange, Hoàng Dũng',
            path: './assets/musics/song7.mp3',
            image: './assets/img/image7.jpg'
        },
        {
            name: 'OK anh đúng!',
            singer: 'Orange',
            path: './assets/musics/song8.mp3',
            image: './assets/img/image8.jpg'
        },
        {
            name: 'Có em đời bỗng vui',
            singer: 'Chilles',
            path: './assets/musics/song9.mp3',
            image: './assets/img/image9.jpg'
        },
        {
            name: 'Tình nào không như tình đầu',
            singer: 'Trung Quân',
            path: './assets/musics/song10.mp3',
            image: './assets/img/image10.jpg'
        },
    ],


    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
                <li class="main-section-body-music-item ${index === app.currentIndex ? 'active2' : ''}" data-index = "${index}">
                    <img src="${song.image}" alt="" class="main-section-body-music-item-img">
                    <div class="main-section-body-music-item-content">
                        <div class="main-section-body-music-item-music-name">${song.name}</div>
                        <div class="main-section-body-music-item-music-author">${song.singer}</div>
                    </div>
                </li>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    

    handleEvents: function() {
        //Xử lí khi click nút play / pause
        playBtn.onclick = function() {
            if(app.isPlaying) {
                audio.pause();
            }else{
                audio.play();
            }
        }

        //Khi bài hát đang chạy
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi bài hát dừng
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Xử lí khi click next
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //Xử lí khi click previous
        previousBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }else{
                app.previousSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //Xử lí khi đĩa quay:
        var cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
        }

        //Xử lí khi tua
        progress.onchange = function(e) {
            const seekTime = ((audio.duration / 100) * (e.target.value));
            audio.currentTime = seekTime;
        }

        //Xử lí khi ấn nút random
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            if(app.isRandom) {
                randomBtn.classList.add('active1');
            }else{
                randomBtn.classList.remove('active1');
            }
        }

        //Xử lí song khi audio ended(chuyển bài khác hoặc bật lại bài đó)
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        
        //Xử lí khi ấn nút repeat
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active1', app.isRepeat);
        }

        //Xử lí khi ấn vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.main-section-body-music-item:not(.active2)');
            if(songNode) {
                app.currentIndex = Number(songNode.getAttribute('data-index'));
                app.loadCurrentSong();
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }
        }

    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = `${this.currentSong.path}`;
        cdFooter.style.backgroundImage = `url('${this.currentSong.image}')`;
        cdFooterSong.textContent = this.currentSong.name;
        cdFooterAuthor.textContent = this.currentSong.singer;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    previousSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let randomIndex;
        do{
            randomIndex = (Math.floor(Math.random() * this.songs.length)); 
        }while(randomIndex === this.currentIndex);
        this.currentIndex = randomIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            document.querySelector('.main-section-body-music-item.active2').scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            }, 300)
        })
    },

    start: function() {
        
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

app.start();
