
$(()=> {
	let musicList = $('.musicList')
	let music = $('audio')
	let musicSlt = $('.musicSlt')
	let volumeContent = $('.volumeContent')
	let _html = ''
	let num = {number:3}
	let infos = {};
	let scroll = new BScroll('.wrapper',{click:true})
	let angle = 0;
	/*歌词显示*/
	musicSlt.on('click',function(){
		console.log('本是要显示歌词')
	})
	setInterval(()=>{
		if(!music[0].paused){
			angle+=3
			rotate(angle)
		}
	},50)
	music[0].volume = 0.2;
	$.ajax({
		url: './pbl.json',
		success (info) {
			infos = info
			info.forEach((val,index)=>{
				_html += (`<li class="musicItem">
					<img src="./${val.img}" alt="" class="musicImg">
					<p class="musicName">${val.musicName}</p>
					<p class="musicSinger">${val.name}</p>
				</li>`)
			})
			musicList.html(_html)
			/*绑定点击切换歌曲功能*/
			$("li").each((index,val)=>{
				$(val).click(()=>{
					if (num.number !== index) {
						music.attr('src',info[index].src)
						num.number = index
						playMusic(music)
						changeMusic(musicSlt,`./${info[index].img}`)
					}
				})
			})
			/*绑定上一曲切换功能*/
			$('.pre').click(()=>{
				pre(num,music,info,musicSlt)
			}) 
			/*绑定下一曲切换功能*/
			$('.next').click(()=>{
				next(num,music,info,musicSlt)
			})
			$('.play').click(()=>{
				playMusic(music)
			})
		},
		dataType: 'json',
		type: 'get'
	})
	/*歌曲进度改变事件*/
	$('.progress').on('input propertychange',function(){
        music[0].currentTime = this.value/100*music[0].duration
    })
	setInterval(()=>{
		// console.log($('.musicItem').eq(num.number))
		$('.musicItem').eq(num.number).css('backgroundColor','rgba(0,0,0,0.6)').siblings().css('backgroundColor','rgba(255,255,255,0.4)')
		if (!music[0].paused) {
			let time = Math.ceil(100*music[0].currentTime/music[0].duration)
			$('.progress').val(time)
			if (music[0].ended || time >=100) {
				next(num,music,infos,musicSlt)
				$('.progress').val(0)
			}
		}
	},1000)
	/*音量监听*/
	$('.volu').on('click',()=>{
		volumeContent.fadeToggle(500)
	})
	/*歌曲进度改变事件*/
	$('.volume').on('input propertychange',function(){
        music[0].volume = this.value/100;
    })
})
function playMusic(music) {
	if (music[0].paused) {
		music[0].play()
		$('.play').attr('src','./img/stop.png')
	}
	else {
		music[0].pause()
		$('.play').attr('src','./img/play.png')
	}
}
function changeMusic(img,path) {
	img.attr('src',path)
}
function pre(num,music,info,img){
	num.number--;
	if (num.number < 0) {
		num.number = info.length-1
	}
	changeMusic(img,`./${info[num.number].img}`)
	music.attr('src',info[num.number].src)
	music[0].play()	
	$('.play').attr('src','./img/stop.png')	
}
function next(num,music,info,img){
	num.number++;
	if (num.number >=info.length) {
		num.number = 0
	}	
	changeMusic(img,`./${info[num.number].img}`)
	music.attr('src',info[num.number].src)
	music[0].play()	
	$('.play').attr('src','./img/stop.png')	
}
function rotate (angle) {
	$('.musicSlt').rotate(angle)
}