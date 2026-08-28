module.exports = {
  apps: [
    {
      name: 'ldp-frontend',
      cwd: '.',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.FRONTEND_PUBLIC_PORT || '3000',
      },
    },
  ],
};
