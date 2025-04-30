# Required sizes (in pixels)
sizes=(16 32 48 64 128 256)
for size in "${sizes[@]}"; do
  convert fluffi.jpg -resize "${size}x${size}" "favicon-${size}x${size}.png"
done
