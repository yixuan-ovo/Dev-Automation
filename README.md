# Dev-Automation

开发自动化工具和脚本集合，包含订阅转换、云服务配置等自动化部署方案。

## 📁 项目结构

```
Dev-Automation/
└── CloudFLare_Worker/    # CloudFlare Worker 订阅转换服务
```

## 🛠️ 组件介绍

### CloudFlare Worker 订阅转换

基于 CloudFlare Workers 的订阅转换服务，支持配置模板和后端订阅转换。

**主要功能：**
- 订阅格式转换（Clash、V2Ray、Surge 等）
- 配置模板自定义
- KV 存储管理订阅链接
- 自定义域名绑定
- 免费额度充足

**相关文档：**
- [CloudFlare Worker 配置教程](./CloudFLare_Worker/CF-Worker.md)

**关键配置：**
- 环境变量：`BUCKEND` - 订阅转换服务地址
- KV 命名空间：`SUB_BUCKET` - 存储订阅链接
- 支持自定义域名绑定
- 免费版：每月 100,000 次请求

## 🔧 快速开始

### CloudFlare Worker 部署

1. **注册 CloudFlare 账号**
   - 访问 [CloudFlare](https://cloudflare.com)
   - 选择免费版套餐

2. **创建 Workers**
   - 参考 [CloudFlare Worker 配置教程](./CloudFLare_Worker/CF-Worker.md)
   - 创建新的 Workers 服务
   - 配置环境变量和代码

3. **创建 KV 命名空间**
   - 创建 KV 存储空间
   - 绑定到 Workers（变量名：`SUB_BUCKET`）

4. **绑定自定义域名（可选）**
   - 在 CloudFlare 添加站点
   - 配置 DNS 服务器
   - 绑定 Workers 到自定义域名

## 📝 配置要点

### Workers 配置

- **环境变量**：`BUCKEND` 指向订阅转换服务地址
- **代码部署**：使用项目提供的 `worker.js` 代码
- **KV 绑定**：变量名必须为 `SUB_BUCKET`

### 域名配置

- **DNS 服务器**：修改为 CloudFlare 分配的 DNS 服务器
- **自定义域**：支持二级域名绑定（如 `workers.你的域名`）
- **HTTPS**：自定义域自带 HTTPS 证书

### 订阅转换

- **后端服务**：需要自建 subconverter 服务
- **模板配置**：支持配置模板自定义
- **链接拼接**：参考订阅链接转换拼接教程

## ⚠️ 注意事项

1. **免费额度**
   - Workers：每月 100,000 次请求
   - KV：每月 100,000 次读取
   - 对于个人使用完全足够

2. **域名绑定**
   - 需要将域名的 DNS 服务器改为 CloudFlare
   - 等待 DNS 生效可能需要一些时间
   - 可以禁用 `workers.dev` 链接（需要过墙）

3. **订阅转换**
   - 需要先部署 subconverter 服务
   - 环境变量 `BUCKEND` 指向转换服务地址
   - 支持一个链接同时实现模板和订阅转换

4. **R2 存储（可选）**
   - 如需使用 R2 对象存储，需要绑定信用卡
   - 免费版 KV 已足够个人使用

## 🔄 更新日志

### 2025-08-27
- 初始版本发布

## 📚 相关资源

- [CloudFlare Workers 官方文档](https://developers.cloudflare.com/workers/)
- [CloudFlare KV 存储文档](https://developers.cloudflare.com/kv/)
- [subconverter 官方仓库](https://github.com/tindy2013/subconverter)
- [项目参考来源](https://github.com/yixuan-ovo/CF-Worker)
- [github release、archive以及项目文件的加速](https://github.com/yixuan-ovo/gh-proxy)
- [利用CF Worker搭建的反代订阅转换](https://github.com/yixuan-ovo/CF-Worker)
- [Docker镜像转存阿里云](https://github.com/yixuan-ovo/docker_image_pusher)

## 📄 许可证

本项目仅用于学习和研究目的，请遵守相关法律法规。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进本项目。

---

**最后更新**：2025-08-27
