vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {},
}));

import { alt, size, contentType } from './opengraph-image';

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
});
