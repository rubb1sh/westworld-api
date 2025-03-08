import { DifyService } from '../DifyService';
import { DifyChatResponse } from '../../interfaces/DifyInterfaces';

// 模拟fetch函数
jest.mock('cross-fetch', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        event: 'message',
        message_id: '9da23599-e713-473b-982c-4328d4f5c78a',
        conversation_id: '45701982-8118-4bc5-8e9b-64562b4555f2',
        mode: 'chat',
        answer: '{"code": "console.log(\'Hello World\')", "assets": ["asset1", "asset2"]}',
        metadata: {
          usage: {
            prompt_tokens: 1033,
            prompt_unit_price: '0.001',
            prompt_price_unit: '0.001',
            prompt_price: '0.0010330',
            completion_tokens: 128,
            completion_unit_price: '0.002',
            completion_price_unit: '0.001',
            completion_price: '0.0002560',
            total_tokens: 1161,
            total_price: '0.0012890',
            currency: 'USD',
            latency: 0.7682376249867957
          }
        },
        created_at: 1705407629
      })
    });
  });
});

describe('DifyService', () => {
  let difyService: DifyService;
  
  beforeEach(() => {
    // 使用测试API密钥初始化服务
    difyService = new DifyService('test-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('应该成功发送聊天消息', async () => {
    const response = await difyService.sendChatMessage({
      query: 'create a snake game',
      response_mode: 'streaming'
    });

    expect(response).toBeDefined();
    expect(response.conversation_id).toBe('45701982-8118-4bc5-8e9b-64562b4555f2');
    expect(response.answer).toBe('{"code": "console.log(\'Hello World\')", "assets": ["asset1", "asset2"]}');
  });

  it('应该正确解析答案', () => {
    const mockResponse: DifyChatResponse = {
      event: 'message',
      message_id: '9da23599-e713-473b-982c-4328d4f5c78a',
      conversation_id: '45701982-8118-4bc5-8e9b-64562b4555f2',
      mode: 'chat',
      answer: '{"code": "console.log(\'Hello World\')", "assets": ["asset1", "asset2"]}',
      metadata: {
        usage: {
          prompt_tokens: 1033,
          prompt_unit_price: '0.001',
          prompt_price_unit: '0.001',
          prompt_price: '0.0010330',
          completion_tokens: 128,
          completion_unit_price: '0.002',
          completion_price_unit: '0.001',
          completion_price: '0.0002560',
          total_tokens: 1161,
          total_price: '0.0012890',
          currency: 'USD',
          latency: 0.7682376249867957
        }
      },
      created_at: 1705407629
    };

    const parsedAnswer = difyService.parseAnswer(mockResponse);
    
    expect(parsedAnswer).toBeDefined();
    expect(parsedAnswer.code).toBe("console.log('Hello World')");
    expect(parsedAnswer.assets).toEqual(['asset1', 'asset2']);
  });

  it('应该处理解析错误', () => {
    const mockResponse: DifyChatResponse = {
      event: 'message',
      message_id: '9da23599-e713-473b-982c-4328d4f5c78a',
      conversation_id: '45701982-8118-4bc5-8e9b-64562b4555f2',
      mode: 'chat',
      answer: 'invalid json',
      metadata: {
        usage: {
          prompt_tokens: 1033,
          prompt_unit_price: '0.001',
          prompt_price_unit: '0.001',
          prompt_price: '0.0010330',
          completion_tokens: 128,
          completion_unit_price: '0.002',
          completion_price_unit: '0.001',
          completion_price: '0.0002560',
          total_tokens: 1161,
          total_price: '0.0012890',
          currency: 'USD',
          latency: 0.7682376249867957
        }
      },
      created_at: 1705407629
    };

    const parsedAnswer = difyService.parseAnswer(mockResponse);
    
    expect(parsedAnswer).toBeDefined();
    expect(parsedAnswer.code).toBe('');
    expect(parsedAnswer.assets).toEqual([]);
  });

  it('应该成功生成代码', async () => {
    const result = await difyService.generateCode('create a snake game');
    
    expect(result).toBeDefined();
    expect(result.code).toBe("console.log('Hello World')");
    expect(result.assets).toEqual(['asset1', 'asset2']);
  });
}); 