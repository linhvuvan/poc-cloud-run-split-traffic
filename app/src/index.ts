import express from 'express';

const PORT = 3000;
const app = express();
const REVISION = 5;

app.get('/linhvuvan', (req, res) => {
  return res.status(200).json({
    hi: 'linhvuvan',
    revision: REVISION,
  });
});

app.get('/healthz', (req, res) => {
  return res.status(200).json({
    revision: REVISION,
  });
});

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
