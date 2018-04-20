const Insurance = require('../models').Insurance

module.exports = {

    create(req,res){

        return Insurance
        /*
        .create({
            customer_id: req.body.customer_id,
            vin_number: req.body.vin_number,
            coverage: req.body.coverage,
            status: req.body.status,
            monthly_cost: req.body.monthly_cost,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        })
        */
        .upsert({
            customer_id: req.body.customer_id,
            vin_number: req.body.vin_number,
            coverage: req.body.coverage,
            status: req.body.status,
            monthly_cost: req.body.monthly_cost,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            ssn_number: req.body.ssn_number,
        })
        .then(insurance => res.status(201).send(insurance))
        .catch(error => res.status(400).send(error));
    },

    list(req,res){

        return Insurance
        .all()
        .then(insurance => res.status(200).send(insurance))
        .catch(error => res.status(400).send(error));
    },
    /*
    retrieve(req,res) {

        return Insurance
        .findById(req.params.id)
        .then(insurance => {
            if(!insurance) {

                return res.status(404).send({

                    message: 'Insurance Application not found',
                });
            }
            return res.status(200).send(insurance);
        })
        .catch(error => res.status(400).send(error));
    },
    */
    retriveByVinAndSsn(req,res){
        return Insurance
        .findAll({
            where:{
                vin_number: req.body.vin_number,
                ssn_number: req.body.ssn_number
            }
        })
        .then(insurance => {
            if(!insurance) {

                return res.status(404).send({

                    message: 'Insurance Application not found',
                });
            }
            return res.status(200).send(insurance);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req,res){

        return Insurance
        .findById(req.params.id)
        .then(insurance => {

            if(!insurance){
                return res.status(404).send({
                    message: 'Loan Application not found',
                });
        }
        return insurance
        .update({
            customer_id: req.body.customer_id || insurance.customer_id,
            vin_number: req.body.vin_number || insurance.vin_number,
            coverage: req.body.coverage || insurance.coverage,
            status: req.body.status || insurance.status,
            monthly_cost: req.body.monthly_cost || insurance.monthly_cost,
            start_date: req.body.start_date || insurance.start_date,
            end_date: req.body.end_date || insurance.end_date,
        })
        .then(() => res.status(200).send(insurance))
        .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error))


    },
};