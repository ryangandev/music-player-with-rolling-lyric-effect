/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象
 * { time: 开始时间， words: 歌词内容 }
 */


function parseLrc() {
    let lines = lrc.split('\n');
    let results = []; // lyric list
    for (let i = 0; i < lines.length; i++) {
        let str = lines[i];
        let parts = str.split(']');
        let timeStr = parts[0].substring(1);

        let obj = {
            time: parseTime(timeStr),
            lyrics: parts[1]
        };

        results.push(obj);
    }
    return results;
}

/**
 * 将一个时间字符串解析为数字（秒）
 * @param {String} timeStr 时间字符串
 * @returns 
 */

function parseTime(timeStr) {
    let parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1];
}

let lyricData = parseLrc();

// get the required dom elements
let doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}

/**
 * Calculate at the current time of the audio player
 * which lyric should be displayed from the lyricData
 * if no lyric needs to be displayed, get -1
 */
function findIndex() {
    let curTime = doms.audio.currentTime;
    for (let i = 0; i < lyricData.length; i++) {
        if (curTime < lyricData[i].time) {
            return i - 1;
        }
    }

    // can't find, return the last one
    return lyricData.length - 1;
}

// UI

/**
 * Create a lyric element li
 */
// function createLyricElement() {
//     for(let i = 0; i < lyricData.length; i++) {
//         let li = document.createElement('li');
//         li.textContent = lyricData[i].lyrics;
//         doms.ul.appendChild(li); // modified dom tree
//     }
// }

/**
 * Optimized version of createLyricElement
 * Create a fragment and append it to the dom tree
 */
 function createLyricElement() {
    let fragment = document.createDocumentFragment(); // document fragment
    for(let i = 0; i < lyricData.length; i++) {
        let li = document.createElement('li');
        li.textContent = lyricData[i].lyrics;
        fragment.appendChild(li); // modified fragment
    }
    doms.ul.appendChild(fragment); // modified dom tree
 }

 createLyricElement();

 const containerHeight = doms.container.clientHeight; // container height
 const liHeight = doms.ul.children[0].clientHeight; // every li height
 const maxOffset = doms.ul.clientHeight - containerHeight; // max offset

 /**
  * set ul offset when time changes
  */
 function setOffset() {
    let index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2;

    if (offset < 0) {
        offset = 0;
    }

    if (offset > maxOffset) {
        offset = maxOffset;
    }

    doms.ul.style.transform = `translateY(-${offset}px)`;

    // remove active class
    let li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }

    li = doms.ul.children[index];
    if (li) {
        li.classList.add('active');
    }
 }

 doms.audio.addEventListener('timeupdate', setOffset);
 