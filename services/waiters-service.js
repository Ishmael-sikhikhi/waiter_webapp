module.exports = function (pool) {
    var pattern = /^[A-Za-z]+$/
    async function selectDay(values) {
        var name = values.name;
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        var theDay = values.day;
        let condition = pattern.test(name);
        if (condition === true){
            var days_id = await getDaysID(theDay)
            var duplicates = await pool.query(`select name from users where name = $1`, [name]);
            if (duplicates.rowCount === 0){
                await pool.query(`insert into users (name) values ($1)`,[name]);
                var users_id = await getUsersID(name);   
                console.log(users_id);
                await pool.query(`insert into user_days (users_id, days_id) values ($1,$2)`, [users_id, days_id])           
            } 

        }
    };

    async function updateShieft(values) {

    };

    async function getDays(){
        let week = await pool.query(`select day from days`);
        return week.rows
    }

    async function getDaysID(days){
        var id = ''
        var days = await pool.query(`select id from days where day = $1`, [days])
        days = days.rows
        id = days[0].id
        return Number(id)        
    };

    async function getUsersID(users){
        var id 
        var user_s = await pool.query(`select id from users where name = $1`, [users])
        // console.log(user_s[0]);
        user_s = user_s.rows
        id = user_s[0].id
        return Number(id)  
    }

    async function getWaiters(){
        let waiters = await pool.query(`select name from users`)
        return waiters.rows
    }

    

    async function deleteRecord() {
        await pool.query(`delete from users`)
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
