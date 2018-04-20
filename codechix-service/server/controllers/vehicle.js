const Vehicle = require('../models').Vehicle

module.exports = {

    create(req,res){

        return Vehicle
        .create({
            vin_number: req.body.vin_number,
            vehicle_type: req.body.vehicle_type,
            vehicle_make: req.body.vehicle_make,
            vehicle_model: req.body.vehicle_model,
            vehicle_year: req.body.vehicle_year,
            vehicle_color: req.body.vehicle_color,
            list_price: req.body.list_price,
            //actual_price: req.body.actual_price,
            image_path: req.body.image_path,
            status: request.body.status,
        })
        .then(vehicle => res.status(201).send(vehicle))
        .catch(error => res.status(400).send(error));
    },

    list(req,res){

        return Vehicle
        .all()
        .then(vehicle => res.status(200).send(vehicle))
        .catch(error => res.status(400).send(error));
    },

    retrieve(req,res) {

        return Vehicle
        .findById(req.params.id)
        .then(vehicle => {
            if(!vehicle) {

                return res.status(404).send({

                    message: 'Vehicle not found',
                });
            }
            return res.status(200).send(vehicle);
        })
        .catch(error => res.status(400).send(error));
    },

    update(req,res){

        return Vehicle
        .findById(req.params.id)
        .then(vehicle => {

            if(!vehicle){
                return res.status(404).send({
                    message: 'Vehicle not found',
                });
        }
        return vehicle
        .update({
            vehicle_type: req.body.vehicle_type || vehicle.vehicle_type,
            vehicle_make: req.body.vehicle_make || vehicle.vehicle_make,
            vehicle_model: req.body.vehicle_model || vehicle.vehicle_model,
            vehicle_year: req.body.vehicle_year || vehicle.vehicle_year,
            vehicle_color: req.body.vehicle_color || vehicle.vehicle_color,
            list_price: req.body.list_price || vehicle.list_price,
            //actual_price: req.body.actual_price || vehicle.actual_price,
            image_path: req.body.image_path || vehicle.image_path,
            status: req.body.status || vehicle.status,
        })
        .then(() => res.status(200).send(vehicle))
        .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error))


    },
};