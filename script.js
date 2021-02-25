var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_harriaar',
    password        : '5513',
    database        : 'cs340_harriaar'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.get('/', function(req,res){
    res.render('home')
});

app.get('/students', function(req,res){
    res.render('students');
});

app.post('/students', function(req,res,next){
    var context = {}
    if (req.body.task == 'insert'){
        pool.query("INSERT INTO students (department_code, first_name, last_name, expected_graduation_date, major, units_in_progress, units_completed) VALUES (?,?,?,?,?,?,?)",
            [req.body.department, req.body.fname, req.body.lname, req.body.egdate, req.body.major, req.body.unitsProgress, req.body.unitsCompleted], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
    }

    if (req.body.task == 'search'){
        var searchQuery = "SELECT student_id, department_code, first_name, last_name, FORMAT(expected_graduation_date, 'd', 'en-US') as expected_graduation_date, major, units_in_progress, units_completed FROM students \
        WHERE";
        var needed = []
        var first = 0
        if (req.body.fname != ''){
            if (first != 0){
                searchQuery = searchQuery + ' AND '
            }
            searchQuery = searchQuery + ' first_name = ?'
            needed.push(req.body.fname)
            first += 1
        }
        if (req.body.lname != ''){
            if (first != 0){
                searchQuery = searchQuery + ' AND '
            }
            searchQuery = searchQuery + ' last_name = ?'
            needed.push(req.body.lname)
            first += 1
        }
        if (req.body.department != ''){
            if (first != 0){
                searchQuery = searchQuery + ' AND '
            }
            searchQuery = searchQuery + ' department_code = ?'
            needed.push(req.body.department)
            first += 1
        }
        if (req.body.major != ''){
            if (first != 0){
                searchQuery = searchQuery + ' AND '
            }
            searchQuery = searchQuery + ' major = ?'
            needed.push(req.body.major)
        }

        pool.query(searchQuery, needed, function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.type('text/plain');
            res.send(context);
        });
    } else {
        pool.query("SELECT student_id, department_code, first_name, last_name, FORMAT(expected_graduation_date, 'd', 'en-US') as expected_graduation_date, major, units_in_progress, units_completed FROM students", [req.body.id], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.type('text/plain');
            res.send(context);
        });
    }
});

app.get('/students/update', function(req,res){
    var context = {}
    pool.query("SELECT student_id, department_code, first_name, last_name, FORMAT(expected_graduation_date, 'd', 'en-US') as expected_graduation_date, major, units_in_progress, units_completed FROM students WHERE student_id = ?", [req.query.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = rows;

        var date = context.results[0]['expected_graduation_date']
        date = date.charAt(0)+date.charAt(1)+date.charAt(3)+date.charAt(4)+"-"+date.charAt(5)+date.charAt(7)+"-"+date.charAt(8)+date.charAt(9)
        context.results[0]['expected_graduation_date'] = date

        res.render('students_update', context);
    });
});

app.post('/students/update', function(req,res,next){
    pool.query("SELECT * FROM students WHERE student_id = ?", [req.body.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.type('text/plain');
        res.send(context);
    });
});

app.get('/instructors', function(req,res){
    res.render('instructors')
});

app.get('/courses', function(req,res){
    res.render('courses')
});

app.get('/departments', function(req,res){
    res.render('departments')
});

app.get('/students_courses', function(req,res){
    res.render('students_courses')
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});