const Loan = require('../models').Loan

module.exports = {

    create(req,res){

        return Loan
        /*.create({
            customer_id: req.body.customer_id,
            vin_number: req.body.vin_number,
            amount: req.body.amount,
            status: req.body.status,
            loan_period_months: req.body.loan_period_months,
            apr: req.body.apr,
            ssn_number: req.body.ssn_number,
            monthly_payment: req.body.monthly_payment,
        })*/
        .upsert({
            customer_id: req.body.customer_id,
            vin_number: req.body.vin_number,
            amount: req.body.amount,
            status: req.body.status,
            loan_period_months: req.body.loan_period_months,
            apr: req.body.apr,
            ssn_number: req.body.ssn_number,
            monthly_payment: req.body.monthly_payment,
        })
        .then(loan => res.status(201).send(loan))
        .catch(error => res.status(400).send(error));
    },

    list(req,res){

        return Loan
        .all()
        .then(loan => res.status(200).send(loan))
        .catch(error => res.status(400).send(error));
    },
    /*
    retrieve(req,res) {

        return Loan
        .findById(req.params.id)
        .then(loan => {
            if(!loan) {

                return res.status(404).send({

                    message: 'Loan Application not found',
                });
            }
            return res.status(200).send(loan);
        })
        .catch(error => res.status(400).send(error));
    },
    */
    retrieveByVinAndSsn(req,res) {

        return Loan
        .findOne({
            where: {
                vin_number: req.body.vin_number,
                ssn_number: req.body.ssn_number
            }
        })
        .then(loan => {
            if(!loan) {

                return res.status(404).send({

                    message: 'Loan Application not found',
                });
            }
            return res.status(200).send(loan);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req,res){

        return Loan
        .findById(req.params.id)
        .then(loan => {

            if(!loan){
                return res.status(404).send({
                    message: 'Loan Application not found',
                });
        }
        return loan
        .update({
            customer_id: req.body.customer_id || loan.customer_id,
            vin_number: req.body.vin_number || loan.vin_number,
            amount: req.body.amount || loan.amount,
            status: req.body.status || loan.status,
            loan_period_months: req.body.loan_period_months || loan.loan_period_months,
            apr: req.body.apr || loan.apr,
            ssn_number: req.body.ssn_number || loan.ssn_number,
            monthly_payment: req.body.monthly_payment || loan.monthly_payment,
        })
        .then(() => res.status(200).send(loan))
        .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error))


    },
};