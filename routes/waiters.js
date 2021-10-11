'use strick'
const { Pool } = require('pg');
const WaiterService = require('../services/waiters-service');

module.exports = function (waitersService) {

    let waiter
    let week = []
    let waiters = []


    async function defaultRoute(req, res) {
        week = await waitersService.getDays()
        res.render('index', {
            waiter,
            week
        })
    }

    async function waitersAvailable(req, res) {
        waiters = await waitersService.getWaiters()
        week = await waitersService.getDays()
        console.log(waiters)
        let sunday = []
        let monday = []
        let tuesday = []
        let wednesday = []
        let thursday = []
        let friday = []
        let saturday = []

        if (waiters.length !== 0) {
            for (var k = 0; k < waiters.length; k++) {

                    if (waiters[k].day === 'Sunday') {
                        sunday.push(waiters[k].name)
                    }
                    if (waiters[k].day === 'Monday') {
                        monday.push(waiters[k].name)
                    }
                    if (waiters[k].day === 'Tuesday') {
                        tuesday.push(waiters[k].name)
                    }
                    if (waiters[k].day === 'Wednesday') {
                        wednesday.push(waiters[k].name)
                    }
                    if (waiters[k].day === 'Thursday') {
                        thursday.push(waiters[k].name)
                    }
                    if (waiters[k].day === 'Friday') {
                        friday.push(waiters[k].name)
                    }
                    if (waiters[k].day === 'Saturday') {
                        saturday.push(waiters[k].name)
                    }
            }

            res.render('available-waiters', {
                sunday,monday, tuesday, wednesday, thursday, friday,saturday,
                week
            })
        }

        else if (waiters.length === 0){
            req.flash('error', "No waiters available, sorry!")
        }

        
    }

    async function subscribe(req, res) {
        var getName = req.body.name;
        var getDay = req.body.days;
        console.log(getDay)
        waiter = waitersService.selectDay({
            name: getName,
            day: getDay
        })

        res.redirect('/')
    };

    async function weeklyReset(req, res) {
        await waitersService.deleteRecord()
        req.flash('info', "Waiters's list has successfully resetted!")
        res.redirect('/')
    }

    return {
        subscribe,
        defaultRoute,
        waitersAvailable,
        weeklyReset
    }
}