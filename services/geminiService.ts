
import { GoogleGenAI } from "@google/genai";
import type { ServerConfig } from '../types';

export const getTroubleshootingAdvice = async (serverConfig: ServerConfig | null): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured. Please set the API_KEY environment variable.";
  }

  if (!serverConfig) {
    return "No server is selected. Please select a server configuration to troubleshoot.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    I am a user of a VPN client and I'm having trouble connecting. Here is my configuration:
    - Protocol: ${serverConfig.protocol}
    - Server Address: ${serverConfig.address}
    - Server Port: ${serverConfig.port}
    - Details: ${JSON.stringify(serverConfig.details, null, 2)}

    Please provide a concise, step-by-step troubleshooting guide for a non-technical user. 
    Focus on common issues related to this specific protocol (${serverConfig.protocol}).
    Format the output as a simple list. Do not use markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't get troubleshooting advice at the moment. Please check your network and API key.";
  }
};
