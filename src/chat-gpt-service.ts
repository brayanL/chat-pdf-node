import { ChatCompletionMessageParam } from 'openai/resources/chat';
import OpenAI from 'openai';

export default class ChatGptService {
  private openai: OpenAI;
  private model: string;
  private temperature = 0;
  private maxTimeout = 15 * 1000;

  constructor(apiKey: string, model: string, temperature = 0) {
    if (!apiKey) {
      throw new Error('OPENAI_KEY is missing');
    }

    this.openai = new OpenAI({ apiKey, timeout: this.maxTimeout });
    this.model = model;
    this.temperature = temperature;
  }

  async createChat(messages: ChatCompletionMessageParam[], model?: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        messages,
        temperature: this.temperature,
        max_tokens: 300,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error('CHAT-GPT ERROR: ', err);
      return 'ERROR';
    }
  }
}
