#!/bin/sh

echo "Chacking for pending migrations..."
if python manage.py showmigrations | grep '\[ \]' > /dev/null; then
    echo "Applying pending migrations..."
    python manage.py migrate --noinput
else
    echo "Up to date database, no migrations needed."
fi

exec "$@"