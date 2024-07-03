const express = require('express');
const app = express();
const os = require('os');
const fs = require('fs');
const requestIp = require('request-ip');
const { format } = require('date-fns');
const path = require('path');

const COURSES_FILE = path.join(__dirname, 'courses.txt');

app.use(express.json());
app.use(middleWare);
app.use(logger);

function readCoursesFromFile() {
    try {
        const data = fs.readFileSync(COURSES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading courses file:', err);
        return [];
    }
}

function writeCoursesToFile(courses) {
    try {
        fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing to courses file:', err);
    }
}

app.get('/courses', (req, res) => {
    const courses = readCoursesFromFile();
    res.json(courses);
});

app.post('/courses', (req, res) => {
    const courses = readCoursesFromFile();
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    writeCoursesToFile(courses);
    res.json(course);
});

app.put('/courses/:id', (req, res) => {
    const courses = readCoursesFromFile();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    course.name = req.body.name;
    writeCoursesToFile(courses);
    res.json(course);
});

app.delete('/courses/:id', (req, res) => {
    const courses = readCoursesFromFile();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    writeCoursesToFile(courses);

    res.json(course);
});

function middleWare(req, res, next) {
    console.log('server started');
    next();
}

function getIpAddress(req) {
    return requestIp.getClientIp(req) || '127.0.0.1';
}

function logger(req, res, next) {
    const method = req.method;
    const ip = getIpAddress(req);
    const hostname = os.hostname();
    const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    console.log({
        method,
        ip,
        hostname,
        date
    });

    next();
}

app.listen(3000, () => console.log('Listening on port 3000...'));