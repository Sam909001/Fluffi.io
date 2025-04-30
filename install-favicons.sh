#!/bin/bash
# FLUFFI Favicon Installer for GitHub

echo "🛠️ Setting up favicons..."
mkdir -p public/favicons

# Download sample favicons (replace with yours)
wget -qO public/favicon.ico https://example.com/favicon.ico
wget -qO public/favicons/favicon-32x32.png https://example.com/favicon-32x32.png

echo "✅ Done! Commit these changes to see them live."
