module.exports = {
  apps: [{
    name: 'red-cheosys',
    script: 'npm',
    args: 'start',
    cwd: '/opt/cheosys/services/web/red-cheosys',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'file:/opt/cheosys/services/web/red-cheosys/prisma/dev.db'
    }
  }]
}
