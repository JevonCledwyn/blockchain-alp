import express from "express";
import * as tools from './tools.mjs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RC = await tools.constructSmartContract();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, '..', 'css')));
app.use(cookieParser());

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'views'));

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/addBatch', (req, res) => {
  res.render('addBatch');
});

app.post('/addBatch', async (req, res) => {
  const details = req.body.details;
  const owner = req.body.owner;
  const tx = await RC.addBatch(details, owner);
  await tx.wait();
  res.redirect('/');
});

app.get('/updateState', (req, res) => {
  res.render('updateState');
});

app.post('/updateState', async (req, res) => {
  const batchId = req.body.batchId;
  const state = req.body.state;
  const tx = await RC.updateState(batchId, state);
  await tx.wait();
  res.redirect('/');
});

app.get('/transferOwnership', (req, res) => {
  res.render('transferOwnership');
});

app.post('/transferOwnership', async (req, res) => {
  const batchId = req.body.batchId;
  const newOwner = req.body.newOwner;
  const tx = await RC.transferOwnership(batchId, newOwner);
  await tx.wait();
  res.redirect('/');
});

app.get('/getBatchHistory', (req, res) => {
  res.render('getBatchHistory');
});

app.post('/getBatchHistory', async (req, res) => {
  const batchId = req.body.batchId;
  const history = await RC.getBatchHistory(batchId);
  res.render('getBatchHistory', { history });
});

app.get('/getBatchDetails', (req, res) => {
  res.render('getBatchDetails');
});

app.post('/getBatchDetails', async (req, res) => {
  const batchId = req.body.batchId;
  const details = await RC.getBatchDetails(batchId);
  res.render('getBatchDetails', { details });
});

app.get('/addOwner', (req, res) => {
  res.render('addOwner');
});

app.post('/addOwner', async (req, res) => {
  const name = req.body.name;
  const occupation = req.body.occupation;
  const addr = req.body.addr;
  const tx = await RC.addOwner(name, occupation, addr);
  await tx.wait();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log("I'm listening");
});
