'use strict'
const fs=require('node:fs')
const path=require('node:path')
function prepare() {
  const directory=path.join(__dirname,'..','assets','ocr')
  fs.mkdirSync(directory,{recursive:true})
  for(const language of ['eng','pol']) {
    const root=path.dirname(require.resolve('@tesseract.js-data/'+language))
    fs.copyFileSync(path.join(root,'4.0.0_best_int',language+'.traineddata.gz'),path.join(directory,language+'.traineddata.gz'))
  }
}
module.exports=prepare
if(require.main===module) prepare()
