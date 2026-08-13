// NOTE: @vercel/blob is not in package.json. Run: npm install @vercel/blob
import { put } from '@vercel/blob';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }
  const blob = await put(`frames/${Date.now()}.png`, file, {
    access: 'public',
    cacheControlMaxAge: 3600,
  });
  return Response.json({ url: blob.url });
}
