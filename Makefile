.PHONY: build install-backend install-frontend build-frontend clean

# Build everything
build: install-backend install-frontend build-frontend
	@echo "✅ Build completed successfully!"

# Install Python dependencies
install-backend:
	@echo "📦 Installing Python dependencies..."
	cd backend && pip install -r requirements.txt

# Install Node.js dependencies
install-frontend:
	@echo "📦 Installing Node.js dependencies..."
	cd frontend && npm install

# Build React frontend
build-frontend:
	@echo "🔨 Building React frontend..."
	cd frontend && npm run build

# Clean build artifacts
clean:
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf backend/__pycache__

