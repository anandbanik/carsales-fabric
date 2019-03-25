const Registration = require('../models').Registration

module.exports = {

    create(req,res){

        return Registration
        /*
        .create({
            customer_id: req.body.customer_id,
            vin_number: req.body.vin_number,
            tag_id: req.body.tag_id,
            status: req.body.status,
            insurance_id: req.body.insurance_id,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        })
        */
        .upsert({
            customer_id: req.body.customer_id,
            vin_number: req.body.vin_number,
            tag_id: req.body.tag_id,
            status: req.body.status,
            ssn_number: req.body.ssn_number,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        })
        .then(registration => res.status(201).send(registration))
        .catch(error => res.status(400).send(error));
    },

    list(req,res){

        return Registration
        .all()
        .then(registration => res.status(200).send(registration))
        .catch(error => res.status(400).send(error));
    },

    retrieve(req,res) {

        return Registration
        .findById(req.params.id)
        .then(registration => {
            if(!registration) {

                return res.status(404).send({

                    message: 'Registration Application not found',
                });
            }
            return res.status(200).send(registration);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req,res){

        return Registration
        .findById(req.params.id)
        .then(registration => {

            if(!registration){
                return res.status(404).send({
                    message: 'Registration Application not found',
                });
        }
        return registration
        .update({
            customer_id: req.body.customer_id || registration.customer_id,
            vin_number: req.body.vin_number || registration.vin_number,
            tag_id: req.body.tag_id || registration.tag_id,
            status: req.body.status || registration.status,
            insurance_id: req.body.insurance_id || registration.insurance_id,
            start_date: req.body.start_date || registration.start_date,
            end_date: req.body.end_date || registration.end_date,
        })
        .then(() => res.status(200).send(registration))
        .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error))


    },
};