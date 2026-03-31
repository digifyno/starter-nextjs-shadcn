vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {},
}));

import TwitterImage, { alt, size, contentType } from './twitter-image';
import { ImageResponse } from 'next/og';

describe('twitter-image', () => {
  it('exports 800×800 size for 1:1 ratio', () => {
    expect(size).toEqual({ width: 800, height: 800 });
  });

  it('re-exports alt text from opengraph-image', () => {
    expect(alt).toBe('My App');
  });

  it('re-exports PNG content type', () => {
    expect(contentType).toBe('image/png');
  });

  it('default export renders an ImageResponse', () => {
    const result = TwitterImage();
    expect(result).toBeInstanceOf(ImageResponse);
  });
});
