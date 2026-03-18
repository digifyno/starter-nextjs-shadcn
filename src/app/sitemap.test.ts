import sitemap from './sitemap';

describe('sitemap', () => {
  it('returns two URL entries', () => {
    expect(sitemap()).toHaveLength(2);
  });

  it('first entry is the root with priority 1', () => {
    const entries = sitemap();
    expect(entries[0].url).toContain('/');
    expect(entries[0].priority).toBe(1);
  });

  it('second entry is /about with priority 0.8', () => {
    const entries = sitemap();
    expect(entries[1].url).toMatch(/\/about$/);
    expect(entries[1].priority).toBe(0.8);
  });

  it('uses NEXT_PUBLIC_BASE_URL env var when set', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://myapp.com';
    const entries = sitemap();
    expect(entries[0].url).toBe('https://myapp.com');
    expect(entries[1].url).toBe('https://myapp.com/about');
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it('falls back to https://example.com when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    const entries = sitemap();
    expect(entries[0].url).toBe('https://example.com');
  });
});
