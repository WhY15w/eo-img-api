<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
    <div
      class="mx-auto max-w-6xl rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      <header class="bg-gradient-to-r from-sky-400 to-cyan-300 text-white text-center px-8 py-12">
        <h1 class="text-4xl md:text-5xl font-extrabold drop-shadow-xl tracking-wide">
          🖼️ EO 随机图片 API
        </h1>
      </header>

      <main class="px-8 py-12 md:px-14 space-y-16">
        <section>
          <div class="rounded-2xl bg-white/70 backdrop-blur-md p-8 shadow-xl">
            <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">🎲 随机图片展示</h2>
            <div class="flex flex-col md:flex-row md:gap-10">
              <div class="flex md:flex-col gap-4 justify-center md:w-64 mb-8 md:mb-0">
                <button
                  class="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-8 py-3 text-lg text-white font-semibold shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
                  :disabled="loading"
                  @click="loadRandomImage"
                >
                  获取随机图片
                </button>
                <button
                  v-show="currentImageUrl"
                  class="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-8 py-3 text-lg text-white font-semibold shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
                  @click="downloadCurrentImage"
                >
                  下载图片
                </button>
              </div>

              <div class="flex-1 flex justify-center items-center">
                <div v-if="loading" class="text-center p-12">
                  <div
                    class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-sky-400"
                  ></div>
                  <p class="text-gray-700">正在加载图片...</p>
                </div>

                <div
                  v-show="!loading && currentImageUrl"
                  class="relative rounded-2xl overflow-hidden shadow-2xl max-w-full"
                >
                  <img
                    :src="currentImageUrl"
                    alt="随机图片"
                    class="max-h-[550px] w-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
                    @load="onImageLoaded"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center text-sm md:text-base p-2"
                  >
                    📁 {{ currentImageInfo.page }}/{{ currentImageInfo.subDir }} · 🖼️
                    {{ currentImageInfo.imageNumber }}/{{ currentImageInfo.maxImages }} · 📏
                    {{ imageSize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-bold mb-6 border-b-4 border-sky-400/60 pb-2">
            📖 API 使用说明
          </h2>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-white/80 rounded-xl p-6 shadow-md border-l-4 border-sky-400">
              <h3 class="text-xl font-semibold mb-3">获取随机图片</h3>
              <p class="mb-3 text-gray-700">获取一张随机图片：</p>
              <div class="space-y-2">
                <code class="block bg-gray-100 px-3 py-1 rounded text-pink-600 font-mono"
                  >GET /api/img?img=random</code
                >
                <code class="block bg-gray-100 px-3 py-1 rounded text-pink-600 font-mono"
                  >GET /api/img?img=r</code
                >
              </div>
            </div>
            <div class="bg-white/80 rounded-xl p-6 shadow-md border-l-4 border-sky-400">
              <h3 class="text-xl font-semibold mb-3">响应头信息</h3>
              <p class="mb-3 text-gray-700">返回以下头信息：</p>
              <div class="space-y-1 font-mono text-sm text-gray-800">
                <div><code>X-Image-Path</code> - 图片路径</div>
                <div><code>X-Page</code> - 页面目录</div>
                <div><code>X-Sub-Dir</code> - 子目录编号</div>
                <div><code>X-Image-Number</code> - 图片编号</div>
                <div><code>X-Max-Images</code> - 该目录最大图片数</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-bold mb-6 border-b-4 border-sky-400/60 pb-2">
            📊 服务统计
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="(stat, i) in stats"
              :key="i"
              class="bg-white/80 rounded-2xl p-8 text-center shadow-md hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div class="text-4xl font-extrabold text-sky-400 mb-2">{{ stat.number }}</div>
              <div class="text-gray-700 text-lg">{{ stat.label }}</div>
            </div>
          </div>
        </section>
      </main>

      <footer class="bg-gray-900 text-white text-center py-6">&copy; 2025 EO 随机图片 API</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ImageInfo {
  path: string | null
  page: string | null
  subDir: string | null
  imageNumber: string | null
  maxImages: string | null
  proxyUrl: string | null
}

const currentImageUrl = ref('')
const currentImageInfo = ref<ImageInfo>({
  path: null,
  page: null,
  subDir: null,
  imageNumber: null,
  maxImages: null,
  proxyUrl: null,
})
const imageSize = ref('')
const loading = ref(false)

const stats = [
  { number: '10', label: '页面目录' },
  { number: '200', label: '子目录总数' },
  { number: '4000+', label: '图片总数' },
  { number: 'JPG', label: '图片格式' },
]

async function loadRandomImage() {
  loading.value = true
  currentImageUrl.value = ''
  imageSize.value = ''
  try {
    const res = await fetch('/api/img?img=r')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    console.log(res.headers)
    currentImageInfo.value = {
      path: res.headers.get('X-Image-Path'),
      page: res.headers.get('X-Page'),
      subDir: res.headers.get('X-Sub-Dir'),
      imageNumber: res.headers.get('X-Image-Number'),
      maxImages: res.headers.get('X-Max-Images'),
      proxyUrl: res.headers.get('X-Proxy-Url'),
    }
    console.log(currentImageInfo.value)
    const blob = await res.blob()
    currentImageUrl.value = URL.createObjectURL(blob)
  } catch (e: any) {
    alert('加载图片失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

function onImageLoaded(e: Event) {
  const img = e.target as HTMLImageElement
  imageSize.value = `${img.naturalWidth}×${img.naturalHeight}`
}

function downloadCurrentImage() {
  if (currentImageUrl.value) {
    const a = document.createElement('a')
    a.href = currentImageUrl.value
    a.download = `random-image-${currentImageInfo.value.page}-${currentImageInfo.value.subDir}-${currentImageInfo.value.imageNumber}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

onMounted(() => {
  loadRandomImage()
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      loadRandomImage()
    }
  })
})
</script>
