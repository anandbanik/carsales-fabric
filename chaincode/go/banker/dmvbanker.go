package main

import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	//"bytes"
)

var logger = shim.NewLogger("DmvDealerChaincode")

type DmvDealerChaincode struct {
}

type Loan struct {
	VinNumber      string  `json:"vin"`
	Amount         int     `json:"amount"`
	SsnNumber      string  `json:"ssnNumber"`
	LoanPeriod     int     `json:"loanPeriod"`
	Apr            int     `json:"apr"`
	MonthlyPayment float64 `json:"monthlyPayment"`
	Status         string  `json:"status"`
	Org            string  `json:"org"`
}
type Negotiation struct {
	Ssn        string `json:"ssn"`
	VinNumber  string `json:"vin"`
	FinalPrice int    `json:"price"`
	Org        string `json:"org"`
}

func (t *DmvDealerChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Init")
	return shim.Success(nil)
}

func (t *DmvDealerChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Invoke")
	function, args := stub.GetFunctionAndParameters()
	if function == "apply" {
		return t.apply(stub, args)
	} else if function == "approve" {
		return t.approve(stub, args)
	} else if function == "query" {
		return t.query(stub, args)
	}

	return pb.Response{Status: 403, Message: "unknown function name"}
}
func (t *DmvDealerChaincode) apply(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	ssn, org := getCreator(creatorBytes)
	if org == "" {
		logger.Debug("Org is null")
		return shim.Error("cannot get Org")
	} else if org == "dmv" {

		if len(args) < 2 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		funcCall := []byte("query")

		dealerKey := []byte(args[0])
		argTocc := [][]byte{funcCall, dealerKey}

		response := stub.InvokeChaincode("dealer", argTocc, "dmv-dealer")

		payloadBytes := response.GetPayload()

		logger.Info(string(payloadBytes))

		var negoObj Negotiation
		errUnmarshal := json.Unmarshal([]byte(payloadBytes), &negoObj)
		if errUnmarshal != nil {
			return shim.Error("Could not find Dealer record")
		}

		price := negoObj.FinalPrice

		loanAmount := 0
		if len(args) >= 3 {
			loanAmount, _ = strconv.Atoi(args[2])
			if loanAmount > price {
				return shim.Error("Loan amount cannot be more than vehicle price")
			}
		} else {
			loanAmount = price
		}

		loanPeriod, err := strconv.Atoi(args[1])
		if err != nil {
			return shim.Error("Invalid Loan amount, expecting a integer value")
		}

		status := "Applied"

		loanObj := &Loan{
			VinNumber:  args[0],
			Amount:     loanAmount,
			SsnNumber:  ssn,
			LoanPeriod: loanPeriod,
			Org:        org,
			Status:     status}

		jsonLoanObj, err := json.Marshal(loanObj)
		if err != nil {
			return shim.Error("Cannot create Json Object")
		}

		logger.Debug("Json Obj: " + string(jsonLoanObj))

		loankey := ssn + "@" + args[0]

		err = stub.PutState(loankey, jsonLoanObj)

		if err != nil {
			return shim.Error("cannot put state")
		}

		logger.Debug("Loan Object added")

	} /*else if org == "banker" {

		if len(args) != 3 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		key := args[0] + "@" + args[1]

		loanBytes, err := stub.GetState(key)

		if err != nil {
			return shim.Error("cannot get state")
		} else if loanBytes == nil {
			return shim.Error("Cannot get loan object")
		}

		var loanObj Loan
		errUnmarshal := json.Unmarshal([]byte(loanBytes), &loanObj)
		if errUnmarshal != nil {
			return shim.Error("Cannot unmarshal Loan Object")
		}

		logger.Debug("Loan Object: " + string(loanBytes))

		loanObj.Status = args[2]

		loanObjBytes, _ := json.Marshal(loanObj)

		errLoan := stub.PutState(key, loanObjBytes)
		if errLoan != nil {
			return shim.Error("Error updating Loan Object: " + err.Error())
		}
		logger.Info("Update sucessfull")
	}
	*/
	return shim.Success(nil)
}

func (t *DmvDealerChaincode) approve(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	bankUsr, org := getCreator(creatorBytes)
	if org == "" {
		logger.Debug("Org is null")
		return shim.Error("cannot get Org")
	} else if org == "banker" {

		logger.Info("User: " + bankUsr)

		if len(args) != 3 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		key := args[0] + "@" + args[1]

		loanBytes, err := stub.GetState(key)

		if err != nil {
			return shim.Error("cannot get state")
		} else if loanBytes == nil {
			return shim.Error("Cannot get loan object")
		}

		var loanObj Loan
		errUnmarshal := json.Unmarshal([]byte(loanBytes), &loanObj)
		if errUnmarshal != nil {
			return shim.Error("Cannot unmarshal Loan Object")
		}

		logger.Debug("Loan Object: " + string(loanBytes))

		interest, err := strconv.Atoi(args[2])
		if err != nil {
			return shim.Error("Invalid Apr , expecting a integer value")
		}

		loanObj.Apr = interest

		aprMonth := float64(interest) / 1200

		monthlyPayment := ((aprMonth * float64(loanObj.Amount)) / (1 - math.Pow((1+aprMonth), float64(-loanObj.LoanPeriod))))

		monthlyPayment, _ = strconv.ParseFloat(strconv.FormatFloat(monthlyPayment, 'f', 2, 64), 64)

		loanObj.MonthlyPayment = monthlyPayment

		loanObj.Status = "Approved"

		loanObjBytes, _ := json.Marshal(loanObj)

		errLoan := stub.PutState(key, loanObjBytes)
		if errLoan != nil {
			return shim.Error("Error updating Loan Object: " + err.Error())
		}
		logger.Info("Update sucessfull")

	}

	return shim.Success(nil)
}

func getApr() int {

	return 3
}

func (t *DmvDealerChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if args[0] == "health" {
		logger.Info("Health status Ok")
		return shim.Success(nil)
	}

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	ssn, org := getCreator(creatorBytes)

	if org == "" {
		logger.Debug("Org is null")
	} else if org == "dmv" {

		if len(args) != 1 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		key := ssn + "@" + args[0]

		bytes, err := stub.GetState(key)
		if err != nil {
			return shim.Error("cannot get state")
		}
		return shim.Success(bytes)
	} else if org == "banker" {

		if len(args) != 2 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		key := args[0] + "@" + args[1]

		bytes, err := stub.GetState(key)
		if err != nil {
			return shim.Error("cannot get state")
		}
		return shim.Success(bytes)
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

func main() {
	err := shim.Start(new(DmvDealerChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}
