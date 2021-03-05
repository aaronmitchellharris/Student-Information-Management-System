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
    var context = {};
    pool.query("SELECT * FROM departments",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = rows
        res.render('students', context);
    });
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
    }  else if (req.body.task == 'list'){
        pool.query("SELECT DISTINCT department_code FROM departments",
            [req.body.department], function(err, rows, result){
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
        
        pool.query("SELECT * FROM departments",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.departments = rows
        res.render('students_update', context);
    });
        
    });
});

app.post('/students/update', function(req,res,next){
    var context = {}
    pool.query("UPDATE students SET department_code = ?, first_name = ?, last_name = ?, expected_graduation_date = ?, major = ?, units_in_progress = ?, units_completed = ? WHERE student_id = ?", 
    [req.body.department, req.body.fname, req.body.lname, req.body.egdate, req.body.major, req.body.unitsProgress, req.body.unitsCompleted, req.body.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        res.type('text/plain');
        res.send(context);
    });
});

app.get('/courses', function(req,res){
    var context = {};
    pool.query("SELECT * FROM departments",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = rows
        pool.query("SELECT * FROM instructors",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.instructors = rows
        res.render('courses', context);
    });
    });
});

app.post('/courses', function(req,res,next){
    var context = {}
    if (req.body.task == 'insert'){
        pool.query("INSERT INTO courses (instructor_id, department_code, name, units) VALUES (?, ?, ?, ?)",
            [req.body.instructor, req.body.department, req.body.name, req.body.units], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
        pool.query("UPDATE departments SET course_count = (SELECT COUNT(course_id) FROM courses WHERE department_code = ?) WHERE department_code = ?",
            [req.body.department, req.body.department], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
        
    } else if (req.body.task == 'delete'){
        pool.query("DELETE FROM courses WHERE course_id = ?", [req.body.id], function(err, result){
            if(err){
                next(err);
                return;
            }
        });
    }

    pool.query("SELECT CONCAT(instructors.first_name, ' ', instructors.last_name) as instructor_id, courses.department_code, courses.name, courses.units, courses.course_id FROM courses INNER JOIN instructors ON courses.instructor_id = instructors.instructor_id", [req.body.id], function(err, rows, fields){
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
    var context = {};
    pool.query("SELECT * FROM departments",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = rows
        res.render('instructors', context);
    });
});

app.post('/instructors', function(req,res,next){
    var context = {}
    if (req.body.task == 'insert'){
        pool.query("INSERT INTO instructors (department_code, first_name, last_name) VALUES (?, ?, ?)",
            [req.body.department, req.body.fname, req.body.lname], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
        pool.query("UPDATE departments SET instructor_count = (SELECT COUNT(instructor_id) FROM instructors WHERE department_code = ?) WHERE department_code = ?",
            [req.body.department, req.body.department], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
        
    } else if (req.body.task == 'delete'){
        pool.query("DELETE FROM instructors WHERE instructor_id = ?", [req.body.id], function(err, result){
            if(err){
                next(err);
                return;
            }
        });
    }

    pool.query("SELECT * FROM instructors", [req.body.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.type('text/plain');
        res.send(context);
    });

});

app.get('/departments', function(req,res){
    res.render('departments')
});

app.post('/departments', function(req,res,next){
    var context = {}
    if (req.body.task == 'insert'){
        pool.query("INSERT INTO departments (department_code, name, instructor_count, course_count) VALUES (?, ?, 0, 0)",
            [req.body.department, req.body.name], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
        
    }

    pool.query("SELECT * FROM departments", [req.body.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.type('text/plain');
        res.send(context);
    });

});

app.get('/students_courses', function(req,res){
    var context = {}
    pool.query("SELECT * FROM students",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.students = rows
        pool.query("SELECT * FROM courses",
        [req.query], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.courses = rows
        res.render('students_courses', context);
        });
    });
});

app.post('/students_courses', function(req,res,next){
    var context = {}
    if (req.body.task == 'insert'){
        pool.query("INSERT INTO students_courses (student_id, course_id, grade) VALUES (?, ?, 'In Progress')",
            [req.body.sid, req.body.cid], function(err, result){
                if(err){
                    next(err);
                    return;
                }
        });
        
    } else if (req.body.task == 'delete'){
        pool.query("DELETE FROM students_courses WHERE student_id = ? AND course_id = ?", [req.body.sid, req.body.cid], function(err, result){
            if(err){
                next(err);
                return;
            }
        });
    }
    pool.query("SELECT * FROM students_courses", [req.body.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.type('text/plain');
        res.send(context);
    });

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