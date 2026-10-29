import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GetPromptResult } from "@modelcontextprotocol/sdk/types";

import { z } from "zod";


const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

const server = new McpServer({
    name: "Dev-MCP",
    version: "1.0.0",
});



server.registerPrompt("greeting-example", {
    title: "Greeting Template",
    description: "A simple greeting prompt template",
    argsSchema: { 
        name: z
        .string()
        .describe("The name of the person to greet"),
    }
},
    async ({ name }): Promise<GetPromptResult> => {
        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: "text",
                        text: `Please greet ${name}! in a friendly manner and say hola everytime.`,
                    }
                },
            ],
        };
    }
);

server.registerPrompt("student_list", {
    title: "Student List Template",
    description: "A simple template to get a list of students",
    argsSchema: { 
        limit: z
        .string()
        .describe("The number of student"),
    }
},
    async ({ limit }): Promise<GetPromptResult> => {
        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: "text",
                        text: `give me the list of ${limit} students in LMS`,
                    }
                },
            ],
        };
    }
);
// Build a server instance and register its tools. serveStdio calls this
// whenever it needs an instance, so every call must return a fresh one.
function createServer() {
  

  server.registerTool(
    "get_all_students",
    {
      description: "Get list of all students with their enrollment information",
      inputSchema: z.object({
        limit: z
          .number()
          .optional()
          .describe("Maximum number of students to return"),
      }),
    },
    async ({ limit }) => {
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const students = [
          {
            id: 1,
            name: "Alice",
            email: "a@b.com",
            enrollmentDate: lastMonth,
          },
          {
            id: 2,
            name: "Bob",
            email: "b@b.com",
            enrollmentDate: yesterday,
          },
          {
            id: 3,
            name: "Charlie",
            email: "c@b.com",
            enrollmentDate: lastWeek,
          },
          {
            id: 4,
            name: "Diana",
            email: "d@b.com",
            enrollmentDate: today,
          },
          {
            id: 5,
            name: "Eve",
            email: "e@b.com",
            enrollmentDate: lastMonth,
          },
          {
            id: 6,
            name: "Frank",
            email: "f@b.com",
            enrollmentDate: yesterday,
          },
          {
            id: 7,
            name: "Grace",
            email: "g@b.com",
            enrollmentDate: lastWeek,
          },
          {
            id: 8,
            name: "Hank",
            email: "h@b.com",
            enrollmentDate: today,
          },
          {
            id: 9,
            name: "Ivy",
            email: "i@b.com",
            enrollmentDate: lastMonth,
          },
          {
            id: 10,
            name: "John",
            email: "j@b.com",
            enrollmentDate: yesterday,
          },
          {
            id: 11,
            name: "Kevin",
            email: "k@b.com",
            enrollmentDate: lastWeek,
          },
          {
            id: 12,
            name: "Larry",
            email: "l@b.com",
            enrollmentDate: today,
          },
        ]
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(students.slice(0, limit), null, 2),
          },
        ],
      };
    },
  );

  return server;
}


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Connected to Dev MCP Server on stdio");
}

main().catch((error) =>{
    console.error(error)
    process.exit(1)
});