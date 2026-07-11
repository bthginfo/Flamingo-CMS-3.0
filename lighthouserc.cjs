module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm --filter @flamingo/renderer start',
      startServerReadyPattern: 'Ready|started server',
      url: [
        'http://localhost:3002/demo/handwerk',
        'http://localhost:3002/demo/hotel',
        'http://localhost:3002/demo/restaurant',
        'http://localhost:3002/demo/medical',
        'http://localhost:3002/demo/shop',
        'http://localhost:3002/demo/eishockey',
        'http://localhost:3002/demo/showcase',
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--headless --no-sandbox',
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
