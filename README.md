# Spreadsheet MCP Bot Project

## Table of Contents

1. [About the Project](#about-the-project)
2. [Technologies Used](#technologies-used)
   - [Model Context Protocol (MCP)](#model-context-protocol-mcp)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
   - [Interface](#interface)
   - [mcp_client_api](#mcp_client_api)
   - [mcp_server](#mcp_server)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

---

## About the Project

**Spreadsheet MCP Bot** is a modular, extensible system for interacting with AI models and tools using the Model Context Protocol (MCP). It is designed to facilitate seamless communication between clients, servers, and various tools, enabling advanced AI-driven workflows such as meal planning, recipe suggestions, and more.

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
meal-mcp-bot/
│
├── interface/         # Frontend interface for user interaction
├── mcp_client_api/    # Client API for communicating with MCP server and tools
├── mcp_server/        # Main MCP server handling tool registration and LLM orchestration
```

---

## Installation & Setup

### 1. Interface

```bash
cd interface
yarn install
yarn dev
```
This will start the frontend development server.

---

### 2. mcp_client_api

```bash
cd mcp_client_api
cp .env.sample .env
yarn install
yarn build
```
Configure your `.env` file as needed.

---

### 3. mcp_server

```bash
cd mcp_server
cp .env.sample .env
yarn install
yarn build
```
Configure your `.env` file as needed.  
This will start the MCP server on port 3002 by default.

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