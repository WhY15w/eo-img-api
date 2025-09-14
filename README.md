# 🖼️ EO 随机图片 API

一个基于 EdgeOne Pages Functions 和 cnb.cool 的随机图片 API ，提供随机图片展示功能。

## ✨ 特性

- 🎲 **随机图片获取** - 从大量图片库中随机返回图片
- 🚀 **高性能** - 基于 EdgeOne 边缘计算，全球加速
- 📊 **详细信息** - 返回图片路径、目录、尺寸等详细信息
- 🔒 **CORS 支持** - 支持跨域访问，方便前端调用
- 💾 **缓存优化** - 智能缓存策略，提升访问速度
- 📱 **响应式界面** - 提供美观的展示界面

## 🚀 快速开始

### API 调用

```bash
# 获取随机图片
curl "https://your-domain.com/api/img?img=random"
# 或
curl "https://your-domain.com/api/img?img=r"
```

### 响应信息

API 会在响应头中返回以下信息：

| 响应头           | 说明                   |
| ---------------- | ---------------------- |
| `X-Image-Path`   | 图片在仓库中的路径     |
| `X-Page`         | 页面目录 (page1-page10) |
| `X-Sub-Dir`      | 子目录编号 (1-20)      |
| `X-Image-Number` | 图片编号               |
| `X-Max-Images`   | 该目录下的最大图片数   |
| `X-Proxy-Url`    | 代理的源图片地址       |

### JavaScript 示例

```javascript
// 获取随机图片
async function getRandomImage() {
  try {
    const response = await fetch("/api/img?img=random");

    // 获取图片信息
    const imageInfo = {
      path: response.headers.get("X-Image-Path"),
      page: response.headers.get("X-Page"),
      subDir: response.headers.get("X-Sub-Dir"),
      imageNumber: response.headers.get("X-Image-Number"),
      maxImages: response.headers.get("X-Max-Images"),
    };

    // 创建图片 URL
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // 显示图片
    const img = document.createElement("img");
    img.src = imageUrl;
    document.body.appendChild(img);

    console.log("图片信息:", imageInfo);
  } catch (error) {
    console.error("获取图片失败:", error);
  }
}
```

### HTML 示例

```html
<!-- 直接在 img 标签中使用 -->
<img
  src="/api/img?img=random"
  alt="随机图片" />

<!-- 或者作为背景图片 -->
<div style="background-image: url('/api/img?img=random');"></div>
```

## 📁 项目结构

```
eo-img-api/
├── functions/
│   └── api/
│       └── img/
│           └── index.js          # EdgeOne Pages Function
├── index.html                # 展示界面
└── README.md                # 项目说明
```

## 🛠️ 部署说明

### EdgeOne Pages 部署

1. **创建 Pages 项目**

   ```bash
   # 克隆项目
   git clone <your-repo-url>
   cd eo-img-api
   ```

2. **配置 Functions**

   - 将 `functions/api/img/index.js` 部署为 EdgeOne Pages Function
   - 函数会自动绑定到 `/api/img` 路径

3. **配置域名**
   - 在 EdgeOne 控制台绑定自定义域名
   - 配置 HTTPS 证书

### 本地开发

```bash
# 启动本地服务器
npx serve .

# 或使用 Python
python -m http.server 8000
```

## 🔧 配置说明

### 图片数量配置

在 `functions/api/img/index.js` 中的 `CONFIG` 对象定义了每个目录的图片数量：

```javascript
var CONFIG = {
  imageCount: {
    page1: {
      1: 38, // page1/1 目录下有 38 张图片
      2: 40, // page1/2 目录下有 40 张图片
      // ...
    },
    // ...
  },
};
```

### 添加新图片

1. 将图片上传到对应的目录结构
2. 更新 `CONFIG` 中对应目录的图片数量
3. 重新部署 Function

## 🌐 API 接口

### GET /api/img

获取图片或显示帮助信息

**参数:**

- `img` - 图片类型
  - `random` 或 `r`: 获取随机图片

**响应:**

- 成功: 返回图片数据 (image/jpeg)
- 失败: 返回错误信息 (text/plain)

**状态码:**

- `200`: 成功
- `404`: 图片不存在
- `500`: 服务器内部错误

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- EdgeOne Pages Functions 提供强大的边缘计算能力
- cnb.cool 提供图片存储
- 图片资源来源于开源项目

---

> 💡 **提示**: 如果遇到问题，请查看 [Issues](../../issues) 或创建新的 Issue。
