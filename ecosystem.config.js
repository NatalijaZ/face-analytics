module.exports = {
  apps : [{
    name: 'face-analytics',
    script: 'src/App.ts',
    interpreter: 'node',
    interpreter_args: [
      '-r', 'dotenv/config',
      '-r', 'ts-node/register',
      '-r', 'tsconfig-paths/register'
    ],
    max_memory_restart: '500M',
    instances: 1,
    wait_ready: true,
    autorestart: true,
    watch: false
  }]
};
