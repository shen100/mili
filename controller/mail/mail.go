package mail
 
import (
    "crypto/tls"
    "fmt"
    "log"
    "net"
	"net/smtp"
	"github.com/shen100/golang123/config"
)

// SendMail 发送邮件
func SendMail(toEmail, subject, content string) error {
    host      := config.ServerConfig.MailHost
    port      := config.ServerConfig.MailPort
    email     := config.ServerConfig.MailUser
    password  := config.ServerConfig.MailPass
    emailFrom := config.ServerConfig.MailFrom

    headers                := make(map[string]string)
    headers["From"]         = emailFrom + "<" + email + ">"
    headers["To"]           = toEmail
    headers["Subject"]      = subject
    headers["Content-Type"] = "text/html; charset=UTF-8"
 
    message := ""
    for key, value := range headers {
        message += fmt.Sprintf("%s: %s\r\n", key, value)
    }
    message += "\r\n" + content
 
    auth := smtp.PlainAuth("", email, password, host)
 
    err := sendMailUsingTLS(
		fmt.Sprintf("%s:%d", host, port),
        auth,
        email,
        []string{ toEmail },
        message,
    )
	return err
}

//参考net/smtp的func SendMail()
//使用net.Dial连接tls(ssl)端口时, smtp.NewClient()会卡住且不提示err
//len(to) > 1 时, to[1]开始提示是密送
func sendMailUsingTLS(addr string, auth smtp.Auth, from string,
    to []string, message string) error {

    client, err := createSMTPClient(addr)
    if err != nil {
		fmt.Println(err.Error())
        return err
    }
    defer client.Close()
 
    if auth != nil {
        if ok, _ := client.Extension("AUTH"); ok {
            if err := client.Auth(auth); err != nil {
                log.Println(err.Error())
                return err
            }
        }
    }
 
    if err := client.Mail(from); err != nil {
        return err
    }
 
    for _, addr := range to {
        if err := client.Rcpt(addr); err != nil {
            return err
        }
    }
 
    writeCloser, err := client.Data()
    if err != nil {
        return err
    }
 
    _, err = writeCloser.Write([]byte(message))
    if err != nil {
        return err
    }
 
	err = writeCloser.Close()
	
    if err != nil {
        return err
    }
 
    return client.Quit()
}

func createSMTPClient(addr string) (*smtp.Client, error) {
    conn, err := tls.Dial("tcp", addr, nil)
    if err != nil {
		fmt.Println(err.Error())
        return nil, err
    }
	host, _, _ := net.SplitHostPort(addr)
    return smtp.NewClient(conn, host)
}