package main

import (
    "fmt"
    "errors"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// KeyValue is to show sample chaincode in Go
type KeyValue struct {
}

// Init is called during chaincode instantiation to initialize any
// data. Note that chaincode upgrade also calls this function to reset
// or to migrate data.
func (kv *KeyValue) Init(stub shim.ChaincodeStubInterface) peer.Response {
	// nothing to initialize
	return shim.Success(nil)
}

// Invoke is called per transaction on the chaincode. Each transaction is
// either a 'get' or a 'set' on the asset created by Init function. The Set
// method may create a new asset by specifying a new key-value pair.
func (kv *KeyValue) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	// Extract the function and args from the transaction proposal
    action, args := stub.GetFunctionAndParameters()

	var err error
	var result string
	switch action {
	case CREATE.String():
		result, err = create(stub, args)
	case READ.String():
		result, err = read(stub, args)
	case UPDATE.String():
		result, err = update(stub, args)
	case DELETE.String():
		result, err = delete(stub, args)
	default:
		return shim.Error("Invalid operations " + action)
    }
    if err != nil {
        return shim.Error(err.Error())
    }

	// Return the result as success payload
	return shim.Success([]byte(result))
}

func create(stub shim.ChaincodeStubInterface, args []string) (string, error) {
    if len(args) != 2 {
        return "", errors.New("Input Key Value pair")
    }
    key := args[0]
    value := args[1]
    bytes, err := stub.GetState(key)
    value = string(bytes)
    if err == nil {
        // Cannot create error occurred
        return value, err
    }

    err = stub.PutState(key, []byte(value))
	return value, err
}

func read(stub shim.ChaincodeStubInterface, args []string) (string, error) {
    if len(args) != 1 {
        return "", errors.New("Required Key to read")
    }
    key := args[0]
    bytes, err := stub.GetState(key)
    value := string(bytes)
    if err != nil {
        return value, err
    }
    return value, nil
}

func update(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 2 {
        return "", errors.New("Input Key Value pair")
    }
    key := args[0]
    value := args[1]
    _, err := stub.GetState(key)
    if err != nil {
        return value, err
    }
    err = stub.PutState(key, []byte(value))
	return value, err
}

func delete(stub shim.ChaincodeStubInterface, args []string) (string, error) {
    if len(args) != 1 {
        return "", errors.New("Required Key to delete")
    }
    key := args[0]
    bytes, err := stub.GetState(key)
    value := string(bytes)
    if err != nil {
        return value, err
    }
    err = stub.DelState(key)
    if err != nil {
        return value, err
    }
    return value, nil
}

func main() {
	if err := shim.Start(new(KeyValue)); err != nil {
		fmt.Printf("Error starting KeyValue chaincode: %s", err)
	}
}
