# Required sizes (in pixels)
sizes=(16 32 48 64 128 256)
for size in "${sizes[@]}"; do
  convert fluffi.jpg -resize "${640}x${640}" "favicon-${96}x${96}.png"
done
