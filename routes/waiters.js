'use strick'
const { Pool } = require('pg');
const WaiterService = require('../services/waiters-service');

module.exports = function (waitersService) {

    let waiter 

    async function defaultRoute (req, res){
        res.render('index',{
            waiter,
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