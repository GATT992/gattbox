import type { RequestHandler } from '@sveltejs/kit';

const uploads: Record<string, string> = {};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const file = data.get('file') as File;
  const expire = (data.get('expire') as string)?.trim() || 'forever';

  if (!file) {
    return new Response(JSON.stringify({ status: 'error', message: 'No file uploaded' }), {
      status: 400
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mime = file.type;
  const blobUrl = `data:${mime};base64,${base64}`;

  const id = Date.now().toString();
  uploads[id] = blobUrl;

  if (expire !== 'forever') {
    const ms = parseExpire(expire);
    if (ms) setTimeout(() => delete uploads[id], ms);
  }

  return new Response(
    JSON.stringify({
      status: 'success',
      data: {
        url: blobUrl,
        type: mime,
        name: file.name,
        size: file.size,
        expire
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

function parseExpire(str: string): number | null {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2];
  const multiplier = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (multiplier[unit] || 0);
    }
