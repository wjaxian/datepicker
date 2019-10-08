
var fs = require('fs');
var save = require('file-save');
var resolve = require('path').resolve;
var basename = require('path').basename;
var localePath = resolve(__dirname, '../src/')
var fileList = fs.readdirSync(localePath)

var transform = function(filename, name) {
  return require('babel-core').transformFileSync(filename, {
    plugins: [
      'transform-es2015-modules-umd'
      // 'add-module-exports',
      // ['transform-es2015-modules-umd']
      //, {loose: true}
    ],
    moduleId: name
  })
}

var dir = []
var trans = function (arr, n) {
  n = n || ''
  arr.filter(function (file) {
    return file !== '.DS_Store'
  }).forEach(function(file) {
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

dir.forEach(function (item) {
  var dir = item.dir
  var outPath = '../dist/lib/umd/' + item.outPath
  fs.readdirSync(dir).filter(function(file) {
    return /\.js$/.test(file)
  }).forEach(function(file) {
    var name = basename(file, '.js')
    var result = transform(dir+'/'+file, name)
    var m = dir.split('/')
    m = m[m.length-1]
    var f = file.replace(/\.js/,'')
    var n = f
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