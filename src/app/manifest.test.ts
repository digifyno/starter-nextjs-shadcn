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

  it('has name "My App"', () => {
    expect(manifest().name).toBe('My App');
  });

  it('has short_name "My App"', () => {
    expect(manifest().short_name).toBe('My App');
  });

  it('has description set', () => {
    expect(manifest().description).toBe('A Next.js application');
  });

  it('background_color is #ffffff', () => {
    expect(manifest().background_color).toBe('#ffffff');
  });

  it('theme_color is #000000', () => {
    expect(manifest().theme_color).toBe('#000000');
  });

  it('all icons have image/png type', () => {
    const icons = manifest().icons ?? [];
    expect(icons.every((i) => i.type === 'image/png')).toBe(true);
  });
});
