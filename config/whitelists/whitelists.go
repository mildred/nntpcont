package whitelists

import (
	"encoding/json"
	"io"
	"os"
	"sync"
)

type Whitelist struct {
	Name      string
	Addresses []string
	lock      sync.Mutex
}

func NewWhitelist(name string) *Whitelist {
	list := &Whitelist{
		Name:      name,
		Addresses: nil,
	}
	return list
}

func (l *Whitelist) Refresh() error {
	l.lock.Lock()
	defer l.lock.Unlock()

	f, err := os.OpenFile(l.Name, os.O_RDWR|os.O_CREATE, 0600)
	if err != nil {
		return err
	}
	defer f.Close()

	return l.refresh(f)
}

func (l *Whitelist) refresh(f *os.File) error {
	err := json.NewDecoder(f).Decode(&l.Addresses)
	if err != nil && err != io.EOF {
		return err
	}
	return nil
}

func (h *Whitelist) AddToWhitelist(addr string) error {
	h.lock.Lock()
	defer h.lock.Unlock()

	var addrs []string
	f, err := os.OpenFile("whitelist", os.O_RDWR|os.O_CREATE, 0600)
	if err != nil {
		return err
	}
	defer f.Close()

	err = h.refresh(f)
	if err != nil {
		return err
	}

	for _, a := range addrs {
		if a == addr {
			return nil
		}
	}
	addrs = append(addrs, addr)
	f.Seek(0, 0)
	err = json.NewEncoder(f).Encode(addrs)
	if err != nil {
		return err
	}
	return nil
}
