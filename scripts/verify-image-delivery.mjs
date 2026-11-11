const baseUrl = process.env.SITE_URL || 'https://hub.skillfoundry-web.workers.dev';
const candidates = [
  'knight-poppies-thumbnail.png',
  'resting-medieval-knight-hero.jpg',
  'testing-resource-hero-16x9-20261104.jpg'
];

function dimensions(buffer) {
  if (buffer.length >= 24 && buffer.toString('hex', 0, 8) === '89504e470d0a1a0a') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    let offset = 12;
    while (offset + 8 <= buffer.length) {
      const type = buffer.toString('ascii', offset, offset + 4);
      const size = buffer.readUInt32LE(offset + 4);
      const data = offset + 8;
      if (type === 'VP8X' && data + 10 <= buffer.length) {
        return {
          width: 1 + buffer.readUIntLE(data + 4, 3),
          height: 1 + buffer.readUIntLE(data + 7, 3)
        };
      }
      if (type === 'VP8L' && data + 5 <= buffer.length) {
        const b1 = buffer[data + 1], b2 = buffer[data + 2], b3 = buffer[data + 3], b4 = buffer[data + 4];
        return {
          width: 1 + (b1 | ((b2 & 0x3f) << 8)),
          height: 1 + ((b2 >> 6) | (b3 << 2) | ((b4 & 0x0f) << 10))
        };
      }
      if (type === 'VP8 ' && data + 10 <= buffer.length && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
        return {
          width: buffer.readUInt16LE(data + 6) & 0x3fff,
          height: buffer.readUInt16LE(data + 8) & 0x3fff
        };
      }
      offset = data + size + (size % 2);
    }
  }

  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset++; continue; }
      while (buffer[offset] === 0xff) offset++;
      const marker = buffer[offset++];
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > buffer.length) break;
      const length = buffer.readUInt16BE(offset);
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
      }
      if (length < 2) break;
      offset += length;
    }
  }
  throw new Error('Could not read image dimensions from the response.');
}

async function getImage(path) {
  const response = await fetch(new URL(path, baseUrl), {
    headers: { Accept: 'image/webp,image/jpeg,image/png,image/*,*/*;q=0.8' },
    redirect: 'follow'
  });
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().startsWith('image/')) {
    throw new Error(`${path} returned non-image content: ${type || 'missing content-type'}`);
  }
  return { buffer: Buffer.from(await response.arrayBuffer()), type, cache: response.headers.get('cache-control') || '' };
}

let selected;
for (const filename of candidates) {
  try {
    const original = await getImage(`/images/${filename}`);
    const size = dimensions(original.buffer);
    if (size.width > 320) {
      selected = { filename, original, originalSize: size };
      break;
    }
  } catch {
    // Try the next known public image.
  }
}

if (!selected) throw new Error('No suitable public image was found for the responsive-image smoke test.');

const optimized = await getImage(`/media/images/${selected.filename}?w=320`);
const optimizedSize = dimensions(optimized.buffer);

if (optimizedSize.width > 320) {
  throw new Error(`Responsive image failed: requested 320px but received ${optimizedSize.width}px. The worker may be falling back to the full-size original.`);
}
if (optimized.buffer.length >= selected.original.buffer.length) {
  throw new Error(`Responsive image did not reduce transfer size: original ${selected.original.buffer.length} bytes, requested variant ${optimized.buffer.length} bytes.`);
}

console.log(
  `Responsive image verified: ${selected.filename}; ${selected.originalSize.width}x${selected.originalSize.height} / ${selected.original.buffer.length} bytes -> ${optimizedSize.width}x${optimizedSize.height} / ${optimized.buffer.length} bytes; content-type ${optimized.type}; cache ${optimized.cache || 'not reported'}`
);
