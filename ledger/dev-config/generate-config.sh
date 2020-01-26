#!/bin/sh

mkdir /etc/hyperledger/config/channel
FABRIC_CFG_PATH=/etc/hyperledger/config

# Genesis block
configtxgen -profile "OrdererGenesis" -outputBlock "./channel/dev-genesis.block" -channelID "genesis"

# myc Channel
configtxgen -profile "myc" -outputBlock "./channel/myc.block" -outputCreateChannelTx "./channel/myc.tx" -channelID "myc"
