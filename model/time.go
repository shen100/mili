package model

import (
	"fmt"
	"time"
)

// JSONTime 自定义时间
type JSONTime time.Time

// MarshalJSON 序列化时间
func (t JSONTime) MarshalJSON() ([]byte, error) {
    stamp := fmt.Sprintf("%s", time.Time(t).Format("2006-01-02 15:04:05"))
	return []byte(stamp), nil
}

// UnmarshalJSON 反序列化时间
func (t *JSONTime) UnmarshalJSON(data []byte) error {
	theTime, err := time.ParseInLocation("\"2006-01-02 15:04:05\"", string(data), time.Local)
	*t = JSONTime(theTime)
	return err
}

func (t JSONTime) String() string {
	timeStr := time.Time(t).Format("2006-01-02 15:04:05")
	fmt.Println(12345, timeStr)
    return timeStr
}
