'use strict'
module.exports = function (pool) {
    var pattern = /^[A-Za-z]+$/

    async function selectDay(values) {

        var name = values.name;
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        var theDays = values.day;
       
        var theDays = []
        theDays = values.day
        let condition = pattern.test(name);
        if (condition === true) {
            var duplicates = await pool.query(`select name from users where name = $1`, [name]);
            
            var users_id = await getUsersID(name);  
            await updateShieft(users_id);  
                    
            for (var i = 0; i < theDays.length; i++) {
                var theDay = theDays[i]
                if (duplicates.rowCount === 0) {

                    await pool.query(`insert into users (name) values ($1)`, [name]);
                    users_id = await getUsersID(name);
                    await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, theDay])
                } else {
                    
                    let checkOnUser_days = await pool.query(`SELECT * FROM user_days WHERE users_id = $1 AND days_id = $2`, [users_id, theDay]);
                    console.log(checkOnUser_days.rows)
                    if (checkOnUser_days.rowCount === 0) {
                        await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, theDay])
                    }
                }
            }
        }       
    }

    async function chechDays(waiterName) {
        var days = await getDays();
        waiterName = waiterName.charAt(0).toUpperCase() + waiterName.slice(1).toLowerCase();
        console.log(waiterName);


        var user_id = await getUsersID(waiterName);

        console.log(user_id);

        
        const findShiftId = `select count(*) as day_count from user_days where users_id = $1 and days_id = $2`;

        for(var i = 0; i < days.length; i++){
            
            const currentDay = days[i];

            // is there a shift for the current day...

            var result = await pool.query(findShiftId, [user_id, currentDay.id])
            const dayCount =result.rows[0].day_count;

            if (dayCount > 0) {
                currentDay.selected = true;
            } else {
                currentDay.selected = false;
            }
        }

        return days;
    }

    async function updateShieft(values) {
        await pool.query(`delete from user_days where users_id = $1`, [values])
    };

    async function getDays() {
        let week = await pool.query(`select id, day from days`);
        return week.rows
    }    

    async function getUsersID(users) {
        var id
        var waiter = await pool.query(`select id from users where name = $1`, [users])
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
        getDays,
        getWaiters,
        deleteRecord,
        getUsersID,
        chechDays
    }
}
