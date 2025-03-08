# Solana钱包API

这个API提供了Solana钱包的基本功能，包括代币交换和余额查询。

## 环境配置

1. 复制`.env.example`文件并重命名为`.env`
2. 在`.env`文件中填写以下配置：
   - `API_KEY`: API访问密钥
   - `TEST_WALLET_PUBLIC_KEY`: 钱包公钥
   - `TEST_WALLET_PRIVATE_KEY`: 钱包私钥
   - `SOLANA_NETWORK`: Solana网络（默认为devnet）
   - `SOLANA_RPC_ENDPOINT`: Solana RPC端点（可选）

## API端点

### 1. 代币交换

**端点**: `POST /api/wallet/swap`

**请求头**:
```
x-api-key: your_api_key_here
Content-Type: application/json
```

**请求体**:
```json
{
  "inputMint": "代币输入铸币地址",
  "outputMint": "代币输出铸币地址",
  "amount": 数量,
  "slippage": 滑点百分比(可选，默认为1),
  "action": "buy或sell"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "signature": "交易签名",
    "summary": "交易概要",
    "transactionDetails": {
      "fromAddress": "发送地址",
      "inputMint": "输入代币铸币地址",
      "outputMint": "输出代币铸币地址",
      "inputAmount": 输入数量,
      "expectedOutputAmount": "预期输出数量",
      "slippage": 滑点百分比,
      "timestamp": "时间戳",
      "blockTime": 区块时间,
      "slot": 槽位,
      "fee": 交易费用
    }
  },
  "message": "代币购买/出售成功"
}
```

### 2. 查询钱包余额

**端点**: `GET /api/wallet/balance`

**请求头**:
```
x-api-key: your_api_key_here
```

**查询参数**:
- `tokenMint`: (可选) 代币铸币地址，如果提供则返回该代币的余额

**响应示例**:
```json
{
  "success": true,
  "data": {
    "walletAddress": "钱包地址",
    "solBalance": SOL余额,
    "tokenBalance": {
      "mint": "代币铸币地址",
      "amount": "代币数量",
      "decimals": 小数位数,
      "uiAmount": 用户界面显示数量
    }
  },
  "message": "钱包余额查询成功"
}
```

## 错误处理

所有API端点在发生错误时都会返回以下格式的响应：

```json
{
  "success": false,
  "message": "错误描述"
}
```

常见错误状态码：
- `400`: 请求参数错误
- `401`: API密钥无效或缺失
- `500`: 服务器内部错误

## 安全注意事项

- 请确保API密钥和钱包私钥的安全，不要在公共场合泄露
- 建议在生产环境中使用HTTPS加密传输
- 定期更换API密钥以提高安全性