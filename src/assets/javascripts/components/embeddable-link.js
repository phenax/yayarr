Vue.component('embeddable-link', {
  props: ['src'],
  data: function() {
    console.log(this.src)
    return { src: this.src, resizableIframeHeight: 600 }
  },
  template: `
    <div>
      <div v-if="isYoutubeEmbed" style="aspect-ratio: 16 / 9;" class="w-100 pb-5">
        <iframe
          :src="youtubeEmbedLink"
          class="w-100 h-100"
          style="min-height: 100px;"
          loading="lazy"
          allowfullscreen
          frameborder="0" />
      </div>
      <div v-if="isRedditEmbed" class="w-100 pb-5">
        <iframe
          :src="redditEmbedLink"
          :height="resizableIframeHeight"
          width="640"
          style="border: none; max-width: 100%; border-radius: 8px; display: block; margin: 0 auto;"
          loading="lazy"
          allowfullscreen
          frameborder="0" />
      </div>
    </div>
  `,
  computed: {
    isYoutubeEmbed() { return Boolean(this.youtubeMatch) },
    isRedditEmbed() { return Boolean(this.redditMatch) },
    youtubeMatch() { return /^https?:\/\/(www\.)?youtube\.com\/(.*\?v=|shorts\/)(?<videoId>[^&]+)/i.exec(this.src) },
    redditMatch() { return /^https?:\/\/(www\.)?reddit\.com\/.*/i.exec(this.src) },
    redditEmbedLink() {
      const link = this.src.replace(/(www.)?reddit.com/, 'embed.reddit.com').replace(/\?.*$/, '')
      return `${link}?embed=true`
    },
    youtubeEmbedLink() {
      const ytMatch = this.youtubeMatch
      return ytMatch?.groups?.videoId && `https://youtube.com/embed/${ytMatch?.groups?.videoId}`;
    },
  },
  mounted() {
    window.addEventListener('message', this.windowMessage)
  },
  destroyed() {
    window.removeEventListener('message', this.windowMessage)
  },
  methods: {
    windowMessage(event) {
      if (event.data && typeof (event.data) === 'string') {
        try {
          const data = JSON.parse(event.data)
          if (data?.type == 'resize.embed')
            this.resizableIframeHeight = data.data
        } catch (e) { }
      }
    },
  },
})
