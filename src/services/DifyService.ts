import fetch from 'cross-fetch';
import { DifyChatRequest, DifyChatResponse, DifyParsedAnswer } from '../interfaces/DifyInterfaces';

export class DifyService {
  private readonly apiUrl: string = 'https://api.dify.ai/v1/chat-messages';
  private readonly apiKey: string;

  constructor(apiKey: string = process.env.DIFY_API_KEY || '') {
    if (!apiKey) {
      throw new Error('Dify API密钥未提供');
    }
    this.apiKey = apiKey;
  }

  /**
   * 发送聊天请求到Dify API
   * @param request 聊天请求参数
   * @returns 聊天响应
   */
  async sendChatMessage(request: DifyChatRequest): Promise<DifyChatResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dify API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json() as DifyChatResponse;
    } catch (error) {
      console.error('发送聊天消息时出错:', error);
      throw error;
    }
  }

  /**
   * 解析Dify API返回的答案
   * @param response Dify API响应
   * @returns 解析后的答案
   */
  parseAnswer(response: DifyChatResponse): DifyParsedAnswer {
    try {
      // 尝试解析JSON字符串
      return JSON.parse(response.answer) as DifyParsedAnswer;
    } catch (error) {
      console.error('解析Dify答案时出错:', error);
      // 如果解析失败，返回默认值
      return {
        code: '',
        assets: []
      };
    }
  }

  /**
   * 发送聊天请求并解析结果
   * @param query 用户查询
   * @param conversationId 可选的会话ID
   * @param userId 可选的用户ID
   * @param inputs 可选的输入参数
   * @returns 解析后的答案
   */
  async generateCode(
    query: string,
    conversationId: string = '',
    userId: string = 'default-user',
    inputs: Record<string, any> = {}
  ): Promise<DifyParsedAnswer> {
    const request: DifyChatRequest = {
      inputs,
      query,
      response_mode: 'streaming',
      conversation_id: conversationId,
      user: userId
    };

    const response = await this.sendChatMessage(request);
    return this.parseAnswer(response);
  }
} 