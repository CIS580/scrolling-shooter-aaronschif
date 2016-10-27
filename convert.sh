#!/bin/bash
file=$1

convert "$file" -transparent 'srgb(191,220,191)' "$file"
