import express from "express";
import * as tools from './tools.mjs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RC = await tools.constructSmartContract();

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, '..', 'css')));
app.use(cookieParser());

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'views'));

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.get('/', (req, res) => {
  res.render('addOwner');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/addBatch', (req, res) => {
  res.render('addBatch');
});

app.post('/processAddBatch', async (req, res) => {
  const details = req.body.details;
  const owner = req.cookies.address;

  try {

    const tx = await RC.addBatch(details, owner);
    console.log(tx);
    res.redirect('/index');
  } catch(error) {
    console.error('Error adding batch:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/updateState', (req, res) => {
  res.render('updateState');
});



app.post('/updateStateProcess', async (req, res) => {
  const batchId = req.body.batchId;
  const state = req.body.state;
  try {
    const tx = await RC.updateState(batchId, state);
    res.redirect('/index');
  } catch(error) {
    console.error('Error updating state:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/transferOwnership', (req, res) => {
  res.render('transferOwnership');
});

app.post('/transferOwnershipProcess', async (req, res) => {
  const batchId = req.body.batchId;
  const newOwner = req.body.newOwner;
  
  try {
    const tx = await RC.transferOwnership(batchId, newOwner);
    res.redirect('/index');
  } catch(error) {
    console.error('Error transfering ownership:', error);
    res.status(500).send('Internal Server Error');
  }
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

const stateEnum = ['Harvested', 'Processed', 'InTransit', 'InStore', 'Purchased'];

app.post('/getBatchDetailsProcess', async (req, res) => {
  const batchId = req.body.batchId;

  try {
    const details = await RC.getBatchDetails(batchId);
    const stateString = stateEnum[details[3]];

    // Replace the state integer with the state string
    const detailsWithStateString = [
      details[0], // id
      details[1], // details
      details[2], // owner
      stateString, // state
      details[4], // history
    ];

    res.render('batchDetails', { details: detailsWithStateString });
  } catch(error) {
    console.error('Error retrieving batch details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/addOwner', (req, res) => {
  res.render('addOwner');
});

app.post('/registration', async (req, res) => {
  const { name, occupation, addr, password } = req.body;

  try {
    const newOwner = await prisma.owner.create({
      data: {
        address: addr,
        password: password,
      }
    });

    let tx = await RC.addOwner(name, occupation, addr);
    console.log(tx);
    res.redirect('/login');
  } catch(error) {
    console.error('Error adding owner:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.post("/auth", async (request, response) => {
  const addr = request.body.address;
  const password = request.body.password;

  try {
    const owner = await prisma.owner.findUnique({
      where: {
        address: addr,
      },
    });

    if (owner && owner.password === password) {
      response.cookie("address", addr, { maxAge: 900000, httpOnly: true });
      response.redirect("/index");
    } else {
      response.redirect("/login");
    }
  } catch (error) {
    console.error("Error authenticating:", error);
  }
});



app.listen(3000, () => {
  console.log("I'm listening");
});
