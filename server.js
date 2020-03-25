const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const indexRoute = require('./routes/indexRoute');
const newsAndAppealsRoutes = require('./routes/newsAndAppealsRoutes');
const port = 3000;
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set static folder
app.use(express.static(path.join(__dirname, 'client')));
app.use(cors());

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

app.use('/', indexRoute);
app.use('/api', newsAndAppealsRoutes);

mongoose
  .connect(
    `mongodb+srv://User1:u3HqelSB7wICG2oj@appdatabase-8nene.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      dbName: 'appdatabase',
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('Database connection successful');
  })
  .catch(err => {
    console.error('Database connection error');
  });

app.listen(port, () => {
  console.log(`Connection established on port ${port}`);
});
