const fs = require('fs')

const DB_NAME = './helper/db.json'
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const EN = 'en'
const ZH = 'zh'

/**
 * get file head content
 * @param {String} letter 
 * @param {String} lang 
 */
function getHead(letter, lang) {
  let head = ''
  if(lang === EN) {
    head = 
`
# ${letter}

| Word  | Pronunciation | Symbol |
| :-- | :-- | :-- |
`
  } else if(lang === ZH) {
    head = 
`
# ${letter}

| 单词  | 发音 | 音标 |
| :-- | :-- | :-- |
`
  }
  return head
}

function getFooter() {
  const footer =
`
<style lang="css">
audio {
  height: 30px;
}

@media screen and (max-width: 720px){
  audio { 
    width: 20px; 
  } 
}
</style>
`
  return footer

}

function getReference(wordList, lang) {
  let reference = ''
  if(lang === EN) {
    reference = 
`
## Reference

`
  } else if(lang === ZH) {
    reference = 
`
## 参考资料

`
  }
  let flag = false
  for(const item of wordList) {
    if(item.reference !== '') {
      reference += `- ${item.reference}\n`
      flag = true
    }
  }
  return flag ? reference : ''
}

function getRow(word) {
  let pron = ''
  let symbol = ''
  let url = ''
  for(const index in word.symbol) {
    if(index === '0') {
      console.log(word.symbol.length)
      if(word.symbol.length === 1) {
        url = '/audio/' + encodeURIComponent(`${word.word.replace('.','_')}.mp3`)
      } else {
        url = '/audio/' + encodeURIComponent(`${word.word.replace('.','_')}_${index}.mp3`)
      }
      pron = `<audio :src="$withBase('${url}')" controls="controls"></audio>`
      symbol = `${word.symbol[index]}`
    } else {
      url = '/audio/' + encodeURIComponent(`${word.word.replace('.','_')}_${index}.mp3`)
      pron += `<br/><audio :src="$withBase('${url}')" controls="controls"></audio>`
      symbol += `<br/>${word.symbol[index]}`
    }
  }
  
  const content =
`| ${word.word} | ${pron} | ${symbol} |\n`
  return content
}


// 保存文件
function saveFile(filename, content) {
  fs.writeFile(filename, content, err => {  
    if (err) throw err
    console.log(`${filename} saved!`)
  })
}

// 
function write() {
  const data = JSON.parse(fs.readFileSync(DB_NAME))
  const enDir = './docs/content/'
  writeAll(data, enDir, EN)
  const zhDir = './docs/zh/content/'
  writeAll(data, zhDir, ZH)
}

function writeAll(data, dir, lang) {
  for(const i of ALPHABET) {
    const wordList = data[i]
    const path = `${dir}${i}.md`
    writeLetter(i, wordList, path, lang)
  }
}

function writeLetter(letter, wordList, path, lang) {
  let content = getHead(letter, lang)
  for(const j of wordList) {
    content += getRow(j)
  }
  content += getReference(wordList, lang)
  content += getFooter()
  saveFile(path, content)
}

write()
