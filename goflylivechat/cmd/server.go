package cmd

import (
	"fmt"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/taoshihan1991/imaptool/common"
	"github.com/taoshihan1991/imaptool/middleware"
	"github.com/taoshihan1991/imaptool/router"
	"github.com/taoshihan1991/imaptool/static"
	"github.com/taoshihan1991/imaptool/tools"
	"github.com/taoshihan1991/imaptool/ws"
	"github.com/zh-five/xdaemon"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

var (
	port   string
	daemon bool
)
var serverCmd = &cobra.Command{
	Use:     "server",
	Short:   "启动http服务",
	Example: "go-fly server -c config/",
	Run: func(cmd *cobra.Command, args []string) {
		run()
	},
}

func init() {
	serverCmd.PersistentFlags().StringVarP(&port, "port", "p", "8081", "监听端口号")
	serverCmd.PersistentFlags().BoolVarP(&daemon, "daemon", "d", false, "是否为守护进程模式")
}
func run() {
	if daemon == true {
		logFilePath := ""
		if dir, err := os.Getwd(); err == nil {
			logFilePath = dir + "/logs/"
		}
		_, err := os.Stat(logFilePath)
		if os.IsNotExist(err) {
			if err := os.MkdirAll(logFilePath, 0777); err != nil {
				log.Println(err.Error())
			}
		}
		d := xdaemon.NewDaemon(logFilePath + "go-fly.log")
		d.MaxCount = 10
		d.Run()
	}

	baseServer := "0.0.0.0:" + port
	log.Println("start server...\r\ngo：http://" + baseServer)
	tools.Logger().Println("start server...\r\ngo：http://" + baseServer)

	// 创建一个没有默认中间件的引擎实例
	engine := gin.New()
	// 添加必要的中间件
	engine.Use(gin.Recovery()) // 恢复中间件用于处理panic
	engine.Use(tools.Session("gofly"))
	engine.Use(middleware.CrossSite)
	engine.Use(middleware.NewMidLogger())
	//性能监控
	pprof.Register(engine)
	
	if common.IsCompireTemplate {
		templ := template.Must(template.New("").ParseFS(static.TemplatesEmbed, "templates/*.html"))
		engine.SetHTMLTemplate(templ)
		
		// 统一处理所有静态文件请求
		engine.GET("/static/*filepath", func(c *gin.Context) {
			// 获取文件路径
			path := c.Param("filepath")
			if len(path) > 0 && path[0] == '/' {
				path = path[1:]
			}
			
			// 检查是否是upload目录的请求
			if strings.HasPrefix(path, "upload/") {
				// 对于upload目录，使用物理文件系统
				physicalPath := "./static/upload/" + strings.TrimPrefix(path, "upload/")
				c.File(physicalPath)
			} else {
				// 对于其他静态文件，使用嵌入文件系统
				c.FileFromFS(path, http.FS(static.JsEmbed))
			}
		})
		
		// 为assets路径使用嵌入文件系统
		engine.StaticFS("/assets", http.FS(static.JsEmbed))
	} else {
		engine.LoadHTMLGlob("static/templates/*")
		engine.Static("/static", "./static")
		engine.Static("/assets", "./static")
	}
	router.InitViewRouter(engine)
	router.InitApiRouter(engine)
	//记录pid
	ioutil.WriteFile("gofly.sock", []byte(fmt.Sprintf("%d,%d", os.Getppid(), os.Getpid())), 0666)
	//限流类
	tools.NewLimitQueue()
	//清理
	ws.CleanVisitorExpire()
	//后端websocket
	go ws.WsServerBackend()

	engine.Run(baseServer)
}
