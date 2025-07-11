# Spreadsheet MCP Bot Project

## Table of Contents

1. [About the Project](#about-the-project)
2. [Technologies Used](#technologies-used)
   - [Model Context Protocol (MCP)](#model-context-protocol-mcp)
3. [Project Structure](#project-structure)
4. [Technologies](#technologies)
   - [Core Stack](#core-stack)
   - [AI & ML Integration](#ai--ml-integration)
   - [Development Tools](#development-tools)
5. [Installation](#installation)
   - [Clone the Repository](#1-clone-the-repository)
   - [Install Dependencies](#2-install-dependencies)
6. [Configuration](#configuration)
   - [Environment Setup](#environment-setup)
     - [MCP Server Configuration](#mcp-server-configuration)
     - [MCP Client API Configuration](#mcp-client-api-configuration)
   - [Generating Required API Keys and Tokens](#generating-required-api-keys-and-tokens)
     - [OpenAI API Key (OPEN_API_KEY)](#openai-api-key-open_api_key)
     - [GitHub Personal Access Token (GITHUB_TOKEN)](#github-personal-access-token-github_token)
7. [Running the project](#running-the-project)
   - [Interface](#interface)
   - [mcp_server](#mcp_server)
   - [mcp_client_api](#mcp_client_api)
8. [Usage](#usage)
9. [Contributing](#contributing)
10. [License](#license)

---

## About the Project

**Spreadsheet MCP Bot** is a modular, extensible system for interacting with AI models and tools using the Model Context Protocol (MCP). It is designed to facilitate seamless communication between clients, servers, and various tools, enabling advanced AI-driven workflows such as meal planning, recipe suggestions, and more.

> **⚠️ Disclaimer:**  
> This project is designed to read spreadsheet data for the meal management system of our mess.  
> If you run the project as-is, the LLM responses will not provide data about your own spreadsheet.  
> To use your own spreadsheet or customize functionality, please modify the relevant code in the `mcp_server` directory.

---

## Technologies Used

- **Node.js** & **TypeScript**: Core backend and API logic.
- **Express.js**: HTTP server for API endpoints.
- **Model Context Protocol (MCP)**: A protocol for tool-augmented AI model interactions.
- **OpenAI API**: For LLM-powered responses.
- **dotenv**: Environment variable management.
- **Yarn**: Dependency management and scripts.

### Model Context Protocol (MCP)

MCP is a protocol that enables AI models to interact with external tools and services in a structured, extensible way. It allows for dynamic tool registration, tool calling, and streaming responses, making it ideal for building advanced AI applications that require real-world data or actions.

---

## Project Structure

```
spreadsheet-mcp-bot/
│
├── interface/         # Frontend interface for user interaction
├── mcp_client_api/    # Client API for communicating with MCP server and tools
├── mcp_server/        # Main MCP server handling tool registration and LLM orchestration
```

---

## Technologies

### Core Stack
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe development
- **Express.js** - Web framework for API endpoints
- **React** - Frontend user interface

### AI & ML Integration
- **Model Context Protocol (MCP)** - Tool-augmented AI interactions
- **OpenAI API** - GPT model integration
- **Ollama** - Local LLM execution support

### Development Tools
- **Yarn** - Package management
- **dotenv** - Environment configuration
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/spreadsheet-mcp-bot.git
cd spreadsheet-mcp-bot
```

### 2. Install Dependencies

#### Frontend Interface
```bash
cd interface
yarn install
```

#### MCP Server
```bash
cd ../mcp_server
yarn install
```

#### MCP Client API
```bash
cd ../mcp_client_api
yarn install
```

## Configuration

### Environment Setup

#### MCP Server Configuration
```bash
cd mcp_server
cp .env.sample .env
```

Configure your `.env` file:
```env
PORT=3002
NODE_ENV=development
# Add other configuration variables as needed
```

#### MCP Client API Configuration
```bash
cd mcp_client_api
cp .env.sample .env
```

Configure your `.env` file:
```env
# Server Configuration
PORT=3002

# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token

# OpenAI Configuration
OPEN_API_KEY=your_openai_api_key_here

# MCP Server Configuration
MCP_SERVER_ENDPOINT=http://localhost:3002/mcp
```

### Generating Required API Keys and Tokens

#### OpenAI API Key (OPEN_API_KEY)

1. **Create an OpenAI Account**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account

2. **Generate API Key**
   - Navigate to the [API Keys section](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Provide a name for your key (e.g., "Spreadsheet MCP Bot")
   - Copy the generated key (starts with `sk-proj-` or `sk-`)
   - **Important**: Save this key securely as it won't be shown again

3. **Add Billing Information**
   - Go to [Billing settings](https://platform.openai.com/account/billing)
   - Add a payment method
   - Set up usage limits if desired

4. **Verify Your Setup**
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

#### GitHub Personal Access Token (GITHUB_TOKEN)

1. **Access GitHub Token Settings**
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Or navigate: Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token" → "Generate new token (classic)"
   - Provide a descriptive name (e.g., "Spreadsheet MCP Bot")
   - Set expiration (recommended: 90 days or custom)

3. **Select Required Scopes**
   For this project, you'll typically need:
   - `repo` - Full control of private repositories
   - `read:user` - Read user profile data
   - `user:email` - Access user email addresses
   - `read:org` - Read organization membership (if applicable)

4. **Generate and Copy Token**
   - Click "Generate token"
   - Copy the token (starts with `ghp_`)
   - **Important**: Save this token securely as it won't be shown again

5. **Test Your Token**
   ```bash
   curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
     https://api.github.com/user


## Running the project

### Interface

```bash
yarn dev
```

### mcp_server

```bash
yarn build
```

### mcp_client_api
We will use different types of models here like llama, gpt etc.


* If you want to run with llama model by running on your own machine, then first run the llama model by ollama tool. 
Follow [https://medium.com/cyberark-engineering/how-to-run-llms-locally-with-ollama-cb00fa55d5de](This) blog to run the model.

After running the model, run the client_api_server:

```
yarn llama
```

* Otherwise, if you want to use openai's model like gpt, then: 
```
yarn openai
```

No extra steps needed if you run openai's model!

---

## Usage

- Start the MCP server and client API as described above.
- Use the interface to interact with the bot, send prompts, and receive AI-powered responses with tool augmentation.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

This project is licensed under the MIT

