#!/bin/bash
# Flynt Studio - Quick Start Script

echo "🚀 FLYNT STUDIO - Quick Start"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js is installed${NC}"

# Check Python
if ! command -v python &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python is not installed. Please install Python 3.10+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python is installed${NC}"

echo ""
echo -e "${BLUE}Setting up Flynt Studio...${NC}"

# Create directories if needed
mkdir -p frontend
mkdir -p data
mkdir -p logs

# Install backend dependencies
echo ""
echo -e "${BLUE}Installing backend dependencies...${NC}"
pip install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install frontend dependencies
echo ""
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend
npm install > /dev/null 2>&1
cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Create .env if not exists
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
# Flynt Studio Configuration
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
DATABASE_URL=sqlite:///./data/flynt.db
LOG_LEVEL=INFO
EOF
    echo -e "${YELLOW}⚠️  Please add your API keys to .env${NC}"
fi

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. ${YELLOW}Add API keys to .env file${NC}"
echo "   - Get Gemini key: https://makersuite.google.com/app/apikey"
echo "   - Get Groq key: https://console.groq.com/"
echo ""
echo "2. ${YELLOW}Start the backend (Terminal 1)${NC}"
echo "   python -m cli.main init"
echo "   python -m uvicorn main:app --reload"
echo ""
echo "3. ${YELLOW}Start the frontend (Terminal 2)${NC}"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. ${YELLOW}Open in browser${NC}"
echo "   http://localhost:3000"
echo ""
echo -e "${GREEN}Happy building! 🎉${NC}"
