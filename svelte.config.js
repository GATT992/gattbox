import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
  kit: {
    adapter: adapter() // gunakan Vercel sebagai target deploy
  },
  preprocess: vitePreprocess() // mendukung style/script preprocess
};

export default config;
