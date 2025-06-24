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
	@CGO_ENABLED=1 && cd ${PROJECT_DIR} && $(GORUN) $(PROJECT_FILE)

dev:
	@echo "Running React app"
	@cd $(REACT_DIR) && $(NPMRUN)

serve:
	@echo "Running flask server"
	@python3 cmd/app.py

install-deps:
	@pip3 install -r requirements.txt
	@npm install react-router-dom