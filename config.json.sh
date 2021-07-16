#!/bin/sh

cat >config.json <<!SUB!THIS!
{
  "discord": {
    "token": "$DISCORD_TOKEN"
  }
}
!SUB!THIS!
