package main

import (
	"bytes"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("CarSalesChaincode")

type CarSalesChaincode struct {
}

type Negotiation struct {
	Ssn        string `json:"ssn"`
	VinNumber  string `json:"vin"`
	FinalPrice int    `json:"price"`
	Status     string `json:"status"`
	Org        string `json:"org"`
}

func (t *CarSalesChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Init")
	return shim.Success(nil)
}

func (t *CarSalesChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Invoke")
	function, args := stub.GetFunctionAndParameters()
	if function == "negotiate" {
		return t.negotiate(stub, args)
	} else if function == "query" {
		return t.query(stub, args)
	} else if function == "approve" {
		return t.approve(stub, args)
	} else if function == "qryNegotiate" {
		return t.queryNegotiationsByPrice(stub, args)
	}

	return pb.Response{Status: 403, Message: "unknown function name"}
}

func (t *CarSalesChaincode) negotiate(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	ssnNumber, org := getCreator(creatorBytes)

	if org == "dmv" {

		if len(args) < 2 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		price, err := strconv.Atoi(args[1])

		if err != nil {
			return shim.Error("Invalid Car price amount, expecting a integer value")
		}

		vin := args[0]

		status := "Applied"

		if len(args) > 2 {
			status = args[2]
		}

		negObj := &Negotiation{
			Ssn:        ssnNumber,
			Org:        org,
			VinNumber:  vin,
			Status:     status,
			FinalPrice: price}

		jsonNegObj, err := json.Marshal(negObj)

		if err != nil {
			return shim.Error("Cannot create Json Object")
		}

		logger.Debug("Json Obj: " + string(jsonNegObj))

		key := ssnNumber + "@" + vin

		err = stub.PutState(key, jsonNegObj)

		if err != nil {
			return shim.Error("cannot put state")
		}
	} else if org == "dealer" {

		if len(args) != 3 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		dealerUsr := args[0]

		vin := args[1]

		status := args[2]

		key := dealerUsr + "@" + vin

		negotiateBytes, err := stub.GetState(key)

		if err != nil {
			return shim.Error("cannot get state")
		} else if negotiateBytes == nil {
			return shim.Error("Cannot get negotiate object")
		}

		var negotiateObj Negotiation
		errUnmarshal := json.Unmarshal([]byte(negotiateBytes), &negotiateObj)
		if errUnmarshal != nil {
			return shim.Error("Cannot unmarshal Negotiate Object")
		}

		logger.Debug("Negotiate Object: " + string(negotiateBytes))

		negotiateObj.Status = status

		negotiateObjBytes, _ := json.Marshal(negotiateObj)

		errNegotiate := stub.PutState(key, negotiateObjBytes)
		if errNegotiate != nil {
			return shim.Error("Error updating Negotiate Object: " + err.Error())
		}

		logger.Info("Update sucessfull")

	}

	return shim.Success(nil)
}

func (t *CarSalesChaincode) approve(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	dealerUsr, org := getCreator(creatorBytes)

	logger.Debug("User: " + dealerUsr)

	if org == "dealer" {

		if len(args) != 2 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		dealerUsr := args[0]

		vin := args[1]

		key := dealerUsr + "@" + vin

		negotiateBytes, err := stub.GetState(key)

		if err != nil {
			return shim.Error("cannot get state")
		} else if negotiateBytes == nil {
			return shim.Error("Cannot get negotiate object")
		}

		var negotiateObj Negotiation
		errUnmarshal := json.Unmarshal([]byte(negotiateBytes), &negotiateObj)
		if errUnmarshal != nil {
			return shim.Error("Cannot unmarshal Negotiate Object")
		}

		logger.Debug("Negotiate Object: " + string(negotiateBytes))

		negotiateObj.Status = "Approved"

		negotiateObjBytes, _ := json.Marshal(negotiateObj)

		errNegotiate := stub.PutState(key, negotiateObjBytes)
		if errNegotiate != nil {
			return shim.Error("Error updating Negotiate Object: " + err.Error())
		}

		logger.Info("Update sucessfull")
	}

	return shim.Success(nil)

}

func (t *CarSalesChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if args[0] == "health" {
		logger.Info("Health status Ok")
		return shim.Success(nil)
	}

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	ssnNumber, org := getCreator(creatorBytes)

	if org == "" {
		logger.Debug("Org is null")
		return shim.Error("cannot get Org")

	} else if org == "dmv" {

		if len(args) != 1 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		key := ssnNumber + "@" + args[0]

		logger.Info("Key is: " + key)
		negObj, err := stub.GetState(key)
		if err != nil {
			return shim.Error("Cannot get State")
		}
		logger.Debug("Value: " + string(negObj))

		return shim.Success(negObj)

	} else if org == "dealer" {

		if len(args) != 2 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		key := args[0] + "@" + args[1]
		logger.Info("Key is: " + key)

		negObj, err := stub.GetState(key)
		if err != nil {
			return shim.Error("Cannot get State")
		}

		logger.Debug("Value: " + string(negObj))

		return shim.Success(negObj)
	}

	return shim.Success(nil)
}

var getCreator = func(certificate []byte) (string, string) {
	data := certificate[strings.Index(string(certificate), "-----") : strings.LastIndex(string(certificate), "-----")+5]
	block, _ := pem.Decode([]byte(data))
	cert, _ := x509.ParseCertificate(block.Bytes)
	organization := cert.Issuer.Organization[0]
	commonName := cert.Subject.CommonName
	logger.Debug("commonName: " + commonName + ", organization: " + organization)
	organizationShort := strings.Split(organization, ".")[0]

	return commonName, organizationShort
}

func (t *CarSalesChaincode) queryNegotiationsByPrice(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//   0
	// "bob"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	price, err := strconv.Atoi(args[0])

	//queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"marble\",\"owner\":\"%s\"}}", owner)
	queryString := fmt.Sprintf("{\"selector\":{\"price\":%d}}", price)

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	logger.Info("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	logger.Info("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

func main() {
	err := shim.Start(new(CarSalesChaincode))
	if err != nil {
		fmt.Printf("Error starting CarSales chaincode: %s", err)
	}
}
