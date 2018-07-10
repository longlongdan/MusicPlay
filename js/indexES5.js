'use strict';

$(function () {
	var musicList = $('.musicList');
	var music = $('audio');
	var musicSlt = $('.musicSlt');
	var volumeContent = $('.volumeContent');
	var _html = '';
	var num = { number: 3 };
	var infos = {};
	var scroll = new BScroll('.wrapper', { click: true });
	var angle = 0;
	/*歌词显示*/
	musicSlt.on('click', function () {
		console.log('本是要显示歌词');
	});
	setInterval(function () {
		if (!music[0].paused) {
			angle += 3;
			rotate(angle);
		}
	}, 50);
	music[0].volume = 0.2;
	$.ajax({
		url: './pbl.json',
		success: function success(info) {
			infos = info;
			info.forEach(function (val, index) {
				_html += '<li class="musicItem">\n\t\t\t\t\t<img src="./' + val.img + '" alt="" class="musicImg">\n\t\t\t\t\t<p class="musicName">' + val.musicName + '</p>\n\t\t\t\t\t<p class="musicSinger">' + val.name + '</p>\n\t\t\t\t</li>';
			});
			musicList.html(_html);
			/*绑定点击切换歌曲功能*/
			$("li").each(function (index, val) {
				$(val).click(function () {
					if (num.number !== index) {
						music.attr('src', info[index].src);
						num.number = index;
						playMusic(music);
						changeMusic(musicSlt, './' + info[index].img);
					}
				});
			});
			/*绑定上一曲切换功能*/
			$('.pre').click(function () {
				pre(num, music, info, musicSlt);
			});
			/*绑定下一曲切换功能*/
			$('.next').click(function () {
				next(num, music, info, musicSlt);
			});
			$('.play').click(function () {
				playMusic(music);
			});
		},

		dataType: 'json',
		type: 'get'
	});
	/*歌曲进度改变事件*/
	$('.progress').on('input propertychange', function () {
		music[0].currentTime = this.value / 100 * music[0].duration;
	});
	setInterval(function () {
		// console.log($('.musicItem').eq(num.number))
		$('.musicItem').eq(num.number).css('backgroundColor', 'rgba(0,0,0,0.6)').siblings().css('backgroundColor', 'rgba(255,255,255,0.4)');
		if (!music[0].paused) {
			var time = Math.ceil(100 * music[0].currentTime / music[0].duration);
			$('.progress').val(time);
			if (music[0].ended || time>=100) {
				next(num, music, infos, musicSlt);
				$('.progress').val(0);
			}
		}
	}, 100);
	/*音量监听*/
	$('.volu').on('click', function () {
		volumeContent.fadeToggle(500);
	});
	/*歌曲进度改变事件*/
	$('.volume').on('input propertychange', function () {
		music[0].volume = this.value / 100;
	});
});
function playMusic(music) {
	if (music[0].paused) {
		music[0].play();
		$('.play').attr('src', './img/stop.png');
	} else {
		music[0].pause();
		$('.play').attr('src', './img/play.png');
	}
}
function changeMusic(img, path) {
	img.attr('src', path);
}
function pre(num, music, info, img) {
	num.number--;
	if (num.number < 0) {
		num.number = info.length - 1;
	}
	changeMusic(img, './' + info[num.number].img);
	music.attr('src', info[num.number].src);
	music[0].play();
	$('.play').attr('src', './img/stop.png');
}
function next(num, music, info, img) {
	num.number++;
	if (num.number >= info.length) {
		num.number = 0;
	}
	changeMusic(img, './' + info[num.number].img);
	music.attr('src', info[num.number].src);
	music[0].play();
	$('.play').attr('src', './img/stop.png');
}
function rotate(angle) {
	$('.musicSlt').rotate(angle);
}