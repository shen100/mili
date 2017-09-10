package utils

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