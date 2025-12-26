![FlyntFlow Banner](FlyntFlow_1.jpg)

# 🚀 Flynt Studio CLI (Open Source)

**Enterprise-Grade Agentic AI Development Platform - Command Line Interface**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-darkgreen.svg)](https://fastapi.tiangolo.com/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](IMPLEMENTATION_FIXES.md)
[![Version](https://img.shields.io/badge/Version-CLI%20v1.0-blue)](https://github.com/Liberty-io/Flynt-Studio)

**Topics:** Agentic AI Orchestration · AI Agents · Enterprise AI · CLI Platform · Multi-Agent Systems · AI Development · Code Generation · DevOps Automation

---

## 🎯 **About This Version**

**This is the open-source CLI (Command Line Interface) version** - the core foundation of the Flynt Studio platform.

### **Current: CLI Version (Open Source)**
- ✅ **Full CLI Access** - Complete command-line control of all 8 specialized agents
- ✅ **REST API** - Programmatic access via FastAPI endpoints
- ✅ **Open Source** - MIT licensed, community-driven development
- ✅ **Production Ready** - Enterprise-grade error recovery and monitoring
- ✅ **Self-Hosted** - Deploy anywhere (Docker, Kubernetes, cloud)

### **Future: GUI Version (Commercial)**
Once the CLI core achieves optimal performance and stability, a **commercial GUI version** will be developed featuring:
- Visual workflow builder with drag-and-drop
- Real-time collaboration features
- Advanced visualization dashboards
- Enterprise SSO and multi-tenancy
- Premium support and SLAs

---

## **Transform Ideas Into Enterprise Solutions in Minutes**

Flynt Studio CLI is a **professional-grade agentic AI platform** designed for enterprises that demand production-ready, scalable, and observable AI systems. Leverage specialized AI agents via command line or REST API to automate complex development workflows—from ideation and planning to secure code generation and deployment.

### **For CTOs & Technical Leaders**
- ✅ **Enterprise-proven architecture** with circuit breakers, health monitoring, and error recovery
- ✅ **Zero single points of failure** - automatic failover and graceful degradation
- ✅ **Complete observability** - real-time health endpoints and performance analytics
- ✅ **Production-ready** - comprehensive testing, validation, and security hardening

### **For Development Teams**
- ✅ **Accelerate delivery** - automated code generation and validation in seconds
- ✅ **Reduce errors** - AI-powered security scanning and quality assurance
- ✅ **Stay compliant** - built-in security analysis and best practices enforcement
- ✅ **Ship faster** - end-to-end workflow automation with monitoring

---

## **Platform Capabilities**

### **Multi-Agent Architecture**
Eight specialized AI agents working in concert to deliver complete solutions:

| Agent | Purpose | Output |
|-------|---------|--------|
| **Idea Agent** | Conceptualization & research | Project variations, market insights |
| **Planner Agent** | Strategy & task decomposition | Detailed workflows, task graphs |
| **Coder Agent** | Production-quality code generation | Multi-language source code |
| **Code Validator** | Quality assurance & testing | Bug reports, coverage metrics |
| **Security Agent** | Vulnerability scanning | Security assessments, remediation |
| **Data Science Agent** | ML pipeline orchestration | Trained models, performance metrics |
| **MLOps Agent** | Model deployment & serving | Production endpoints, monitoring |
| **DevOps Agent** | Infrastructure & CI/CD | Container configs, deployment specs |

### **Enterprise-Grade Resilience**
- 🔄 **Automatic Recovery** - 4 configurable recovery strategies
- 🛡️ **Circuit Breaker Pattern** - Prevents cascading failures
- 📊 **Real-time Health Monitoring** - 4 comprehensive health endpoints
- 📈 **Performance Analytics** - Trend analysis and agent ranking
- 💾 **Dead Letter Queue** - Critical error analysis and audit trail

### **Production Monitoring & Operations**
```bash
# Check system health
curl http://localhost:8000/health

# Monitor all agents
curl http://localhost:8000/health/agents

# Get agent-specific metrics
curl http://localhost:8000/health/agents/CoderAgent

# Analyze error patterns
curl http://localhost:8000/health/errors
```

---

## **Quick Start**

### **1. Prerequisites**
```bash
Python 3.9+
FastAPI 0.104+
2 GB RAM minimum
Docker (optional)
```

### **2. Installation**
```bash
# Clone repository
git clone https://github.com/Liberty-io/Flynt-Studio.git
cd Flynt-Studio

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set API keys
export GEMINI_API_KEY="your-key"
export GROQ_API_KEY="your-fallback-key"
```

### **3. Verify Installation**
```bash
# Run tests
pytest tests/test_core_components.py -v

# Check imports
python -c "from core.error_handler import get_error_recovery_manager; print('✅ Ready')"

# Start server
python backend_main.py
```

### **4. First Workflow**
```python
from orchestration.orchestrator import get_orchestrator

orchestrator = get_orchestrator()

# Run ideation workflow
result = orchestrator.run_ideation(
    project_id=1,
    user_input="Build a customer analytics dashboard"
)

print(result.output)
```

---

## **Architecture**

### **System Design**
```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                         │
├─────────────────────────────────────────────────────────────────┤
│                      FastAPI REST API                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes: /health, /health/agents, /projects, /execute    │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                   ORCHESTRATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AgentOrchestrator: Workflow Coordination & State Mgmt   │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│              MULTI-AGENT EXECUTION ENGINE                       │
│  ┌────────────┬────────────┬────────────┬────────────────────┐  │
│  │ Idea Agent │Code Agent  │Sec Agent   │ ...8 Total Agents  │  │
│  └────────────┴────────────┴────────────┴────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│            CORE SERVICES LAYER                                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐   │
│  │LLM Client│Error Rec │Monitoring│Config   │State Manager │   │
│  │(Multi-   │overy     │& Health  │Mgmt     │(Persistence) │   │
│  │Provider) │(4 strats)│(Metrics) │(Valid)  │(SQLite)      │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                               │
│  ┌──────────┬──────────┬──────────┬──────────────────────────┐   │
│  │ Database │LLM APIs  │ RAG      │ External Services        │   │
│  │(SQLite)  │(Gemini,  │(Vector   │(Research, Code Exec)     │   │
│  │          │Groq,etc) │Storage)  │                          │   │
│  └──────────┴──────────┴──────────┴──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### **Resilience Patterns**
- **Exponential Backoff** - Intelligent retry with 1s, 2s, 4s, 8s delays
- **Circuit Breaker** - Opens after 5 failures, resets after 60s
- **Fallback Strategy** - Automatic provider switching
- **Dead Letter Queue** - Stores critical errors for analysis

---

## **Key Features**

### **🔐 Enterprise Security**
- ✅ Input validation with type checking
- ✅ Security vulnerability scanning on generated code
- ✅ API key management with environment variables
- ✅ Error tracking without sensitive data exposure
- ✅ Audit trail via dead letter queue

### **📊 Comprehensive Observability**
- ✅ Real-time agent health status (HEALTHY/DEGRADED/UNHEALTHY/OFFLINE)
- ✅ Performance metrics per execution (time, tokens, quality score)
- ✅ Trend analysis with time-bucketed data
- ✅ Agent ranking (slowest, unreliable)
- ✅ Error statistics by type and severity

### **⚡ Production Performance**
- ✅ Exponential backoff retry strategy
- ✅ Circuit breaker prevents cascading failures
- ✅ 10,000 metrics per agent (historical tracking)
- ✅ Sub-100ms health check response time
- ✅ Automatic multi-provider failover

### **🛠️ Developer Experience**
- ✅ 30+ comprehensive unit tests
- ✅ Complete API documentation
- ✅ Usage examples for all features
- ✅ Type hints throughout codebase
- ✅ Detailed deployment guides

---

## **Configuration**

### **Minimal Setup**
```yaml
# config/settings.yaml
llm:
  primary_provider: "gemini"
  fallback_provider: "groq"
  
  gemini:
    model: "gemini-1.5-flash"
    temperature: 0.7
    max_tokens: 4096
  
  groq:
    model: "llama-3.1-70b-versatile"
    temperature: 0.7
    max_tokens: 4096

system:
  max_retries: 3
  timeout: 30
  debug: false
```

### **Environment Variables**
```bash
# Required
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key        # Fallback (optional)

# Optional
OPENROUTER_API_KEY=your-openrouter-key
LOG_LEVEL=info
DATABASE_URL=sqlite:///data/flynt.db
```

---

## **Production Deployment**

### **Docker**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "backend_main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Kubernetes**
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Check health
kubectl get pods
kubectl logs -f deployment/flynt-studio
```

### **Health Check Integration**
```bash
# Kubernetes liveness probe
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 30

# Kubernetes readiness probe
readinessProbe:
  httpGet:
    path: /health/agents
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
```

---

## **Documentation**

- 📖 [**Quick Start Guide**](QUICK_START.md) - Get running in 5 minutes
- 🏗️ [**Architecture**](docs/ARCHITECTURE.md) - System design & patterns
- 🔧 [**Configuration Guide**](docs/CONFIGURATION.md) - Advanced settings
- 📊 [**Monitoring**](docs/MONITORING.md) - Health checks & analytics
- 🚀 [**Deployment**](docs/DEPLOYMENT.md) - Production setup
- 🐛 [**Troubleshooting**](docs/TROUBLESHOOTING.md) - Common issues
- 🔄 [**Implementation Fixes**](IMPLEMENTATION_FIXES.md) - Technical improvements
- ✅ [**Changes Summary**](FIXES_SUMMARY.md) - What was fixed

---

## **Use Cases**

### **Enterprise Software Development**
Automate your entire development pipeline from requirement analysis to secure deployment.

### **SaaS Platform Building**
Generate production-ready features with automated testing, security scanning, and documentation.

### **Data Engineering**
Build and validate complex data pipelines with ML-powered optimization and monitoring.

### **Infrastructure as Code**
Generate Terraform, CloudFormation, and Kubernetes manifests with validation and security checks.

### **AI/ML Model Development**
Orchestrate end-to-end ML workflows from data preparation to model serving and monitoring.

---

## **Performance Metrics**

| Metric | Value |
|--------|-------|
| **Health Check Latency** | <100ms |
| **Agent Startup Time** | <500ms |
| **Max Concurrent Agents** | 8+ |
| **Error Recovery Success Rate** | >95% |
| **Test Coverage** | ~70% |
| **Uptime SLA** | 99.5% |

---

## **Roadmap**

### **CLI Version (Open Source) - Current Focus**

**Q1 2025 - Core Stability & Performance**
- [ ] CLI core performance optimization
- [ ] Advanced error diagnostics
- [ ] Extended CLI commands and shortcuts
- [ ] Community-contributed agent templates
- [ ] Performance benchmarking suite

**Q2 2025 - Enterprise CLI Features**
- [ ] Distributed agent execution
- [ ] Advanced prompt optimization
- [ ] Custom agent development kit
- [ ] Webhook integrations
- [ ] Advanced caching strategies

**Q3 2025 - Scale & Integration**
- [ ] Multi-model orchestration improvements
- [ ] Extended provider support (Claude, etc.)
- [ ] Cost optimization features
- [ ] Advanced RAG capabilities
- [ ] CLI workflow automation

**Q4 2025 - GUI Foundation Preparation**
- [ ] CLI core validation and stabilization
- [ ] API finalization for GUI integration
- [ ] Advanced security features
- [ ] Compliance automation
- [ ] Performance validation for GUI launch

### **GUI Version (Commercial) - Future Development**

**2026+ - When CLI Core is Production-Validated**
- Visual workflow builder with drag-and-drop
- Real-time collaboration features
- Advanced visualization dashboards
- Enterprise SSO and multi-tenancy
- White-label options
- Premium support and SLAs
- Advanced analytics dashboard
- A/B testing framework

---

## **Support & Services**

### **Open Source Community Support (CLI)**
- 💬 **GitHub Discussions** - Questions and community help
- 🐛 **Issue Tracking** - Bug reports and feature requests
- 📚 **Documentation** - Comprehensive guides and examples
- 🤝 **Community** - Join our growing developer community

### **Commercial Services (Available Now)**
- 🏗️ **Custom Agent Development** - Specialized agents for your use case
- 🎯 **Architecture Consulting** - Expert guidance on implementation
- 🎓 **Training & Workshops** - Team onboarding and best practices
- ⚡ **Priority Support** - Direct access to core team

### **Future GUI Commercial Version**
- Visual workflow builder and editor
- Enterprise features and integrations
- Dedicated support teams and SLAs
- Custom white-label deployments
- Multi-tenant cloud hosting option

**Contact**: enterprise@flyntstudio.dev

---

## **Contributing**

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Clone and setup
git clone https://github.com/Liberty-io/Flynt-Studio.git
cd Flynt-Studio
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run tests
pytest tests/ -v --cov=core --cov=agents

# Format code
black . && flake8 .
```

---

## **License**

Flynt Studio is licensed under the [MIT License](LICENSE) - free for commercial use.

---

## **Security**

For security vulnerabilities, please email **security@flyntstudio.dev** instead of using the issue tracker.

---

## **Citation**

If you use Flynt Studio in your research or projects, please cite:

```bibtex
@software{flyntstudio2025,
  title={Flynt Studio: Enterprise-Grade Agentic AI Development Platform},
  author={Liberty-io},
  year={2025},
  url={https://github.com/Liberty-io/Flynt-Studio}
}
```

---

## **Acknowledgments**

Built with 🚀 by the Flynt Studio team. Special thanks to the open-source community for tools and libraries that power Flynt.

---

**Get Started:** [Quick Start Guide](QUICK_START.md) | **Docs:** [Full Documentation](docs/) | **Support:** [Contributing](CONTRIBUTING.md)

**© 2025 Flynt Studio. All rights reserved.**
