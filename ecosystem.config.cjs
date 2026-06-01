module.exports = {
  apps: [
    {
      name: "louis-api",
      cwd: "./api",
      script: "dist/index.js",
      env: { NODE_ENV: "production" },
    },
    {
      name: "louis-web",
      cwd: ".",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production" },
    },
    {
      name: "louis-admin",
      cwd: "./admin",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      env: { NODE_ENV: "production" },
    },
  ],
};
