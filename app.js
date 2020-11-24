const express = require('express');
const cors = require('cors');

const app = express();
const Marksheet = require('./Model/marksheetModel');

//implementing CORS
//Access-control-Allow-Origin(Allowing Everyone to use our API)
app.use(cors());
// app.options('*', cors());

//body parse middleware
app.use(express.json({ limit: '10kb' }));

app.get('/api/getAll', async (req, res) => {
  try {
    const doc = await Marksheet.find();
    return res.status(200).json({
      status: 'success',
      result: doc.length,
      data: { doc },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

app.get('/api/getOne', async (req, res) => {
  try {
    let doc = await Marksheet.findById(req.params.id);
    if (!doc)
      return res.status(404).json({
        status: 'fail',
        message: 'Could not found record with id ' + req.params.id,
      });

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

app.post('/api/calculate', async function (req, res) {
  try {
    const subjects = req.body;
    if (
      subjects === null ||
      !Array.isArray(subjects) ||
      subjects.length === 0
    ) {
      return res.status(500).send('Please Provide All Required fields');
    }

    if (
      subjects.some(
        (x) =>
          !x.name ||
          !x.obtainedMarks ||
          x.obtainedMarks == null ||
          x.name == null
      )
    ) {
      return res.status(500).send('Please Provide All Required fields');
    }

    let totalMarks = 0;
    let minMarks = subjects[0].obtainedMarks;
    let maxMarks = subjects[0].obtainedMarks;
    let minSubject = subjects[0].name;
    let maxSubject = subjects[0].name;
    subjects.map((subject, i) => {
      totalMarks += subject.obtainedMarks;
      if (minMarks > subjects[i].obtainedMarks) {
        minMarks = subjects[i].obtainedMarks;
        minSubject = subjects[i].name;
      }

      if (maxMarks < subjects[i].obtainedMarks) {
        maxMarks = subjects[i].obtainedMarks;
        maxSubject = subjects[i].name;
      }
    });

    let percentage = (totalMarks / (subjects.length * 100)) * 100;

    let marksheetModel = new Marksheet();
    marksheetModel.totalMarks = totalMarks;
    marksheetModel.percentage = percentage;
    marksheetModel.subjects = subjects;
    marksheetModel.minMarks = minMarks;
    marksheetModel.minSubject = minSubject;
    marksheetModel.maxMarks = maxMarks;
    marksheetModel.maxSubject = maxSubject;

    const doc = await Marksheet.create(marksheetModel);
    return res.status(201).json({
      status: 'Successfully Submitted',
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
module.exports = app;
