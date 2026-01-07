import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
