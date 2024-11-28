# chat-pdf-node

Chat with any PDF in Nodejs.

## Installation

npm install chat-pdf-node

## Prerequisites

It requires an OpenAI developer account and API key. You can create an Api Key
[here](https://platform.openai.com/account/api-keys).

## Usage

Initialize the ChatWithPDF class with the URL to the PDF file and the OpenAI API key. Send a
question regarding the information provided in the PDF file.

````
import { ChatWithPDF } from "chat-pdf-node";

async function talkWithPDF(pdfPath: string, userQuestion: string) {
  const API_KEY = 'XXXX';
  const chatPDF = await ChatWithPdf.initialize(API_KEY, { pdfURL: pdfPath });
  const response = await chatPDF.askQuestion(userQuestion);

  console.log(response);
}

talkWithPDF('http://some.repository/my-business.pdf', '¿What are your products?');
````

Also is possible to provide the PDF file as a Buffer.

````
const chatPDF = await ChatWithPdf.initialize(API_KEY, { pdfBuffer: myPDFAsBufferHere });
````
