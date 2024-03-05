// app.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');
const app = express();
// const router = express.Router();
var engines = require('consolidate');

const db = mysql.createConnection({
    host : '127.0.0.1',
    user: 'root',
    password : 'password',
    database : 'profiler'
});

db.connect(function (err) {
    if (err) throw err;
    console.log('connected');
});

module.exports = db;

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(path.join(__dirname, 'public'))));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext)); // + Date.now() + ext);
        },
    }),
});

app.engine('html', engines.mustache);
app.set('view engine', 'html');

//파일 업로드 및 디비에 위치 저장
app.post('/uploadFile', upload.single('attachment'), (req, res) => {
    // console.log(req.file)
    // console.log(req.file.originalname)

    console.log('시도')
    // 한 줄씩 읽어들이는 함수 정의
    function processFile(filename) {
        var instream = fs.createReadStream(filename);
        var reader = readline.createInterface(instream, null/*process.stdout*/);
       
        var count = 0;
        var pageNo = 0;
        var coreNo = 0;
       
        // 한 줄씩 읽어들인 후에 발생하는 이벤트
        reader.on('line', function(line) {
            if (line.indexOf("task1") !== -1 ) {
                pageNo += 1;
            }
       
            coreNo = 0;
            if (line.indexOf("core1") !== -1 ) coreNo = 1;
            if (line.indexOf("core2") !== -1 ) coreNo = 2;
            if (line.indexOf("core3") !== -1 ) coreNo = 3;
            if (line.indexOf("core4") !== -1 ) coreNo = 4;
            if (line.indexOf("core5") !== -1 ) coreNo = 5;
           
            if(coreNo > 0 && pageNo > 0) {
                //console.log(pageNo + ':' + coreNo);
                var tokens = line.split('\t');
                if (tokens != undefined && tokens.length > 0) {
                    for(var i=1; i<tokens.length-1; ++i) {
                        // console.log('Page' +pageNo+ ' : core' +coreNo+ ' : task' +i+ ' : score='+ tokens[i]);
                        sql = 'insert into t_score_board values(?,?,?,?)';
                        db.query(sql, [pageNo, coreNo, i, tokens[i]], function (err, rows) {
                        if(err)
                            console.log('query is not excuted. select fail...\n' + err);
                        //else res.render('list.ejs', {list : rows});
                        });
                    }
                }
            }
        });
       
        // 모두 읽어들였을 때 발생하는 이벤트
        reader.on('close', function(line) {
            console.log('파일을 모두 읽음.');
        });
    }
   
    // 함수 실행
    var filename = req.file.originalname;
    processFile(filename);

    // 쿼리문
    task_sql = `SELECT core,
                MIN(score) AS min,
                MAX(score) AS max,
                AVG(score) AS avg
            FROM t_score_board
            WHERE task = ?
            GROUP BY core`

    var taskId = 1

    db.query(task_sql, [taskId], function (err, rows) {
        if(err)
            console.log('query is not excuted. select fail...\n' + err);
        var taskMaxData = []
        var taskMinData = []
        var taskAvgData = []

        if(rows) {
            rows.forEach(function(val) {
                taskMaxData.push(val.max);
                taskMinData.push(val.min);
                taskAvgData.push(val.avg);
            });
        } else {
            taskMaxData.max="";
            taskMinData.max="";
            taskAvgData.max="";
        }
        res.render('graph', { taskMaxData, taskMinData, taskAvgData })
    })
    // res.sendFile(path.join(__dirname, '/views/graph.html'));
});

app.listen(app.get('port'), () => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // 2
    console.log(app.get('port'), '번 포트에서 대기 중');
})