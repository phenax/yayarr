//go:build !gui

package platform

import (
	"github.com/phenax/yayarr/src/server"
)

func Start(s *server.Server) {
	s.Start()
}
