CREATE DATABASE `codechix` /*!40100 DEFAULT CHARACTER SET utf8 */;

use codechix;

CREATE TABLE `Customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `ssn_number` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `createdAt` varchar(45) DEFAULT NULL,
  `updatedAt` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ssn_number_UNIQUE` (`ssn_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `Vehicles` (
  `vehicle_type` varchar(45) DEFAULT NULL,
  `vehicle_make` varchar(45) DEFAULT NULL,
  `vehicle_model` varchar(45) DEFAULT NULL,
  `list_price` int(11) DEFAULT NULL,
  `actual_price` int(11) DEFAULT NULL,
  `vin_number` varchar(45) NOT NULL,
  `vehicle_year` int(11) DEFAULT NULL,
  `vehicle_color` varchar(45) DEFAULT NULL,
  `createdAt` varchar(45) DEFAULT NULL,
  `updatedAt` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`vin_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
