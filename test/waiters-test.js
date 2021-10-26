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

describe('Waiter avalability', () => {
    it('Should add waiter\' shifts', async () => {
        await waiters.deleteRecord();
        //add name
        var days = [1, 2, 3]
        await waiters.selectDay({ name: 'Apiwe', day: days })

        assert.deepEqual([{ name: 'Apiwe', day: 'Sunday' }, { name: 'Apiwe', day: 'Monday' }, { name: 'Apiwe', day: 'Tuesday' }], await waiters.getWaiters())

    })
    it('Should update waiter\' days if waiter changes shift(s)', async () => {
        await waiters.deleteRecord();
        //add name
        var days = [1, 2, 3]
        await waiters.selectDay({ name: 'Apiwe', day: days })
        days = [1, 2, 5]
        await waiters.selectDay({ name: 'Apiwe', day: days })
        assert.deepEqual([{ name: 'Apiwe', day: 'Sunday' }, { name: 'Apiwe', day: 'Monday' }, { name: 'Apiwe', day: 'Thursday' }], await waiters.getWaiters())

    })
    it('test update function', async () => {
        await waiters.deleteRecord()
        var days = [1, 2, 3]
        await waiters.selectDay({ name: 'Apiwe', day: days })
        await waiters.selectDay({ name: 'Mandla', day: days })
        await waiters.selectDay({ name: 'Lwazi', day: days })

        await waiters.updateShieft(6)

        assert.deepEqual(
            [
                {
                  "day": "Sunday",
                 "name": "Apiwe"
                },
                {
                 "day": "Monday",
                 "name": "Apiwe"
                },
                {
                 "day": "Tuesday",
                  "name": "Apiwe"
                },
                {
                 "day": "Sunday",
                 "name": "Mandla"
                },
                {
                  "day": "Monday",
                  "name": "Mandla"
                },
                {
                 "day": "Tuesday",
                 "name": "Mandla"
                },
                {
                 "day": "Sunday",
                  "name": "Lwazi"
                },
                {
                 "day": "Monday",
                 "name": "Lwazi"
                },
                {
                  "day": "Tuesday",
                 "name": "Lwazi"
                }
              ],
            await waiters.getWaiters())

    })
    it('Shoud return user id', async () => {
        await waiters.deleteRecord()
        var days = [1, 2, 3]
        await waiters.selectDay({ name: 'Apiwe', day: days })
        await waiters.selectDay({ name: 'Mandla', day: days })
        await waiters.selectDay({ name: 'Lwazi', day: days })

        assert.equal(1, await waiters.getUsersID("Apiwe"))

    })
    it('Should reset able to reset shifts', async () => {
        await waiters.deleteRecord();
        assert.deepEqual([], await waiters.getWaiters())

    })
    it('Function return days', async () => {
        await waiters.deleteRecord()

        assert.deepEqual([
            {
                day: 'Sunday',
                id: 1
            },
            {
                day: 'Monday',
                id: 2
            },
            {
                day: 'Tuesday',
                id: 3
            },
            {
                day: 'Wednesday',
                id: 4
            },
            {
                day: 'Thursday',
                id: 5
            },
            {
                day: 'Friday',
                id: 6
            },
            {
                day: 'Saturday',
                id: 7
            }
        ], await waiters.getDays())

    })

    it('Should check if days which days are selected by logged waiter',async () => {

        await waiters.deleteRecord()
        var days = [1, 2, 3]
        await waiters.selectDay({ name: 'Apiwe', day: days })
        await waiters.selectDay({ name: 'Mandla', day: days })
        await waiters.selectDay({ name: 'Lwazi', day: days })
        days = [1, 2, 5]
        await waiters.selectDay({ name: 'Peter', day: days })
        await waiters.selectDay({ name: 'Zee', day: days })
        days[3, 4, 5]
        await waiters.selectDay({ name: 'Lee', day: days })
        days = [2, 5, 6]
        await waiters.selectDay({ name: 'Vusi', day: days })
        days = [5, 6, 7]
        await waiters.selectDay({ name: 'Rosanne', day: days })

        assert.deepEqual([
            {
              day: 'Sunday',
              id: 1,
              selected: true
            },
            {
              day: 'Monday',
              id: 2,
              selected: true
            },
            {
              day: 'Tuesday',
              id: 3,
              selected: true
            },
            {
              day: 'Wednesday',
              id: 4,
              selected: false
            },
            {
              day: 'Thursday',
              id: 5,
              selected: false
            },
            {
              day: 'Friday',
              id: 6,
              selected: false
            },
            {
              day: 'Saturday',
              id: 7,
              selected: false
            }
          ]
          , await waiters.chechDays("Lwazi"))

    })

    describe('Colors update on admin view', () => {
        it('Should return green for days that have three waiters, yellow for days short with waiters/ have less than three waiters and red for days have more than three waiters', async () => {
            await waiters.deleteRecord()
            var days = [1, 2, 3]
            await waiters.selectDay({ name: 'Apiwe', day: days })
            await waiters.selectDay({ name: 'Mandla', day: days })
            await waiters.selectDay({ name: 'Lwazi', day: days })
            days = [1, 2, 5]
            await waiters.selectDay({ name: 'Peter', day: days })
            await waiters.selectDay({ name: 'Zee', day: days })
            days[3, 4, 5]
            await waiters.selectDay({ name: 'Lee', day: days })
            days = [2, 5, 6]
            await waiters.selectDay({ name: 'Vusi', day: days })
            days = [5, 6, 7]
            await waiters.selectDay({ name: 'Rosanne', day: days })
            assert.deepEqual([
                {
                    color: 'bg-danger',
                    day: 'Sunday',
                    id: 1
                },
                {
                    color: 'bg-danger',
                    day: 'Monday',
                    id: 2
                },
                {
                    color: 'bg-success',
                    day: 'Tuesday',
                    id: 3
                },
                {
                    color: 'bg-warning',
                    day: 'Wednesday',
                    id: 4
                },
                {
                    color: 'bg-danger',
                    day: 'Thursday',
                    id: 5
                },
                {
                    color: 'bg-warning',
                    day: 'Friday',
                    id: 6
                },
                {
                    color: 'bg-warning',
                    day: 'Saturday',
                    id: 7
                }
            ]
                , await waiters.daysColor())
        })

    })

})