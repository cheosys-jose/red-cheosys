module.exports = {
  apps: [{
    name: 'red-cheosys',
    script: 'npm',
    args: 'start',
    cwd: '/opt/cheosys/services/web/red-cheosys',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
