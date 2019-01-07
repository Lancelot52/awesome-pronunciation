const fs = require('fs')
const http = require('http')
const https = require('https')

const DB_NAME = './helper/db.json'
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const HTTP = 'http://'
const HTTPS = 'https://'

/**
 * download audios
 * @param {string} letter all or a letter
 */
function download(letter = 'all') {
  const data = JSON.parse(fs.readFileSync(DB_NAME))
  if(letter === 'all') {
    for(const i of ALPHABET) {
      const wordList = data[i]
      downloadLetter(wordList)
    }
  } else {
    const wordList = data[letter]
    downloadLetter(wordList)
  }
}

/**
 * download single letter audios
 * @param {List} wordList 
 */
function downloadLetter(wordList) {
  for(const j of wordList) {
    for(const index in j.origin) {
      let filepath = ''
      if(j.origin.length === 1) {
        filepath = `./docs/.vuepress/public/audio/${j.word.replace('.','_')}.mp3`
      } else {
        filepath = `./docs/.vuepress/public/audio/${j.word.replace('.','_')}_${index}.mp3`
      }
      
      if(!isFileExist(filepath)) {
        const file = fs.createWriteStream(filepath)
        if(j.origin[index].includes(HTTP)) {
          http.get(j.origin[index], function(response) {
            response.pipe(file);
          })
        } else if(j.origin[index].includes(HTTPS)){
          https.get(j.origin[index], function(response) {
            response.pipe(file);
          })
        }
      }
    }
  }
}

/**
 * whether the file exists
 * @param {String} path 
 */
function isFileExist(path) {
  try{
    fs.accessSync(path, fs.F_OK);
  }catch(e){
    return false;
  }
  return true;
}

const options = process.argv
if(options.length >= 3) {
  download(options[2])
} else {
  download()
}
