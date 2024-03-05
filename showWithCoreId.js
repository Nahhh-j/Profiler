// showWithTaskId.js 파일처럼 고쳐야됨

var db = require('./app.js');

sql = `SELECT task, 
              MIN(score) AS min, 
              MAX(score) AS max, 
              AVG(score) AS avg 
       FROM t_score_board
       WHERE core = ?
       GROUP BY task`

var coreId = 1
db.query(sql, [coreId], function (err, rows) {
    if(err) 
        console.log('query is not excuted. select fail...\n' + err);
    //else res.render('list.ejs', {list : rows});
    console.log(rows);
});