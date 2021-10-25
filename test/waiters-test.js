const assert = require('assert');
const WaiterService = require('../services/waiters-service');
const pg = require("pg");
const Pool = pg.Pool;


// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiter_test';

const pool = new Pool({
    connectionString
});

let waiters = WaiterService(pool)

beforeEach(async function () {
    // clean the tables before each test run
    await waiters.deleteRecord();

});

describe('Waiter avalability', ()=>{
    it('Should add waiters name and select day shift', async ()=>{
        await waiters.deleteRecord();

        assert.deepEqual([], await waiters.getWaiters())

    })
})