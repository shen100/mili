package utils

import (
	"fmt"
	"net/url"
)

// RelativeURLToAbsoluteURL 相对URL转绝对URL
func RelativeURLToAbsoluteURL(curURL string, baseURL string) (string, error) {
	curURLData, err := url.Parse(curURL)              
	if err != nil {          
		fmt.Println(err.Error())                
		return "", err                              
	}                                        
	baseURLData, err := url.Parse(baseURL)          
	if err != nil {    
		fmt.Println(err.Error())                             
		return "", err
	}
	curURLData = baseURLData.ResolveReference(curURLData)
	return curURLData.String(), nil 
}