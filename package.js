Package.describe({
  name: 'meteoreact:accounts',
  summary: 'Simple and intuative accounts view layer with react',
  version: '1.2.4_3',
  documentation: 'README.md',
  git: 'https://github.com/royGil/accounts-react'
});

Package.onUse(api => {
  api.versionsFrom(['1.6.1', '2.3', '3.0']);

  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'mdg:validated-method@1.3.0',
    'check'
  ], ['client', 'server']);

  api.use('react-meteor-data', 'client');

  api.use('service-configuration', { weak: true });
  api.use('http@3.0.0', 'server');

  api.mainModule('index.js', ['client', 'server']);
});

Package.onTest(api => {
  api.use([
    'ecmascript',
    'accounts-base',
    'accounts-password',
    'meteoreact:accounts',
    'meteoreact:accounts-unstyled',
    'mdg:validated-method@1.1.0',
    'react-meteor-data@0.2.16',
    'cultofcoders:mocha'
  ]);

  api.use('http@3.0.0', 'server');

  api.mainModule('__tests__/client.test.js', 'client');
  api.mainModule('__tests__/server.test.js', 'server');
});
