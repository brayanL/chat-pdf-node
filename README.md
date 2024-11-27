# chat-pdf-node
Chat with any PDF in Nodejs.

## Installation
npm install chat-pdf-node

## Prerequisites
It requires an OpenAI developer account and API key.
You can create an Api Key [here](https://platform.openai.com/account/api-keys).

## Usage
Initialize the ChatWithPDF class with the path to the PDF file and the OpenAI API key.
Send a question regarding the information provided in the PDF file.
```
import { ChatWithPDF } from "chat-pdf";

const API_KEY = "your-openai-api-key";
const pdfPath = "path/to/pdf/file.pdf";

const chatWithPDF = new ChatWithPDF(pdfPath, API_KEY);

(async () => {
    try {
        await chatWithPDF.initialize(); // Extract text from the PDF

        const response = await chatWithPDF.askQuestion("What is the document about?");
        console.log("Response:", response);
    } catch (error) {
        console.error("Error:", error);
    }
})();```