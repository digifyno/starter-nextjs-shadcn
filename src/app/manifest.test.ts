import manifest from './manifest';

describe('manifest', () => {
  it('has standalone display mode', () => {
    expect(manifest().display).toBe('standalone');
  });

  it('has 4 icon entries (both sizes × both purposes)', () => {
    const icons = manifest().icons ?? [];
    expect(icons).toHaveLength(4);
  });

  it('192x192 icon appears with both any and maskable purposes', () => {
    const icons = manifest().icons ?? [];
    const icons192 = icons.filter((i) => i.sizes === '192x192');
    const purposes192 = icons192.map((i) => i.purpose);
    expect(purposes192).toContain('any');
    expect(purposes192).toContain('maskable');
  });

  it('512x512 icon appears with both any and maskable purposes', () => {
    const icons = manifest().icons ?? [];
    const icons512 = icons.filter((i) => i.sizes === '512x512');
    const purposes512 = icons512.map((i) => i.purpose);
    expect(purposes512).toContain('any');
    expect(purposes512).toContain('maskable');
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
