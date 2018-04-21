var sequelize = require('sequelize');

const Negotiation = require('../models').Negotiation

module.exports = {

    create(req,res){

        return Negotiation
        /*
        .create({
            vin_number: req.body.vin_number,
            actual_price: req.body.actual_price,
            status: req.body.status,
            dealer_name: req.body.dealer_name,
            ssn_number: req.body.ssn_number,
            comments: req.body.comments,
        })
        */
        .upsert({
            vin_number: req.body.vin_number,
            actual_price: req.body.actual_price,
            status: req.body.status,
            dealer_name: req.body.dealer_name,
            ssn_number: req.body.ssn_number,
            comments: req.body.comments,
        })
        .then(negotiation => res.status(201).send(negotiation))
        .catch(error => res.status(400).send(error));
    },

    list(req,res){

        return Negotiation
        .all()
        .then(negotiation => res.status(200).send(negotiation))
        .catch(error => res.status(400).send(error));
    },

    retrieve(req,res) {

        return Negotiation
        .findById(req.params.id)
        .then(negotiation => {
            if(!negotiation) {

                return res.status(404).send({

                    message: 'Negotiation Application not found',
                });
            }
            return res.status(200).send(negotiation);
        })
        .catch(error => res.status(400).send(error));
    },

    retrieveByVin(req,res) {

        return Negotiation
        .findAll({
            where: {
                vin_number: req.body.vin_number,
                ssn_number: req.body.ssn_number
            },
            order: sequelize.literal('createdAt DESC')
            
        })
        .then(negotiation => {
            if(!negotiation) {

                return res.status(404).send({

                    message: 'Negotiation Application not found',
                });
            }
            return res.status(200).send(negotiation[0]);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req,res){

        return Negotiation
        .findAll({
            where: {
                vin_number: req.body.vin_number,
                ssn_number: req.body.ssn_number
            }
        })
        .then(negotiation => {
            
            if(!negotiation){
                return res.status(404).send({
                    message: 'Negotiation Application not found',
                });
        }
        return negotiation[0]
        .update({
            actual_price: req.body.actual_price || negotiation[0].actual_price,
            status: req.body.status || negotiation[0].status,
            dealer_name: req.body.dealer_name || negotiation[0].dealer_name,
            comments: negotiation[0].comments + "," + req.body.comments,
        })
        .then(() => res.status(200).send(negotiation[0]))
        .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error))


    },
};