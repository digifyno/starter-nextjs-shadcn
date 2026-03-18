import robots from './robots';

describe('robots', () => {
  it('allows all user agents', () => {
    const result = robots();
    expect(result.rules).toEqual(expect.arrayContaining([
      expect.objectContaining({ userAgent: '*', allow: '/' })
    ]));
  });

  it('includes sitemap URL using NEXT_PUBLIC_BASE_URL', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://myapp.com';
    expect(robots().sitemap).toBe('https://myapp.com/sitemap.xml');
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it('falls back to example.com for sitemap when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    expect(robots().sitemap).toBe('https://example.com/sitemap.xml');
  });
});
