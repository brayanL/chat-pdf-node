import ChatGptService from "./chat-gpt-service";
import {extractText} from "./pdf-extractor";
import {ChatCompletionMessageParam} from "openai/resources/chat";

const defaultPrompt = 'Como experto en ventas con aproximadamente 15 años de experiencia en embudos de ventas y generación de leads, tu tarea es mantener una conversación agradable, responder a las preguntas del cliente sobre nuestros productos. Tus respuestas deben basarse únicamente en el contexto proporcionado:\n' +
  'Para proporcionar respuestas más útiles, puedes utilizar la información proporcionada en la base de datos. El contexto es la única información que tienes. Ignora cualquier cosa que no esté relacionada con el contexto.\n' +
  '### INTRUCCIONES\n' +
  '- Mantén un tono profesional y siempre responde en primera persona.\n' +
  '- NO ofrescas promociones que no existe en la BASE DE DATOS\n' +
  '- Respuestas cortas\n' +
  '- No invites a las personas a agendar una cita.';

export class ChatWithPdf {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly pdfPath: string;
  private readonly initialPrompt: string;
  private chatGptService: ChatGptService;
  private pdfText: string | null = null;

  constructor(pdfPath: string, apiKey: string, model: string = "gpt-4o-mini", initialPrompt: string = defaultPrompt) {
    this.pdfPath = pdfPath;
    this.apiKey = apiKey;
    this.model = model;
    this.initialPrompt = initialPrompt;
    this.chatGptService = new ChatGptService(this.apiKey, this.model);
  }

  async initialize() {
    this.pdfText = await extractText(this.pdfPath);
    console.log("PDF text extracted successfully.");
  }

  async askQuestion(userQuestion: string) {
    if (!this.pdfText) {
      throw new Error("PDF text not initialized. Call initialize() first.");
    }

    const messages = [
      {role: 'system', content: this.initialPrompt},
      {role: 'user', content: this.pdfText},
      {role: 'user', content: userQuestion}
    ] as ChatCompletionMessageParam[];

    return await this.chatGptService.createChat(messages);
  }
}