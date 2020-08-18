package main

import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"hash/fnv"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	//"bytes"
)

var logger = shim.NewLogger("DmvCommonChaincode")

type DmvCommonChaincode struct {
}

type Registration struct {
	VinNumber string    `json:"vin"`
	SsnNumber string    `json:"ssnNumber"`
	RegNumber string    `json:"regNumber"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
	Status    string    `json:"status"`
}

func (t *DmvCommonChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Init")
	return shim.Success(nil)
}

func (t *DmvCommonChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Invoke")
	function, args := stub.GetFunctionAndParameters()
	if function == "register" {
		return t.register(stub, args)
	} else if function == "approved" {
		return t.approve(stub, args)
	} else if function == "query" {
		return t.query(stub, args)
	}

	return pb.Response{Status: 403, Message: "unknown function name"}
}

func (t *DmvCommonChaincode) register(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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
		if !strings.Contains(user, "admin") {
			if len(args) != 2 {
				return pb.Response{Status: 403, Message: "incorrect number of arguments"}
			}
			ssn := args[0]
			vin := args[1]

			// location, err := time.LoadLocation("America/Chicago")
			// if err != nil {
			// 	fmt.Println(err)
			// }
			// startDate := time.Now().In(location)
			// endDate := startDate.Add(time.Hour * 24 * 365)

			startDate := "2009-11-10 17:00:00 -0600 CST"
			endDate := "2010-11-10 17:00:00 -0600 CST"

			status := "Applied"
			regKey := ssn + "@" + vin

			registerObj := &Registration{
				VinNumber: vin,
				SsnNumber: ssn,
				Status:    status,
				StartDate: startDate,
				EndDate:   endDate}

			jsonRegisterObj, err := json.Marshal(registerObj)
			if err != nil {
				return shim.Error("Cannot create Json Object")
			}

			logger.Debug("Json Obj: " + string(jsonRegisterObj))

			err = stub.PutState(regKey, jsonRegisterObj)

			if err != nil {
				return shim.Error("cannot put state")
			}

			logger.Debug("Car Registered applied")

		}
	}

	return shim.Success(nil)
}

func (t *DmvCommonChaincode) approve(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	user, org := getCreator(creatorBytes)
	logger.Debug("User: " + user)
	if org == "" {
		logger.Debug("Org is null")
		return shim.Error("cannot get Org")
	} else if org == "dmv" {
		if strings.Contains(user, "admin") {
			if len(args) != 3 {
				return pb.Response{Status: 403, Message: "incorrect number of arguments"}
			}

			ssn := args[0]
			vin := args[1]
			status := args[2]
			regKey := ssn + "@" + vin

			registerBytes, err := stub.GetState(regKey)
			if err != nil {
				return shim.Error("cannot get state")
			} else if registerBytes == nil {
				return shim.Error("Cannot get insurance object")
			}

			var registerObj Registration
			errUnmarshal := json.Unmarshal([]byte(registerBytes), &registerObj)
			if errUnmarshal != nil {
				return shim.Error("Cannot unmarshal Insurance Object")
			}

			logger.Debug("Registration Object: " + string(registerBytes))

			registerObj.Status = status
			registerObj.RegNumber = hash(regKey)[0:7]

			registerObjBytes, _ := json.Marshal(registerObj)

			errInsurance := stub.PutState(regKey, registerObjBytes)
			if errInsurance != nil {
				return shim.Error("Error updating Negotiate Object: " + err.Error())
			}

			logger.Info("Update sucessfull")
		}
	}

	return shim.Success(nil)
}

func (t *DmvCommonChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if args[0] == "health" {
		logger.Info("Health status Ok")
		return shim.Success(nil)
	}

	creatorBytes, err := stub.GetCreator()
	if err != nil {
		return shim.Error("cannot get creator")
	}

	user, org := getCreator(creatorBytes)

	logger.Debug("User: " + user)

	if org == "" {
		logger.Debug("Org is null")
	} else if org == "dmv" {
		if len(args) != 1 {
			return pb.Response{Status: 403, Message: "incorrect number of arguments"}
		}
		vin := args[0]

		regKey := user + "@" + vin

		bytes, err := stub.GetState(regKey)
		if err != nil {
			return shim.Error("cannot get state")
		}
		return shim.Success(bytes)
	}

	return shim.Success(nil)
}

func hash(s string) string {
	h := fnv.New32a()
	h.Write([]byte(s))
	hashCode := strconv.FormatInt(int64(h.Sum32()), 10)
	return hashCode
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
	err := shim.Start(new(DmvCommonChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}
