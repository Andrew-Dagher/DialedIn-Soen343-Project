import '@testing-library/jest-dom/extend-expect';

import initFontAwesome from '../utils/initFontAwesome';

initFontAwesome();

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

jest.mock('next/navigation', () => ({
  usePathname: () => ''
}));

global.TextEncoder = class {
  encode(str) {
    return Buffer.from(str, 'utf-8');
  }
};

global.TextDecoder = class {
  decode(buffer) {
    return Buffer.from(buffer).toString('utf-8');
  }
};

jest.mock('@auth0/nextjs-auth0', () => {
  return {
    getSession: () => ({
      user: {
        sub: 'bob'
      }
    }),
    getAccessToken: () => 'access_token',
    withApiAuthRequired: handler => handler,
    withPageAuthRequired: page => () => page()
  };
});
