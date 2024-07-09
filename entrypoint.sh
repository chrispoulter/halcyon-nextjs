#!/bin/sh
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i \
	-e "s#[a-z]*.env.NEXT_PUBLIC_API_URL#\"$NEXT_PUBLIC_API_URL\"#g"

exec "$@"
