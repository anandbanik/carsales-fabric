package main

import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	//"bytes"
)

var logger = shim.NewLogger("DmvInsuranceChaincode")

type DmvInsuranceChaincode struct {
}
type Negotiation struct {
	Ssn        string `json:"ssn"`
	VinNumber  string `json:"vin"`
	FinalPrice int    `json:"price"`
	Org        string `json:"org"`
}

type Insurance struct {
	VinNumber   string    `json:"vin"`
	Coverage    string    `json:"coverage"`
	CarPrice    int       `json:"carPrice"`
	MonthlyCost float64   `json:"monthlyCost"`
	SsnNumber   string    `json:"ssnNumber"`
	Duration    int       `json:"duration"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Status      string    `json:"status"`
}

func (t *DmvInsuranceChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Init")
	return shim.Success(nil)
}

func (t *DmvInsuranceChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Invoke")
	function, args := stub.GetFunctionAndParameters()
	if function == "apply" {
		return t.apply(stub, args)
	} else if function == "approved" {
		return t.approve(stub, args)
	} else if function == "query" {
		return t.query(stub, args)
	}

	return pb.Response{Status: 403, Message: "unknown function name"}
}

func getCarPrice(stub shim.ChaincodeStubInterface, vin string) int {

	funcCall := []byte("query")

	dealerKey := []byte(vin)
	argTocc := [][]byte{funcCall, dealerKey}

	response := stub.InvokeChaincode("dealer", argTocc, "dmv-dealer")

	payloadBytes := response.GetPayload()

	logger.Info(string(payloadBytes))

	var negoObj Negotiation
	errUnmarshal := json.Unmarshal([]byte(payloadBytes), &negoObj)
	if errUnmarshal != nil {
		logger.Critical("Could not get Final Price")
	}

	return negoObj.FinalPrice

}

func getMonthlyCost(carPrice int, duration int, coverage string) float64 {

	monthlyCost := 0.0

	if duration == 6 && coverage == "comprehensive" {
		monthlyCost = (float64(carPrice) / 100) * 0.35
	} else if duration == 12 && coverage == "comprehensive" {
		monthlyCost = (float64(carPrice) / 100) * 0.30
	} else if duration == 6 && coverage == "collateral" {
		monthlyCost = (float64(carPrice) / 100) * 0.25
	} else if duration == 12 && coverage == "collateral" {
		monthlyCost = (float64(carPrice) / 100) * 0.20
	} else {
		monthlyCost = (float64(carPrice) / 100) * 0.35
	}
	return monthlyCost
}

func (t *DmvInsuranceChaincode) apply(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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
		vin := args[0]
		coverage := args[1]
		if err != nil {
			return shim.Error("Invalid Monthly Cost amount, expecting a integer value")
		}

		location, err := time.LoadLocation("America/Chicago")
		if err != nil {
			fmt.Println(err)
		}
		duration := 6
		startDate := time.Now().In(location)
		endDate := startDate.Add(time.Hour * 24 * 180)
		if len(args) > 2 {
			duration, err = strconv.Atoi(args[2])
			if err != nil {
				logger.Error("Invalid duration, expecting a integer value")
			}
		}

		if duration == 12 {
			endDate = startDate.Add(time.Hour * 24 * 365)
		}

		carPrice := getCarPrice(stub, vin)

		status := "Applied"
		insuranceObj := &Insurance{
			VinNumber: vin,
			Coverage:  coverage,
			CarPrice:  carPrice,
			SsnNumber: ssn,
			Duration:  duration,
			StartDate: startDate,
			EndDate:   endDate,
			Status:    status}

		jsonInsuranceObj, err := json.Marshal(insuranceObj)
		if err != nil {
			return shim.Error("Cannot create Json Object")
		}

		logger.Debug("Json Obj: " + string(jsonInsuranceObj))

		inskey := ssn + "@" + vin

		err = stub.PutState(inskey, jsonInsuranceObj)

		if err != nil {
			return shim.Error("cannot put state")
		}

		logger.Debug("Loan Object added")
	} else {
		return shim.Error("Only user from DMV can apply")
	}
	return shim.Success(nil)
}

func (t *DmvInsuranceChaincode) approve(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	user, org := getCreator(creatorBytes)
	logger.Debug("User: " + user)
	if org == "" {
		logger.Debug("Org is null")
		return shim.Error("cannot get Org")
	} else if org == "insurance" {
		if len(args) != 3 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}

		ssn := args[0]
		vin := args[1]
		status := args[2]

		insKey := ssn + "@" + vin
		insuranceBytes, err := stub.GetState(insKey)
		if err != nil {
			return shim.Error("cannot get state")
		} else if insuranceBytes == nil {
			return shim.Error("Cannot get insurance object")
		}

		var insuranceObj Insurance
		errUnmarshal := json.Unmarshal([]byte(insuranceBytes), &insuranceObj)
		if errUnmarshal != nil {
			return shim.Error("Cannot unmarshal Insurance Object")
		}

		logger.Debug("Insurance Object: " + string(insuranceBytes))

		insuranceObj.Status = status
		insuranceObj.MonthlyCost = getMonthlyCost(insuranceObj.CarPrice, insuranceObj.Duration, insuranceObj.Coverage)

		insuranceObjBytes, _ := json.Marshal(insuranceObj)

		errInsurance := stub.PutState(insKey, insuranceObjBytes)
		if errInsurance != nil {
			return shim.Error("Error updating Negotiate Object: " + err.Error())
		}

		stub.SetEvent("registration", []byte(insKey))

		logger.Info("Update sucessfull")

	}

	return shim.Success(nil)
}

func (t *DmvInsuranceChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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

	} else if org == "insurance" {
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
	err := shim.Start(new(DmvInsuranceChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}
