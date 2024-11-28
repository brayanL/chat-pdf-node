import ChatGptService from './chat-gpt-service';
import { extractTextFromBuffer, extractTextFromUrl } from './pdf-extractor';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const defaultPrompt =
  'Como experto en ventas con aproximadamente 15 años de experiencia en embudos de ventas y generación de leads, tu tarea es mantener una conversación agradable, responder a las preguntas del cliente sobre nuestros productos. Tus respuestas deben basarse únicamente en el contexto proporcionado:\n' +
  'Para proporcionar respuestas más útiles, puedes utilizar la información proporcionada en la base de datos. El contexto es la única información que tienes. Ignora cualquier cosa que no esté relacionada con el contexto.\n' +
  '### INTRUCCIONES\n' +
  '- Mantén un tono profesional y siempre responde en primera persona.\n' +
  '- NO ofrescas promociones que no existe en la BASE DE DATOS\n' +
  '- Respuestas cortas\n' +
  '- No invites a las personas a agendar una cita.';

export class ChatWithPdf {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly initialPrompt: string;
  private chatGptService: ChatGptService;
  private pdfText: string | null = null;

  private constructor(
    apiKey: string,
    model: string = 'gpt-4o-mini',
    initialPrompt: string = defaultPrompt,
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.initialPrompt = initialPrompt;
    this.chatGptService = new ChatGptService(this.apiKey, this.model);
  }

  static async initialize(
    apiKey: string,
    input: { pdfURL?: string; pdfBuffer?: ArrayBuffer },
    model?: string,
    initialPrompt?: string,
  ) {
    if (!input.pdfURL && !input.pdfBuffer) {
      throw new Error('Either pdfURL or pdfBuffer must be provided.');
    }

    const instance = new ChatWithPdf(apiKey, model, initialPrompt);

    if (input.pdfURL) {
      instance.pdfText = await extractTextFromUrl(input.pdfURL);
    } else if (input.pdfBuffer) {
      instance.pdfText = await extractTextFromBuffer(input.pdfBuffer);
    }

    return instance;
  }

  async askQuestion(userQuestion: string) {
    if (!this.pdfText) {
      throw new Error('PDF text not initialized. Call initialize() first.');
    }

    const messages = [
      { role: 'system', content: this.initialPrompt },
      { role: 'user', content: this.pdfText },
      { role: 'user', content: userQuestion },
    ] as ChatCompletionMessageParam[];

    return await this.chatGptService.createChat(messages);
  }
}
