const express = require('express');
const app = express();

app.use(express.json());

let courses = [
    { id: 1, name: 'java' },
    { id: 2, name: 'javascript' },
    { id: 3, name: 'python' },
]

app.get('/courses', (req, res) => {
    res.json(courses);
});

app.listen(3000,() => console.log('Listening on port 3000...'));

app.post('/courses', (req, res) => {
    let course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.json(course);
});

app.put('/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    course.name = req.body.name;
    res.json(course);
});

app.delete('/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    let index = courses.indexOf(course);
    courses.splice(index, 1);

    res.json(course);
});