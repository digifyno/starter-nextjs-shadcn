import manifest from './manifest';

describe('manifest', () => {
  it('has standalone display mode', () => {
    expect(manifest().display).toBe('standalone');
  });

  it('includes 192x192 and 512x512 icons', () => {
    const icons = manifest().icons ?? [];
    const sizes = icons.map((i) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('start_url is /', () => {
    expect(manifest().start_url).toBe('/');
  });
});
