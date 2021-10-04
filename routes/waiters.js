'use strick'
const { Pool } = require('pg');
const WaiterService = require('../services/waiters-service');

module.exports = function (waitersService) {

    let waiter 
    let week = []

    async function defaultRoute (req, res){
        week = await waitersService.getDays()
        res.render('index',{
            waiter,
            week
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

    return {
        subscribe,
        defaultRoute
    }
}