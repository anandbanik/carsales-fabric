const Customer = require('../models').Customer

module.exports = {

    create(req,res){

        return Customer
        .create({
            name: req.body.name,
            phone: req.body.phone,
            ssn_number: req.body.ssn_number,
            address: req.body.address,
        })
        .then(customer => {
            console.log("Customer Added");
            res.status(201).send(customer)
        })
        .catch(error => res.status(400).send(error));
    },

    list(req,res){

        return Customer
        .all()
        .then(customer => res.status(200).send(customer))
        .catch(error => res.status(400).send(error));
    },

    retrieve(req,res) {

        return Customer
        .findById(req.params.id)
        .then(customer => {
            if(!customer) {

                return res.status(404).send({

                    message: 'Customer not found',
                });
            }
            return res.status(200).send(customer);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req,res){

        return Customer
        .findById(req.params.id)
        .then(customer => {

            if(!customer){
                return res.status(404).send({
                    message: 'Customer not found',
                });
        }
        return customer
        .update({
            name: req.body.name || customer.name,
            phone: req.body.phone || customer.phone,
            ssn_number: req.body.ssn_number || customer.ssn_number,
            address: req.body.address || customer.address,
        })
        .then(() => res.status(200).send(customer))
        .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error))


    },
};