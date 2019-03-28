#!/bin/bash
for container in car-master-service.blockchain.uofa.edu car-blockchain-ui.blockchain.uofa.edu mysql.service.blockchain.uofa.edu portainer.blockchain.uofa.edu
do
    docker container kill $container
done
