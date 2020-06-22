
let fs = require('fs');
let save = require('file-save');
let resolve = require('path').resolve;
let basename = require('path').basename;
let localePath = resolve(__dirname, '../src/')
let fileList = fs.readdirSync(localePath)

let transform = (filename, name) => {
  return require('babel-core').transformFileSync(filename, {
    presets: ['es2015'],
    plugins: [
      'add-module-exports',
      [
        'transform-es2015-modules-umd', 
        {
          loose: true
        }
      ]
    ],
    moduleId: name
  })
}

let dir = []
let trans = (arr, n) => {
  n = n || ''
  arr.filter(file => {
    return file !== '.DS_Store'
  }).forEach(file => {
    if (!/[a-z]+(?=\.)/i.test(file)) {
      n = n && n + '/'
      dir.push({
        dir: localePath + '/' + n + file,
        outPath: '/' + n + file
      })
      
      trans(fs.readdirSync(localePath + '/' + n + file), file)
    }
  })
}

trans(fileList)

dir.forEach(item => {
  let dir = item.dir
  let outPath = '../dist/lib/' + item.outPath
  fs.readdirSync(dir).filter(file => {
    return /\.js$/.test(file)
  }).forEach(file => {
    let name = basename(file, '.js')
    let result = transform(dir+'/'+file, name)
    let m = dir.split('/')
    m = m[m.length-1]
    let f = file.replace(/\.js/,'')
    let n = f
    if (f == 'index') n = m
    n = 'global.W.' + m
    result.code = result.code.replace(`var mod = {
      exports: {}
    };`,`var mod = {
      exports: {}
    };\n    global = global || window;\n    global.W = global.W || {};\n    global.W.${m} = global.W.${m} || {};\n`).replace(new RegExp('global.' + f),n)
    // console.log(result.code)
    // 'global.W.'+file+'=global.W'
    save(resolve(__dirname, outPath, file)).write(result.code)
  })
})