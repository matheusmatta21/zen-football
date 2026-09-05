#!/bin/sh
set -eu

# Fly mounts a root-owned volume. Prepare only the catalog subdirectory,
# then run the API as the unprivileged node user.
mkdir -p /data/club-catalog
chown node:node /data/club-catalog
exec su-exec node "$@"
