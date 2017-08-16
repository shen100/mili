package model

import (
	"fmt"
	"time"
)

// JSONTime 自定义时间
type JSONTime time.Time

// MarshalJSON 序列化时间
func (t JSONTime) MarshalJSON() ([]byte, error) {
    stamp := fmt.Sprintf("\"%s\"", time.Time(t).Format("2006-01-02 15:04:05"))
	return []byte(stamp), nil
}

// UnmarshalJSON 反序列化时间
func (t *JSONTime) UnmarshalJSON(data []byte) error {
	theTime, err := time.Parse("\"2006-01-02 15:04:05\"", string(data))
	*t = JSONTime(theTime)
	return err
}
