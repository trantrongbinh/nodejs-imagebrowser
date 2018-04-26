const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var multer  =   require('multer');
var fs = require('fs')
var path = require('path')
var crypto = require('crypto');

var storage = multer.diskStorage({
  //folder upload -> public/upload
  destination: 'public/upload/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, Math.floor(Math.random()*9000000000) + 1000000000 + path.extname(file.originalname))
    })
  }
})
var upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  var title = "Plugin Imagebrowser ckeditor for nodejs"
  res.render('index', { result: 'result' })
})

//show all image in folder upload to json
app.get('/files', function (req, res) {
  const images = fs.readdirSync('public/upload')
  var sorted = []
  for (let item of images){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
          var abc = {
                "image" : "/upload/"+item,
                "folder" : '/'
          }
          sorted.push(abc)
      }
  }
  res.send(sorted);
})
//upload image to folder upload
app.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
    res.redirect('back')
});
//delete file
app.post('/delete_file', function(req, res, next){
  var url_del = 'public' + req.body.url_del
  console.log(url_del)
  if(fs.existsSync(url_del)){
    fs.unlinkSync(url_del)
  }
  res.redirect('back')
});


app.listen(8000, function () {
  console.log('App run on port 8000!')
})
