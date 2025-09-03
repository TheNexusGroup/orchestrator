# CLAUDE.md - Vazio Orchestrator Project

## Project Information
- **Name**: Vazio
- **Path**: /home/persist/repos/work/vazio/coderific
- **Description**: Web Application Orchestrator Singleton with dynamic state management and REST/WebSocket integration
- **Status**: New Project - Foundation Phase
- **Repository**: Not initialized (pending)

## Overview
Vazio is an orchestrator singleton class designed to manage web application state with comprehensive integration capabilities. The project combines modern web technologies (Routify, Svelte, Vite) with robust backend state management, providing dynamic object transport, programmable hooks, and multi-format data handling.

## Core Objectives
1. **Orchestrator Singleton**: Central state management system with WebSocket and REST API integration
2. **Dynamic Interface**: Programmable hooks for accessing store objects using dynamic prototype and static middleware
3. **Data Processing**: Support for JSON, YAML, and CSV parsing with file upload/navigation capabilities
4. **Modern UI**: Responsive interface using Routify + Svelte + Vite + TailwindCSS + TypeScript
5. **Server Infrastructure**: Robust server running on port 9292

## Technical Requirements

### Backend Components
- **Orchestrator Singleton Class**: Core state management system
- **WebSocket API Integration**: Real-time communication hooks
- **RESTful Interface**: Dynamic object transport and connections
- **State Manager Store**: Centralized state with programmable hooks
- **Dynamic Prototype System**: Runtime object access and manipulation
- **Static Middleware**: Request/response processing pipeline
- **Multi-format Parser**: JSON, YAML, and CSV data processing
- **File Operations**: Upload, navigation, and view capabilities

### Frontend Components
- **Routify Router**: Application navigation and routing
- **Svelte Components**: Reactive UI component system
- **Vite Build System**: Fast development and production builds
- **TailwindCSS**: Utility-first styling framework
- **TypeScript**: Type-safe development environment

### Server Specifications
- **Port**: 9292
- **Protocol Support**: HTTP/HTTPS, WebSocket, REST API
- **State Persistence**: Dynamic store management
- **Real-time Updates**: WebSocket-based state synchronization

## Current Phase and Active Agents
- **Current Phase**: Foundation Setup
- **Active Agent**: @agent-coordinator (session management and workflow orchestration)
- **Next Phase**: Analysis and Research

## All Agents and Responsibilities

### Core Process Agents
- **@agent-coordinator**: Session continuity, workflow orchestration, state management
- **@agent-analyzer**: Project state analysis, consolidation, baseline assessment
- **@agent-researcher**: Technical research, library analysis, best practices
- **@agent-planner**: Strategic roadmaps, AGILE/SCRUM frameworks
- **@agent-project_manager**: Sprint coordination, agent delegation, parallel workflows
- **@agent-reviewer**: Quality assessment, standards validation, phase completion
- **@agent-reporter**: Progress documentation, cleanup identification

### Development Specialists
- **@agent-backend_developer**: Orchestrator implementation, WebSocket/REST APIs, state management
- **@agent-frontend_developer**: Svelte components, Routify routing, state integration
- **@agent-database_architect**: Data schema, storage optimization (if required)
- **@agent-api_designer**: WebSocket/REST contract definition, dynamic transport schemas

### Quality & Infrastructure
- **@agent-devops_engineer**: Development server setup, build optimization, deployment
- **@agent-test_engineer**: Unit/integration/E2E testing for orchestrator functionality
- **@agent-performance_engineer**: State management optimization, WebSocket performance
- **@agent-security_auditor**: API security, state access controls, data validation

### Design & Documentation
- **@agent-ui_ux_designer**: Interface design, user flows, TailwindCSS implementation
- **@agent-documentation_writer**: API docs, user guides, technical documentation

## Available Tools
- **mcp__serena__**: Codebase analysis, pattern detection, dependency analysis
- **mcp__context7__**: Library documentation and dependency research
- **mcp__worktree__**: Feature branch management for parallel development
- **mcp__playwright__**: UI testing and validation
- **mcp__nabu__**: Inter-agent communication and status reporting

## Project Rules and Guidelines

### Technical Standards
- **Clean Code**: Maximum 500 lines per file, 50 lines per function, 3 nesting levels
- **State Management**: Stateless components, configuration-driven state
- **Modular Architecture**: SOLID principles, dependency injection, loose coupling
- **TypeScript**: Strict typing for all components and interfaces

### Development Workflow
1. **Analysis Phase**: Baseline assessment and technology research
2. **Research Phase**: Stack validation and best practices identification
3. **Planning Phase**: Architecture design, API contracts, UI/UX specifications
4. **Development Phase**: Implementation of orchestrator and UI components
5. **Testing Phase**: Comprehensive testing including WebSocket and state management
6. **Documentation Phase**: Complete technical and user documentation
7. **Completion Phase**: Final review, optimization, and deployment preparation

### Agent Coordination
- All agents follow Product Development Lifecycle
- Parallel workflows managed through .claude/trees/ worktrees
- Session continuity maintained via SESSION_STATE.md
- Progress tracked through TODO.md and CHANGELOG.md

## Quality Assurance
- Real data and endpoints required (no mock content)
- Containerized solutions preferred for stability
- Maintainability, Correctness, and Efficiency prioritized
- Clean, organized documentation and code structure
- Comprehensive testing before phase completion

## Project Structure (Target)
```
/home/persist/repos/work/vazio/coderific/
├── .claude/
│   ├── context/           # Project coordination files
│   ├── agents/           # Agent specifications
│   └── commands/         # Standardized procedures
├── src/
│   ├── lib/              # Core orchestrator logic
│   ├── components/       # Svelte components
│   ├── routes/          # Routify routes
│   └── stores/          # State management
├── public/              # Static assets
├── server/             # Backend server implementation
├── tests/              # Test suites
├── package.json        # Dependencies
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # TailwindCSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Implementation Priority
1. **Phase 1**: Core orchestrator singleton with basic state management
2. **Phase 2**: WebSocket and REST API integration
3. **Phase 3**: Dynamic prototype and middleware systems
4. **Phase 4**: Frontend UI with Routify + Svelte
5. **Phase 5**: File processing and data parsing capabilities
6. **Phase 6**: Testing, optimization, and documentation

## Next Steps
1. Deploy @agent-analyzer for comprehensive baseline assessment
2. Initialize git repository for version control
3. Deploy @agent-researcher for technology stack validation
4. Create detailed project roadmap and AGILE framework
5. Begin systematic implementation through specialized agents