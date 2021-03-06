const assert = require('assert');
const pg = require('pg');
const WaiterService = require('../services/waiters-service');

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiter_test';

const pool = new pg.Pool({
  connectionString,
});

const waiters = WaiterService(pool);

// eslint-disable-next-line no-undef
beforeEach(async () => {
// clean the tables before each test run
  await waiters.deleteRecord();
});

// eslint-disable-next-line no-undef
describe('Waiter avalability', () => {
  // eslint-disable-next-line no-undef
  it('Should add waiter\' shifts', async () => {
    await waiters.deleteRecord();

    const days = [1, 2, 3];
    await waiters.selectDay({ name: 'Apiwe', day: days });

    assert.deepEqual([{ name: 'Apiwe', day: 'Sunday' }, { name: 'Apiwe', day: 'Monday' }, { name: 'Apiwe', day: 'Tuesday' }], await waiters.getWaiters());
  });
  // eslint-disable-next-line no-undef
  it('Should update waiter\' days if waiter changes shift(s)', async () => {
    await waiters.deleteRecord();
    // add name
    let days = [1, 2, 3];
    await waiters.selectDay({ name: 'Apiwe', day: days });
    days = [1, 2, 5];
    await waiters.selectDay({ name: 'Apiwe', day: days });
    assert.deepEqual([{ name: 'Apiwe', day: 'Sunday' }, { name: 'Apiwe', day: 'Monday' }, { name: 'Apiwe', day: 'Thursday' }], await waiters.getWaiters());
  });

  // eslint-disable-next-line no-undef
  it('Shoud return user id', async () => {
    await waiters.deleteRecord();
    const days = [1, 2, 3];
    await waiters.selectDay({ name: 'Apiwe', day: days });
    await waiters.selectDay({ name: 'Mandla', day: days });
    await waiters.selectDay({ name: 'Lwazi', day: days });

    assert.equal(1, await waiters.getUsersID('Apiwe'));
  });

  // eslint-disable-next-line no-undef
  it('update function help to update users', async () => {
    await waiters.deleteRecord();
    let days = [1, 2, 3];
    await waiters.selectDay({ name: 'Apiwe', day: days });
    await waiters.updateShieft(1);
    days = [1, 4, 5];
    await waiters.selectDay({ name: 'Apiwe', day: days });
    assert.deepEqual([
      {
        day: 'Sunday',
        name: 'Apiwe',
      },
      {
        day: 'Wednesday',
        name: 'Apiwe',
      },
      {
        day: 'Thursday',
        name: 'Apiwe',
      },
    ], await waiters.getWaiters());
  });
  // eslint-disable-next-line no-undef
  it('Should reset able to reset shifts', async () => {
    await waiters.deleteRecord();
    assert.deepEqual([], await waiters.getWaiters());
  });
  // eslint-disable-next-line no-undef
  it('Function return days', async () => {
    await waiters.deleteRecord();

    assert.deepEqual([
      {
        day: 'Sunday',
        id: 1,
      },
      {
        day: 'Monday',
        id: 2,
      },
      {
        day: 'Tuesday',
        id: 3,
      },
      {
        day: 'Wednesday',
        id: 4,
      },
      {
        day: 'Thursday',
        id: 5,
      },
      {
        day: 'Friday',
        id: 6,
      },
      {
        day: 'Saturday',
        id: 7,
      },
    ], await waiters.getDays());
  });

  // eslint-disable-next-line no-undef
  it('Should check if days which days are selected by logged waiter', async () => {
    await waiters.deleteRecord();
    let days = [1, 2, 3];
    await waiters.selectDay({ name: 'Apiwe', day: days });
    await waiters.selectDay({ name: 'Mandla', day: days });
    await waiters.selectDay({ name: 'Lwazi', day: days });
    days = [1, 2, 5];
    await waiters.selectDay({ name: 'Peter', day: days });
    await waiters.selectDay({ name: 'Zee', day: days });
    days = [3, 4, 5];
    await waiters.selectDay({ name: 'Lee', day: days });
    days = [2, 5, 6];
    await waiters.selectDay({ name: 'Vusi', day: days });
    days = [5, 6, 7];
    await waiters.selectDay({ name: 'Rosanne', day: days });

    assert.deepEqual([
      {
        day: 'Sunday',
        id: 1,
        selected: true,
      },
      {
        day: 'Monday',
        id: 2,
        selected: true,
      },
      {
        day: 'Tuesday',
        id: 3,
        selected: true,
      },
      {
        day: 'Wednesday',
        id: 4,
        selected: false,
      },
      {
        day: 'Thursday',
        id: 5,
        selected: false,
      },
      {
        day: 'Friday',
        id: 6,
        selected: false,
      },
      {
        day: 'Saturday',
        id: 7,
        selected: false,
      },
    ],
    await waiters.chechDays('Lwazi'));
  });
  // eslint-disable-next-line no-undef
  describe('Colors update on admin view', () => {
    // eslint-disable-next-line no-undef
    it('Should return green for days that have three waiters, yellow for days short with waiters/ have less than three waiters and red for days have more than three waiters', async () => {
      await waiters.deleteRecord();
      let days = [1, 2, 3];
      await waiters.selectDay({ name: 'Apiwe', day: days });
      await waiters.selectDay({ name: 'Mandla', day: days });
      await waiters.selectDay({ name: 'Lwazi', day: days });
      days = [1, 2, 5];
      await waiters.selectDay({ name: 'Peter', day: days });
      await waiters.selectDay({ name: 'Zee', day: days });
      days = [3, 4, 5];
      await waiters.selectDay({ name: 'Lee', day: days });
      days = [2, 5, 6];
      await waiters.selectDay({ name: 'Vusi', day: days });
      days = [5, 6, 7];
      await waiters.selectDay({ name: 'Rosanne', day: days });
      assert.deepEqual([
        {
          color: 'bg-danger',
          day: 'Sunday',
          id: 1,
        },
        {
          color: 'bg-danger',
          day: 'Monday',
          id: 2,
        },
        {
          color: 'bg-danger',
          day: 'Tuesday',
          id: 3,
        },
        {
          color: 'bg-warning',
          day: 'Wednesday',
          id: 4,
        },
        {
          color: 'bg-danger',
          day: 'Thursday',
          id: 5,
        },
        {
          color: 'bg-warning',
          day: 'Friday',
          id: 6,
        },
        {
          color: 'bg-warning',
          day: 'Saturday',
          id: 7,
        },
      ],
      await waiters.daysColor());
    });
  });
});
