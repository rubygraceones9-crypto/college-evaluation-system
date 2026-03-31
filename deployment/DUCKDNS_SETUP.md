# DuckDNS Integration Guide

This guide explains how to keep your domain `citeeval.duckdns.org` pointing to your VPS IP `138.84.105.223` automatically.

## 1. Get your DuckDNS Token
1. Log in to [duckdns.org](https://www.duckdns.org).
2. Copy your **token** from the dashboard.

## 2. Set up the Update Script on your VPS
SSH into your Hostinger VPS and run the following commands:

```bash
# Create a directory for the script
mkdir -p ~/scripts
cd ~/scripts

# Create the update script
nano update-duckdns.sh
```

Paste the following content into `update-duckdns.sh` (replace `YOUR_TOKEN_HERE` with your actual token):

```bash
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=citeeval&token=YOUR_TOKEN_HERE&ip=" | curl -k -o ~/scripts/duck.log -K -
```

Give the script execution permissions:
```bash
chmod +x update-duckdns.sh
```

## 3. Automate with Cron
To ensure your IP is always up to date, set up a cron job to run every 5 minutes:

```bash
crontab -e
```

Add this line at the end of the file:
```cron
*/5 * * * * ~/scripts/update-duckdns.sh >/dev/null 2>&1
```

## 4. Verify the Integration
You can manually run the script once to check if it works:
```bash
~/scripts/update-duckdns.sh
cat ~/scripts/duck.log
```
If it says `OK`, your domain is successfully pointing to your VPS!

---

## Technical Note: Application Configuration
The application has already been configured to recognize `citeeval.duckdns.org` as its primary domain.
- **Nginx**: Updated `server_name` in `deployment/nginx/nginx.conf`.
- **Docker Compose**: Updated `NEXT_PUBLIC_API_URL` and mapped port `80` for standard web access.
