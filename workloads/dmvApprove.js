'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const validVehicles = ['1ABCD12EFGH12345', '1ABCD12EFGH12346', '1ABCD12EFGH12347', '1ABCD12EFGH12348', '1ABCD12EFGH12349', '1ABCD12EFGH12350', '1ABCD12EFGH12351', '1ABCD12EFGH12352', '1ABCD12EFGH12353', '1ABCD12EFGH12354', '1ABCD12EFGH12355', '1ABCD12EFGH12356', '1ABCD12EFGH12357', '1ABCD12EFGH12358', '1ABCD12EFGH12359'];
const invalidVehicles = ['3ABCD12EFGH12345', '1BBCD12EFGH12346', '1ABDD12EFGH12347', '1ABCE12EFGH12348', '1ABCD22EFGH12349', '1ABBD12EFGH12350', '1AACD12EFGH12351', '1ABCC22EFGH12352', '1ABCD12EFGH12453', '1ABCD12EJGH12354', '1ABCD72EFGH12355', '1ABCD12LFGH12356', '1ABCD12ERGH12357', '1ABCD12EFGK12358', '1ABCD12EFJH12359'];
const validSsns = ['AAABB1234', 'AAABB1235', 'AAABB1236', 'AAABB1237', 'AAABB1238', 'AAABB1239', 'AAABB1240', 'AAABB1241', 'AAABB1242'];
const invalidSsns = ['ABBBB1234', 'BAABB1235', 'CAABB1236', 'DAABB1237', 'EAABB1238', 'AAABB3239', 'AAABB4240', 'AAABB1261', 'AAABB1272'];
const statuses = ['APPROVED', 'REJECTED', 'TERMINATED'];
const selector = ["VALID", "INVALID"];

/**
 * Workload module for the benchmark round.
 */
class ApproveWorkload extends WorkloadModuleBase {
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
        let vin = "";
        if (selector[Math.floor(Math.random() * 2)] == "VALID") {
            vin = validVehicles[Math.floor(Math.random() * validVehicles.length)];
        } else {
            vin = invalidVehicles[Math.floor(Math.random() * invalidVehicles.length)];
        }
        let ssn = "";
        if (selector[Math.floor(Math.random() * 2)] == "VALID") {
            vin = validSsns[Math.floor(Math.random() * validSsns.length)];
        } else {
            vin = invalidSsns[Math.floor(Math.random() * invalidSsns.length)];
        }
        let status = statuses[Math.floor(Math.random() * statuses.length)];

        let args = {
            chaincodeFunction: 'approved',
            chaincodeArguments: [ssn, vin, status]
        };

        // contract id, contract version, data, timeout in seconds
        return this.sutAdapter.invokeSmartContract('register', '1.0', args, 30);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function approveWorkloadModule() {
    return new ApproveWorkload();
}

module.exports.createWorkloadModule = approveWorkloadModule;
