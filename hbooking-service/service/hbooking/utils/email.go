package utils

import (
	"bytes"
	"crypto/tls"
	"errors"
	"html/template"
	"os"
	"path/filepath"
	"strings"

	"github.com/k3a/html2text"
	"github.com/zeromicro/go-zero/core/logx"
	"gopkg.in/gomail.v2"
)

const (
	MailVerifyAccountTemplatePath = "mail_register_user.html"
	MailResetPasswordTemplatePath = "mail_reset_password.html"
)

type EmailData struct {
	URL      string
	UserName string
	Subject  string
}

type SMTPConfig struct {
	EmailFrom string
	SMTPHost  string
	SMTPPass  string
	SMTPPort  int
	SMTPUser  string

	ClientOrigin string
}

func ParseTemplateDir(dir string) (*template.Template, error) {
	var paths []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			paths = append(paths, path)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return template.ParseFiles(paths...)
}

func SendEmail(email string, templatesPath string, config SMTPConfig, data EmailData) error {

	// Sender data.
	from := config.EmailFrom
	smtpPass := config.SMTPPass
	smtpUser := config.SMTPUser
	to := email
	smtpHost := config.SMTPHost
	smtpPort := config.SMTPPort

	var body bytes.Buffer

	temp, err := ParseTemplateDir("templates")
	if err != nil {
		logx.Error(err)
		return errors.New("could not parse template")
	}

	if err := temp.ExecuteTemplate(&body, templatesPath, data); err != nil {
		logx.Error(err)
		return err
	}

	bodyReplaced := strings.ReplaceAll(body.String(), "_URL", data.URL)
	logx.Info(bodyReplaced)

	m := gomail.NewMessage()

	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", data.Subject)
	m.SetBody("text/html", bodyReplaced)
	m.AddAlternative("text/plain", html2text.HTML2Text(bodyReplaced))

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{
		InsecureSkipVerify: true,
	}

	// Send Email
	if err := d.DialAndSend(m); err != nil {
		return errors.New("Could not send email. Err: " + err.Error())
	}

	return nil
}

func SendRegisterEmail(email string, templatesPath string, config SMTPConfig, data map[string]interface{}) error {

	// Sender data.
	from := config.EmailFrom
	smtpPass := config.SMTPPass
	smtpUser := config.SMTPUser
	to := email
	smtpHost := config.SMTPHost
	smtpPort := config.SMTPPort

	var body bytes.Buffer

	temp, err := ParseTemplateDir("templates")
	if err != nil {
		logx.Error(err)
		return errors.New("could not parse template")
	}

	if err := temp.ExecuteTemplate(&body, templatesPath, data); err != nil {
		logx.Error(err)
		return err
	}

	m := gomail.NewMessage()

	subject, exist := data["Subject"]
	if !exist {
		logx.Error(errors.New("subject is not exist"))
		return errors.New("subject is not exist")
	}

	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject.(string))
	m.SetBody("text/html", body.String())
	m.AddAlternative("text/plain", html2text.HTML2Text(body.String()))

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{
		InsecureSkipVerify: true,
	}

	// Send Email
	if err := d.DialAndSend(m); err != nil {
		return errors.New("Could not send email. Err: " + err.Error())
	}

	return nil
}
