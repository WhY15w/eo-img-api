// EdgeOne Pages Function export
export function onRequest(context) {
  return handleRequest(context.request);
}

// 配置项 - 每个目录的图片数量配置
const CONFIG = {
  imageCount: {
    page1: {
      1: 38,
      2: 40,
      3: 30,
      4: 22,
      5: 22,
      6: 40,
      7: 7,
      8: 40,
      9: 33,
      10: 14,
      11: 46,
      12: 40,
      13: 40,
      14: 27,
      15: 16,
      16: 20,
      17: 22,
      18: 14,
      19: 15,
      20: 35,
    },
    page2: {
      1: 20,
      2: 16,
      3: 19,
      4: 40,
      5: 43,
      6: 11,
      7: 43,
      8: 40,
      9: 44,
      10: 41,
      11: 40,
      12: 22,
      13: 72,
      14: 43,
      15: 49,
      16: 41,
      17: 40,
      18: 37,
      19: 15,
      20: 17,
    },
    page3: {
      1: 25,
      2: 34,
      3: 40,
      4: 40,
      5: 13,
      6: 13,
      7: 60,
      8: 59,
      9: 79,
      10: 29,
      11: 86,
      12: 59,
      13: 121,
      14: 27,
      15: 40,
      16: 41,
      17: 21,
      18: 26,
      19: 60,
      20: 45,
    },
    page4: {
      1: 43,
      2: 170,
      3: 94,
      4: 96,
      5: 41,
      6: 44,
      7: 30,
      8: 45,
      9: 24,
      10: 39,
      11: 81,
      12: 20,
      13: 20,
      14: 21,
      15: 30,
      16: 37,
      17: 50,
      18: 44,
      19: 18,
      20: 66,
    },
    page5: {
      1: 17,
      2: 34,
      3: 48,
      4: 84,
      5: 35,
      6: 29,
      7: 16,
      8: 24,
      9: 15,
      10: 33,
      11: 30,
      12: 13,
      13: 23,
      14: 76,
      15: 23,
      16: 24,
      17: 58,
      18: 46,
      19: 19,
      20: 17,
    },
    page6: {
      1: 42,
      2: 55,
      3: 39,
      4: 52,
      5: 64,
      6: 93,
      7: 47,
      8: 33,
      9: 73,
      10: 81,
      11: 58,
      12: 38,
      13: 23,
      14: 25,
      15: 51,
      16: 46,
      17: 20,
      18: 87,
      19: 20,
      20: 47,
    },
    page7: {
      1: 25,
      2: 39,
      3: 24,
      4: 40,
      5: 49,
      6: 124,
      7: 41,
      8: 22,
      9: 35,
      10: 23,
      11: 45,
      12: 20,
      13: 30,
      14: 20,
      15: 43,
      16: 42,
      17: 43,
      18: 27,
      19: 38,
      20: 26,
    },
    page8: {
      1: 43,
      2: 52,
      3: 32,
      4: 65,
      5: 24,
      6: 39,
      7: 15,
      8: 59,
      9: 39,
      10: 40,
      11: 50,
      12: 42,
      13: 44,
      14: 45,
      15: 13,
      16: 18,
      17: 40,
      18: 21,
      19: 47,
      20: 43,
    },
    page9: {
      1: 18,
      2: 32,
      3: 34,
      4: 27,
      5: 37,
      6: 30,
      7: 34,
      8: 29,
      9: 34,
      10: 32,
      11: 44,
      12: 24,
      13: 31,
      14: 30,
      15: 33,
      16: 17,
      17: 34,
      18: 31,
      19: 22,
      20: 29,
    },
    page10: {
      1: 52,
      2: 50,
      3: 16,
      4: 19,
      5: 33,
      6: 21,
      7: 22,
      8: 13,
      9: 41,
      10: 45,
      11: 40,
      12: 40,
      13: 16,
      14: 39,
      15: 54,
      16: 22,
      17: 22,
      18: 24,
      19: 33,
      20: 50,
    },
  },
};

// 根据文件扩展名获取MIME类型
function getMimeType(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
  };
  return mimeTypes[ext] || "image/jpeg";
}

// 获取随机图片路径
function getRandomImagePath() {
  // 随机选择页面 (page1-page10)
  const pageNum = Math.floor(Math.random() * 10) + 1;
  const pageName = "page" + pageNum;

  // 随机选择子目录 (1-20)
  const subDir = Math.floor(Math.random() * 20) + 1;

  // 获取该目录下的图片数量
  const maxImages = CONFIG.imageCount[pageName][subDir];

  // 随机选择图片编号
  const imageNum = Math.floor(Math.random() * maxImages) + 1;

  // 构建完整路径
  const imagePath = "i/" + pageName + "/" + subDir + "/" + imageNum + ".jpg";

  return {
    path: imagePath,
    page: pageName,
    subDir: subDir,
    imageNum: imageNum,
    maxImages: maxImages,
  };
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const imgType = url.searchParams.get("img");

    if (imgType === "random" || imgType === "r") {
      // 获取随机图片信息
      const imageInfo = getRandomImagePath();

      // 构建代理URL
      const proxyUrl =
        "https://cnb.cool/HurryWang/img/-/git/raw/master/" + imageInfo.path;

      // 发起反代请求
      const proxyResponse = await fetch(proxyUrl, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "User-Agent":
            request.headers.get("User-Agent") ||
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!proxyResponse.ok) {
        return new Response(
          "❌ 获取图片失败: " +
            proxyResponse.status +
            " " +
            proxyResponse.statusText,
          {
            status: proxyResponse.status,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }
        );
      }

      // 获取图片数据
      const imageData = await proxyResponse.arrayBuffer();

      // 返回图片
      return new Response(imageData, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
          "X-Image-Path": imageInfo.path,
          "X-Page": imageInfo.page,
          "X-Sub-Dir": imageInfo.subDir.toString(),
          "X-Image-Number": imageInfo.imageNum.toString(),
          "X-Max-Images": imageInfo.maxImages.toString(),
          "X-Proxy-Url": proxyUrl,
        },
      });
    } else {
      // 显示使用说明
      let helpText = "🖼️ 随机图片展示器\n\n";
      helpText += "使用方法:\n";
      helpText += "• ?img=random 或 ?img=r - 获取随机图片\n\n";
      helpText += "目录结构:\n";
      helpText += "• 5个页面目录: page1-page5\n";
      helpText += "• 每页面20个子目录: 1-20\n";
      helpText += "• 图片格式: .jpg\n";
      helpText += "• 图片数量: 7-170张不等\n\n";
      helpText += "返回头信息:\n";
      helpText += "• X-Image-Path: 图片路径\n";
      helpText += "• X-Page: 页面目录\n";
      helpText += "• X-Sub-Dir: 子目录编号\n";
      helpText += "• X-Image-Number: 图片编号\n";
      helpText += "• X-Max-Images: 该目录最大图片数\n";

      return new Response(helpText, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (error) {
    let errorDetails = "❌ 内部错误\n\n";
    errorDetails += "错误消息: " + error.message + "\n";
    errorDetails += "错误堆栈: " + error.stack + "\n";
    errorDetails += "请求地址: " + request.url + "\n";
    errorDetails += "时间戳: " + new Date().toISOString();

    return new Response(errorDetails, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
