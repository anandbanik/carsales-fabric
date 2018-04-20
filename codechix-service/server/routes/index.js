const customerController = require('../controllers').customer;
const vehicleController = require('../controllers').vehicle;
const loanController = require('../controllers').loan;
const insuranceController = require('../controllers').insurance;
const registrationController = require('../controllers').registration;
const negotiationController = require('../controllers').negotiation;

module.exports = (app) => {

    app.get('/api',(req,res) => res.status(200).send({

        message: 'Welcome to Car Loan Management API!',
    }));

    app.post('/api/customer', customerController.create);
    app.get('/api/customer', customerController.list);
    app.get('/api/customer/:id', customerController.retrieve);
    app.put('/api/customer/:id', customerController.update); 

    app.post('/api/vehicle', vehicleController.create);
    app.get('/api/vehicle', vehicleController.list);
    app.get('/api/vehicle/:id', vehicleController.retrieve);
    app.put('/api/vehicle/:id', vehicleController.update); 


    app.post('/api/loan', loanController.create);
    app.get('/api/loan', loanController.list);
    /*app.get('/api/loan/:id',loanController.retrieve);
    app.put('/api/loan/:id', loanController.update);*/
    app.post('/api/get/loan/', loanController.retrieveByVinAndSsn)

    app.post('/api/insurance', insuranceController.create);
    app.get('/api/insurance', insuranceController.list);
    //app.get('/api/insurance/:id',insuranceController.retrieve);
    app.post('/api/get/insurance', insuranceController.retriveByVinAndSsn)
    app.put('/api/insurance/:id', insuranceController.update);


    app.post('/api/registration', registrationController.create);
    app.get('/api/registration', registrationController.list);
    app.get('/api/registration/:id', registrationController.retrieve);
    app.put('/api/registration/:id', registrationController.update);

    app.post('/api/negotiation', negotiationController.create);
    app.get('/api/negotiation', negotiationController.list);
    app.get('/api/negotiation/:id', negotiationController.retrieve);
    app.put('/api/negotiation/update', negotiationController.update);
    app.post('/api/negotiation/vin', negotiationController.retrieveByVin);
}