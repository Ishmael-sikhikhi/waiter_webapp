'use strick'
const { Pool } = require('pg');
const WaiterService = require('../services/waiters-service');

module.exports = function (waitersService) {

    let waiter 
    let week = []
    let waiters = []

    async function defaultRoute (req, res){
        week = await waitersService.getDays()
        res.render('index',{
            waiter,
            week
        })
    }

    async function waitersAvailable(req, res){
        waiters = await waitersService.getWaiters()
        console.log(waiters)
        res.render('available-waiters', {
            waiters
        })
    }

    async function subscribe(req, res){
        var getName = req.body.name;
        var getDay = req.body.days;
        console.log(getDay)
        waiter = waitersService.selectDay({
            name: getName,
            day: getDay
        })

        res.redirect('/')
    };

    async function weeklyReset(req, res){
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