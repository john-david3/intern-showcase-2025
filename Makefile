GOCMD	= go
GOBUILD	= $(GOCMD) build
GOTEST	= $(GOCMD) test
GORUN	= $(GOCMD) run

NPMRUN	= npm run dev

BUILD_DIR		:= build
PROJECT_DIR		= cmd
PROJECT_FILE	= main.go
REACT_DIR		= ui

run:
	@echo "Running app"
	@cd ${PROJECT_DIR} && $(GORUN) $(PROJECT_FILE)

dev:
	@echo "Running React app"
	@cd $(REACT_DIR) && $(NPMRUN)