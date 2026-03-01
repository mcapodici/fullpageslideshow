#!/bin/bash
# Build script: creates martins-fullpage-slideshow.zip for WordPress installation
PLUGIN_NAME="martins-fullpage-slideshow"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

rm -f "${PLUGIN_NAME}.zip"

if command -v zip &>/dev/null; then
    zip -r "${PLUGIN_NAME}.zip" "$PLUGIN_NAME" \
        -x "${PLUGIN_NAME}/.git/*" \
        -x "${PLUGIN_NAME}/node_modules/*"
else
    # PowerShell fallback: build zip with forward-slash paths (required for Linux WordPress hosts)
    powershell -NoProfile -Command '
        Add-Type -Assembly System.IO.Compression.FileSystem
        $pluginDir = "martins-fullpage-slideshow"
        $zipPath = [System.IO.Path]::GetFullPath("martins-fullpage-slideshow.zip")
        if (Test-Path $zipPath) { Remove-Item $zipPath }
        $zip = [System.IO.Compression.ZipFile]::Open($zipPath, "Create")
        Get-ChildItem -Path $pluginDir -Recurse -File | ForEach-Object {
            $relativePath = $_.FullName.Substring((Get-Item $pluginDir).Parent.FullName.Length + 1)
            $entryName = $relativePath -replace "\\", "/"
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName) | Out-Null
        }
        $zip.Dispose()
        Write-Host "Zip created with forward-slash paths"
    '
fi

echo "Created ${PLUGIN_NAME}.zip"
