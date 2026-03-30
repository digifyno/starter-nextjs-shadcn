vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {},
}));

import OgImage, { alt, size, contentType } from './opengraph-image';
import { ImageResponse } from 'next/og';

describe('opengraph-image', () => {
  it('exports correct alt text', () => {
    expect(alt).toBe('My App');
  });

  it('exports standard OG dimensions (1200×630)', () => {
    expect(size).toEqual({ width: 1200, height: 630 });
  });

  it('exports PNG content type', () => {
    expect(contentType).toBe('image/png');
  });

  it('default export renders an ImageResponse', () => {
    const result = OgImage();
    expect(result).toBeInstanceOf(ImageResponse);
  });
});
