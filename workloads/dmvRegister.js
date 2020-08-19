'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const vehicles = ['1ABCD12EFGH12345', '1ABCD12EFGH12346', '1ABCD12EFGH12347', '1ABCD12EFGH12348', '1ABCD12EFGH12349', '1ABCD12EFGH12350', '1ABCD12EFGH12351', '1ABCD12EFGH12352', '1ABCD12EFGH12353', '1ABCD12EFGH12354', '1ABCD12EFGH12355', '1ABCD12EFGH12356', '1ABCD12EFGH12357', '1ABCD12EFGH12358', '1ABCD12EFGH12359'];
const ssns = ['AAABB1234', 'AAABB1235', 'AAABB1236', 'AAABB1237', 'AAABB1238', 'AAABB1239', 'AAABB1240', 'AAABB1241', 'AAABB1242'];

/**
 * Workload module for the benchmark round.
 */
class RegisterWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let ssn = ssns[Math.floor(Math.random() * ssns.length)];
        let vin = vehicles[Math.floor(Math.random() * vehicles.length)];

        let args = {
            chaincodeFunction: 'register',
            chaincodeArguments: [ssn, vin]
        };

        // contract id, contract version, data, timeout in seconds
        return this.sutAdapter.invokeSmartContract('register', '1.0', args, 30);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function registerWorkloadModule() {
    return new RegisterWorkload();
}

module.exports.createWorkloadModule = registerWorkloadModule;
