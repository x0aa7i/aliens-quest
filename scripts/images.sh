#!/bin/bash

SOURCE_DIR="./images/selected"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory $SOURCE_DIR does not exist."
  exit 1
fi

# Loop through all images in the source directory
for IMAGE in "$SOURCE_DIR"/*; do
  # Check if it is a file
  if [ -f "$IMAGE" ]; then
    # Extract the slug from the filename
    SLUG=$(basename "$IMAGE" | cut -d'.' -f1)
    DEST_DIR="./content/solutions/$SLUG"

    # Check if the destination directory exists
    # if [ -d "$DEST_DIR" ] && [ ! -f "$DEST_DIR/cover.webp" ]; then
    if [ -d "$DEST_DIR" ]; then
      # Convert image to .webp format and move to destination directory
      magick "$IMAGE" -auto-orient -strip -resize 1024x1024\> -quality 80 -define webp:lossless=false "$DEST_DIR/cover.webp"
    fi
  fi
done
