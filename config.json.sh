#!/bin/sh

cat >config.json <<!SUB!THIS!
{
  "discord": {
    "token": "$DISCORD_TOKEN"
  },
  "database": {
    "host": "$DB_HOST",
    "port": $DB_PORT,
    "username": "$DB_USERNAME",
    "password": "$DB_PASSWORD",
    "database": "$DB_DATABASE"
  }
}
!SUB!THIS!