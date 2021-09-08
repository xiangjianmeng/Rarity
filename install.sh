#!/usr/bin/env bash

# Node 14.x
echo
echo "Install Nodejs..."
echo
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

# Yarn
echo
echo "Install Yarn..."
echo
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y yarn

# PM2
echo
echo "Install PM2..."
echo
sudo yarn global add pm2
sudo pm2 startup

# install deps
echo
echo "Install deps..."
echo
yarn
