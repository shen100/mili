package utils

import (
	"fmt"
	"reflect"
    "errors"
    "encoding/base64"
    "github.com/russross/blackfriday"
)

func setField(obj interface{}, name string, value interface{}) error {
	structData := reflect.ValueOf(obj).Elem()
    fieldValue := structData.FieldByName(name)

    if !fieldValue.IsValid() {
        return fmt.Errorf("utils.setField() No such field: %s in obj ", name)
    }

    if !fieldValue.CanSet() {
        return fmt.Errorf("Cannot set %s field value ", name)
    }

   	fieldType := fieldValue.Type()
    val       := reflect.ValueOf(value)

	valTypeStr   := val.Type().String()
	fieldTypeStr := fieldType.String()
	if valTypeStr == "float64" && fieldTypeStr == "int" {
		val = val.Convert(fieldType)
	} else if fieldType != val.Type() {
        return errors.New("Provided value type " + valTypeStr + " didn't match obj field type " + fieldTypeStr)
    }
    fieldValue.Set(val)
    return nil
}

// StrToIntMonth 字符串月份转整数月份
func StrToIntMonth(month string) int  {
    var data = map[string]int{
        "January"   : 0,
        "February"  : 1,
        "March"     : 2,
        "April"     : 3,
        "May"       : 4,
        "June"      : 5,
        "July"      : 6,
        "August"    : 7,
        "September" : 8,
        "October"   : 9,
        "November"  : 10,
        "December"  : 11,
    };
    return data[month];
}

// SetStructByJSON 由json对象生成 struct
func SetStructByJSON(obj interface{}, mapData map[string]interface{}) error {
	for key, value := range mapData {
        if err := setField(obj, key, value); err != nil {
			fmt.Println(err.Error())
            return err
        }
    }
	return nil
}

// MarkdownToHTML 将markdown 转换为 html
func MarkdownToHTML(md string) string {
	myHTMLFlags := 0 |
	blackfriday.HTML_USE_XHTML |
	blackfriday.HTML_USE_SMARTYPANTS |
	blackfriday.HTML_SMARTYPANTS_FRACTIONS |
	blackfriday.HTML_SMARTYPANTS_DASHES |
	blackfriday.HTML_SMARTYPANTS_LATEX_DASHES

	myExtensions := 0 |
		blackfriday.EXTENSION_NO_INTRA_EMPHASIS |
		blackfriday.EXTENSION_TABLES |
		blackfriday.EXTENSION_FENCED_CODE |
		blackfriday.EXTENSION_AUTOLINK |
		blackfriday.EXTENSION_STRIKETHROUGH |
		blackfriday.EXTENSION_SPACE_HEADERS |
		blackfriday.EXTENSION_HEADER_IDS |
		blackfriday.EXTENSION_BACKSLASH_LINE_BREAK |
		blackfriday.EXTENSION_DEFINITION_LISTS | 
		blackfriday.EXTENSION_HARD_LINE_BREAK

	renderer := blackfriday.HtmlRenderer(myHTMLFlags, "", "")
	bytes    := blackfriday.MarkdownOptions([]byte(md), renderer, blackfriday.Options{
        Extensions: myExtensions})
    return string(bytes)
}

// Base64Encode Base64加密
func Base64Encode(str string, base64Table string) string {
    coder := base64.NewEncoding(base64Table)
	return coder.EncodeToString([]byte(str))
}
