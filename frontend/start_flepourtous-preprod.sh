#!/bin/bash

# Build the Next.js application
npm run build

# Start the Next.js application with PM2
pm2 start npm --name "flepourtous-preprod" -- start

# Save the PM2 process list and corresponding environments
pm2 save

# Generate startup script for PM2 and execute it
STARTUP_CMD=$(pm2 startup | tail -n 1)
eval $STARTUP_CMD

echo "Next.js application has been started with PM2 and configured to restart on boot."
