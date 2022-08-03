#!/bin/sh

cat >config.json <<!SUB!THIS!
{
  "discord": {
    "token": "$DISCORD_TOKEN"
  },
  "github": {
    "token": "$GITHUB_TOKEN"
  }
}
!SUB!THIS!
