// Create proper PNG icons for PWA
import fs from 'fs';

const sizes = [192, 512];
const iconDir = './public/icons/';

// Create simple base64 PNG icons
const createPNGIcon = (size) => {
  // Simple blue square with "H" - replace with actual design
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.1}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">H</text>
  </svg>`;
  
  return canvas;
};

// Generate required PNG icons
sizes.forEach(size => {
  const svg = createPNGIcon(size);
  fs.writeFileSync(`${iconDir}icon-${size}x${size}.svg`, svg);
});

console.log('Icons ready. Convert to PNG manually or use online converter.');