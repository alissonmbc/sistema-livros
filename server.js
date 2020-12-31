const express = require('express')
var cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;
const googleTrends = require('google-trends-api');

app.get('/', (req, res) => {
  res.json({});
})

app.get('/interestOverTime/:keyword', (req, res) => {
  googleTrends.interestOverTime({keyword: req.params.keyword, category: '22'})
  .then((data) => {
    res.json(JSON.parse(data));
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/interestByRegion/:keyword', (req, res) => {
  googleTrends.interestByRegion({keyword: req.params.keyword, category: '22'})
  .then((data) => {
    res.json(JSON.parse(data));
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/interestByRegion/:keyword', (req, res) => {
  googleTrends.interestByRegion({keyword: req.params.keyword, category: '22'})
  .then((data) => {
    res.json(JSON.parse(data));
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/relatedQueries/:keyword', (req, res) => {
  googleTrends.relatedQueries({keyword: req.params.keyword, category: '22'})
  .then((data) => {
    res.json(JSON.parse(data));
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/relatedTopics/:keyword', (req, res) => {
  googleTrends.relatedTopics({keyword: req.params.keyword, category: '22'})
  .then((data) => {
    res.json(JSON.parse(data));
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.listen(process.env.PORT || port, () => {
  console.log("Server started!!")	
});