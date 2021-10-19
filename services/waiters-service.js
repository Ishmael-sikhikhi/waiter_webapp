'use strict'
module.exports = function (pool) {
    var pattern = /^[A-Za-z]+$/

    async function selectDay(values) {
        var name = values.name;
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        var theDays = values.day;
        // var days = values.day
        var theDays = []
        theDays = values.day
        let condition = pattern.test(name);
        if (condition === true) {

            var users_id

            
            for (var i = 0; i < theDays.length; i++) {
                var theDay = theDays[i]

                var days_id = await getDaysID(theDay)
                var duplicates = await pool.query(`select name from users where name = $1`, [name]);
                if (duplicates.rowCount === 0) {

                    await pool.query(`insert into users (name) values ($1)`, [name]);
                    users_id = await getUsersID(name);
                    console.log(users_id);
                    await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, days_id])
                } else {
                    users_id = await getUsersID(name);

                    let checkOnUser_days = await pool.query(`SELECT * FROM user_days WHERE users_id = $1 AND days_id = $2`, [users_id, days_id]);
                    console.log(checkOnUser_days.rows)
                    if (checkOnUser_days.rowCount === 0) {
                        await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, days_id])
                    }
                }
            }
        }
    }

    async function updateShieft(values) {
        var theDays = values.day;
        var name = values.name;
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        await pool.query(`delete from user_days`)
        for (var i = 0; i < theDays.length; i++) {
            var theDay = theDays[i]

            var days_id = await getDaysID(theDay)
            var duplicates = await pool.query(`select name from users where name = $1`, [name]);
            if (duplicates.rowCount === 0) {

                await pool.query(`insert into users (name) values ($1)`, [name]);
                users_id = await getUsersID(name);
                await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, days_id])
            } else {
                users_id = await getUsersID(name);
                await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, days_id])
            }
        }
    };

    async function getDays() {
        let week = await pool.query(`select day from days`);
        return week.rows
    }

    async function getDaysID(days) {
        var id = ''
        var days = await pool.query(`select id from days where day = $1`, [days])
        days = days.rows
        id = days[0].id
        return Number(id)
    };

    async function getUsersID(users) {
        var id
        var waiter = await pool.query(`select id from users where name = $1`, [users])
        // console.log(waiter[0]);
        if (waiter.rowCount !== 0) {
            waiter = waiter.rows
            id = waiter[0].id
            return Number(id)
        }
    }

    async function getWaiters() {
        let waiters = await pool.query(`select users.name, days.day from user_days 
        inner join users 
        on user_days.users_id = users.id
        inner join days
        on user_days.days_id = days.id`)
        return waiters = waiters.rows

    }

    async function deleteRecord() {
        await pool.query(`delete from user_days`)
    };

    return {
        selectDay,
        updateShieft,
        getDaysID,
        getDays,
        getWaiters,
        deleteRecord,
        getUsersID
    }
}
