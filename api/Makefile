.PHONY: all
all: start

.PHONY: clean
clean:
	docker compose down -v

.PHONY: start
start:
	docker compose up --remove-orphans --build

# Load test data to a running database
.PHONY: load-test-data
load-test-data:
	@echo "Loading test data..."
	docker run --rm \
	  -v ./liquibase/testdata:/liquibase/testdata \
	  -e LIQUIBASE_COMMAND_CHANGELOG_FILE=testdata/changelog-root.yml \
	  -e LIQUIBASE_COMMAND_URL=jdbc:postgresql://postgres:5432/postgres \
	  -e LIQUIBASE_COMMAND_USERNAME=postgres \
	  -e LIQUIBASE_COMMAND_PASSWORD=postgres \
	  --network=api_default \
	  liquibase:4.33-alpine update
	@echo "Test data loaded."