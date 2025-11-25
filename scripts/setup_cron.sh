#!/bin/bash

# Setup cron job to calculate profits every hour

SCRIPT_PATH="/app/scripts/calculate_profits.py"

# Add cron job (runs every hour)
(crontab -l 2>/dev/null; echo "0 * * * * cd /app && /root/.venv/bin/python3 $SCRIPT_PATH >> /var/log/profit_calculation.log 2>&1") | crontab -

echo "Cron job configured to run profit calculation every hour"
echo "Logs will be written to /var/log/profit_calculation.log"
