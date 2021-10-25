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

    // function owner(req, res) {
    //     res.render('available-waiters')
    // }

    async function waitersPage(req, res) {
        let username = req.params.username;
        const week = await waitersService.chechDays(username);
        console.log(week);
        res.render('waiter-log', {
            week, 
            username
        })
    }

    async function waitersAvailable(req, res) {
        waiters = await waitersService.getWaiters()
        // console.log(waiters)
        week = await waitersService.getDays()
        // console.log(waiters)
        let sunday = []
        let monday = []
        let tuesday = []
        let wednesday = []
        let thursday = []
        let friday = []
        let saturday = []

        var myClass = [{Class:'Sun'},{Class:'Mon'},{Class:'Tue'},{Class:'Wed'},{Class:'Thu'},{Class:'Fri'},{Class:'Sat'}]

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
        var username = req.params.username
        console.log("Waiter: " + username)
        var day = req.body.day;

        console.log("Selected days " + day)

        week = await waitersService.chechDays(username)

        let condition = pattern.test(username);

        if (condition === true) {
            if (username !== '' || username !== undefined) {
                waiter = waitersService.selectDay({
                    name: username,
                    day: day
                })
            }
        }
        else{
            req.flash('error', "This name cannot get days, please correct name");
        }

        res.render('waiter-log',{
            week, username
        });
    };    

    async function weeklyReset(req, res) {
        await waitersService.deleteRecord()
        req.flash('info', "Waiters's list has successfully resetted!")
        res.redirect('owner')
    }

    return {
        subscribe,
        defaultRoute,
        waitersAvailable,
        weeklyReset,
        waitersPage,
    }
}