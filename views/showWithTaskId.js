var db = require('../app.js');

task_sql = `SELECT core, 
                MIN(score) AS min, 
                MAX(score) AS max, 
                AVG(score) AS avg 
            FROM t_score_board
            WHERE task = ?
            GROUP BY core`

var taskId = 1

// 함수 만들어서 그 안에 db.query 넣고 값 리턴
const taskMaxCal = () => {
    db.query(task_sql, [taskId], function (err, rows) {
        if(err) 
            console.log('query is not excuted. select fail...\n' + err);
        var taskMaxData = []
        if(rows) {
            rows.forEach(function(val) {
                taskMaxData.push(val.max);
            });
        } else {
            //ladata.result="none";
            taskMaxData.max="";
        }
        return taskMaxData;
    });
};

const taskMinCal = () => {
    db.query(task_sql, [taskId], function (err, rows) {
        if(err) 
            console.log('query is not excuted. select fail...\n' + err);
        var taskMinData = []
        if(rows) {
            rows.forEach(function(val) {
                taskMinData.push(val.min);
            });
        } else {
            //ladata.result="none";
            taskMinData.min="";
        }
        return taskMinData;
    });
};

const taskAvgCal = () => {
    db.query(task_sql, [taskId], function (err, rows) {
        if(err) 
            console.log('query is not excuted. select fail...\n' + err);
        var taskAvgData = []
        if(rows) {
            rows.forEach(function(val) {
                taskAvgData.push(val.avg);
            });
        } else {
            //ladata.result="none";
            taskAvgData.avg="";
        }
        return taskAvgData;
    });
};
console.log(taskMaxCal, taskMinCal, taskAvgCal);
module.exports = { taskMaxCal };