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

        if (waiters.length === 0) {
            req.flash('errorAvailable', "No waiters available, sorry!")
        }

        else {
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

        }

        res.render('available-waiters', {
            sunday, monday, tuesday, wednesday, thursday, friday, saturday,
            week
        })

    }

    async function subscribe(req, res) {
        var pattern = /^[A-Za-z]+$/

        var getName = req.body.name;
        var getDay = req.body.days;

        let condition = pattern.test(getName);

        if (condition === true) {
            if (getName !== '' || getName !== undefined) {
                waiter = waitersService.selectDay({
                    name: getName,
                    day: getDay
                })
            }

        }
        else {
            req.flash('error', "Please enter name or correct name")
        }

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