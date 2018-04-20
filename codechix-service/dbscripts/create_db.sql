CREATE DATABASE `codechix` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE codechix;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

CREATE TABLE `Vehicles` (
  `vehicle_type` varchar(45) DEFAULT NULL,
  `vehicle_make` varchar(45) DEFAULT NULL,
  `vehicle_model` varchar(45) DEFAULT NULL,
  `list_price` int(11) DEFAULT NULL,
  `vin_number` varchar(45) NOT NULL,
  `vehicle_year` int(11) DEFAULT NULL,
  `vehicle_color` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT '1',
  `image_path` varchar(255) DEFAULT NULL,
  `createdAt` varchar(45) DEFAULT NULL,
  `updatedAt` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`vin_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `insurance` (
  `customer_id` int(4) DEFAULT NULL,
  `vin_number` varchar(45) NOT NULL,
  `coverage` double DEFAULT NULL,
  `monthly_cost` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `ssn_number` varchar(45) NOT NULL,
  PRIMARY KEY (`vin_number`,`ssn_number`),
  KEY `fk_customer_id_ins` (`customer_id`),
  KEY `fk_vehicle_id_ins` (`vin_number`),
  CONSTRAINT `fk_customer_ins` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vehicle_ins` FOREIGN KEY (`vin_number`) REFERENCES `Vehicles` (`vin_number`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `loan` (
  `customer_id` int(4) DEFAULT NULL,
  `vin_number` varchar(45) NOT NULL,
  `amount` int(4) DEFAULT NULL,
  `loan_period_months` varchar(45) DEFAULT NULL,
  `apr` double DEFAULT NULL,
  `ssn_number` varchar(45) NOT NULL,
  `monthly_payment` double DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`vin_number`,`ssn_number`),
  KEY `fk_customer_id_loan` (`customer_id`),
  KEY `fk_vehicle_id_loan` (`vin_number`),
  CONSTRAINT `fk_customer_loan` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vehicle_loan` FOREIGN KEY (`vin_number`) REFERENCES `Vehicles` (`vin_number`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `registration` (
  `customer_id` int(4) DEFAULT NULL,
  `vin_number` varchar(45) NOT NULL,
  `tag_id` varchar(45) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `ssn_number` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`vin_number`,`ssn_number`),
  KEY `fk_customer_reg_idx` (`customer_id`),
  KEY `fk_vehicle_reg_id_reg` (`vin_number`),
  CONSTRAINT `fk_customer_regis` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vehicle_regis` FOREIGN KEY (`vin_number`) REFERENCES `Vehicles` (`vin_number`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `vehicle_negotiation` (
  `vin_number` varchar(45) NOT NULL,
  `actual_price` double DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `comments` varchar(4555) DEFAULT NULL,
  `ssn_number` varchar(45) NOT NULL,
  `dealer_name` varchar(45) DEFAULT 'Walmart CarMart',
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`vin_number`,`ssn_number`),
  KEY `fk_customer_vn_idx` (`ssn_number`),
  KEY `fk_vehicle_vn_idx` (`vin_number`),
  CONSTRAINT `fk_customer_vn` FOREIGN KEY (`ssn_number`) REFERENCES `Customers` (`ssn_number`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vehicle_vn` FOREIGN KEY (`vin_number`) REFERENCES `Vehicles` (`vin_number`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



INSERT INTO codechix.Customers (name,phone,ssn_number,address,createdAt,updatedAt) VALUES 
('Anand','6107514231','sdfsdf','805 Moberly Ln','2017-08-31 17:00:53','2017-09-08 22:53:45')
,('Anand','6107514231','123-34-4321','805 Moberly Ln','2017-08-31 17:34:34','2017-08-31 17:34:34')
,('Anand','6107514231','123-34-4323','805 Moberly Ln','2017-08-31 17:34:55','2017-08-31 17:34:55')
,('Anand','6107514231','123-34-4322','805 Moberly Ln','2017-08-31 18:59:41','2017-08-31 18:59:41')
,('Ranga','6107514231','123-34-43233','805 Moberly Ln','2017-09-01 19:39:37','2017-09-01 19:39:37')
,('Shengi','61075131','123-34-432','Sunnyville','2017-09-01 20:51:25','2017-09-01 20:51:25')
,('Animesh','6107514231','123-34-1245','805 Moberly Ln','2017-09-11 21:42:00','2017-09-11 21:42:00')
,('Animesh','6107514231','123-12-1234','860 W California','2017-09-11 21:49:41','2017-09-11 21:59:07')
,('Arlan','4792587641','123-34-1234','805 Moberly Ln','2017-09-18 21:33:49','2017-09-18 21:33:49')
,('Arlan','61075131','123-34-4312','Bentonville','2017-09-19 16:51:25','2017-09-19 16:51:25');


INSERT INTO codechix.Customers (name,phone,ssn_number,address,createdAt,updatedAt) VALUES 
('Arlan','61075131','123-34-4313','Bentonville','2017-09-19 16:53:03','2017-09-19 16:53:03')
,('Arlan','61075131','123-34-431','Bentonville','2017-09-19 16:54:01','2017-09-19 16:54:01')
,('Arlan','61075131','123-34-43134','Bentonville','2017-09-19 16:54:34','2017-09-19 16:54:34')
,('Arlan','61075131','123-33-134','Bentonville','2017-09-19 16:55:09','2017-09-19 16:55:09')
,('Animesh2','6107514231','123-34-0987','860 Moberly Ln','2017-09-26 21:48:40','2017-09-26 21:48:40')
,('Ameya1','408921111','user-admin','860 W cali','2017-09-26 22:11:52','2017-09-26 22:11:52')
,('a2','2131119999','12345','860 W cali','2017-09-26 22:13:12','2017-09-26 22:13:12');


INSERT INTO codechix.Vehicles (vehicle_type,vehicle_make,vehicle_model,list_price,vin_number,vehicle_year,vehicle_color,status,image_path,createdAt,updatedAt) VALUES 
('Sedan','Mercedes Benz','C300',30000,'123123',2015,'Blue','1',NULL,'2017-09-11 22:08:42','2017-09-11 22:08:42')
,('Sedan','Honda','Civic',10000,'123456',2008,'Blue','1',NULL,'2017-08-31 19:03:22','2017-09-11 22:09:19')
,('Sedan','Honda','Civic',10000,'1234567',2008,'Blue',NULL,NULL,'2017-08-31 19:03:40','2017-08-31 19:03:40')
,('Sedan','Honda','Civic',10000,'1234590',2008,'Blue',NULL,NULL,'2017-09-01 19:40:52','2017-09-01 19:40:52');