import express from 'express';
import routes from './routes/index';

const app = express();
const port = process.env.NODE_ENV === 'test' ? 3001 : 3000;

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

export default app;
