#!/bin/sh
prisma migrate deploy
node server.js