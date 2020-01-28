package main

// Action is what is sent in the request to the chaincode
type Action int

const (
	// CREATE a KV pair storage
	CREATE Action = iota
	// READ a Key
	READ
	// UPDATE a Key's value
	UPDATE
	// DELETE a Key
	DELETE
)

func (action Action) String() string {
	return []string{
		"CREATE",
		"READ",
		"UPDATE",
		"DELETE",
	}[action]
}
