import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import scoreRouter from './routes/users';
import authRouter from './routes/Authorization';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/score', scoreRouter);
app.use('/login', authRouter);

app.get('/', (req, res) => {
  res.send('Welcome to server');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
    statusCode: 404
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
    statusCode: 500,
    message: err.message,
    stack: err.stack
  })
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
