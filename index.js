'use strick';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const pg = require('pg');
const Waiter = require('./routes/waiters');

const WaitersService = require('./services/waiters-service');

const { Pool } = pg;
const app = express();

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const waitersService = WaitersService(pool);

const waiterRoute = Waiter(waitersService);

// initialise session middleware - flash-express depends on it
app.use(session({
  secret: 'this is my long String that is used for session in http',
  resave: false,
  saveUninitialized: true,
}));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// initialise the flash middleware
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/jsongreetInstance
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', waiterRoute.defaultRoute);
app.get('/waiters/:username', waiterRoute.waitersPage);
app.post('/waiters/:username', waiterRoute.subscribe);
app.get('/owner', waiterRoute.waitersAvailable);
app.get('/reset', waiterRoute.weeklyReset);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App started at port:${PORT}`);
});
