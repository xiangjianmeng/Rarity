#!/usr/bin/env bash

function restartPm2Script() {
  NAME=$1;
  SCRIPT=${2:-start}
  pm2 describe $NAME > /dev/null
  RUNNING=$?
  if [ "${RUNNING}" -ne 0 ]; then
    echo "start app '$NAME'..."
    pm2 start npm --name $NAME -- run $SCRIPT
  else
    echo "restart app '$NAME'..."
    pm2 restart $NAME
  fi;
}

restartPm2Script rarity start
