import express from 'express';

const PORT = 3000;
const app = express();
const REVISION = 11;

let status = 'NOT_READY';

setTimeout(() => {
  status = 'READY';
  console.log('START SERVING TRAFFIC');
}, 240 * 1000);

app.get('/linhvuvan', (req, res) => {
  return res.status(200).json({
    hi: 'linhvuvan',
    revision: REVISION,
    status,
  });
});

app.get('/healthz', (req, res) => {
  console.log('healthz is called');

  if (status === 'NOT_READY') {
    return res.status(400).json({
      revision: REVISION,
      status,
    });
  }

  return res.status(200).json({
    revision: REVISION,
    status,
  });
});

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
