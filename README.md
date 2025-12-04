# Teneo Agents Widget

A self-contained, embeddable JavaScript widget that displays 3rd party agents built by the Teneo developer community. Perfectly matches Figma design specifications and ready for Webflow embedding.

## 🎯 Features

- **Exact Figma Design**: Pixel-perfect implementation of design specifications
- **Self-contained**: No external dependencies, includes all CSS
- **Webflow Ready**: Easy embedding with zero configuration
- **Responsive Grid**: 3×2 grid layout on desktop, responsive on mobile
- **IPFS Support**: Handles agent images with fallback gateways
- **Real-time Data**: Fetches live agent data from Teneo API

## 🚀 Quick Embed for Webflow

```html
<!-- Simple Webflow embedding -->
<script src="https://your-domain.com/teneo-agents-widget.js"></script>
<div id="teneo-agents-widget"></div>
```

## 📁 Project Files

- **`teneo-agents-widget.js`** - Main embeddable widget
- **`index.html`** - Test/demo page
- **`README.md`** - This documentation

## 🎨 Design Specifications

### Card Layout
- **Dimensions**: 424px × 293.25px per card
- **Grid**: 3 cards per row (1326px total width)
- **Spacing**: 26px gap between cards
- **Background**: #25272B per card
- **Typography**: PP Neue Montreal font family

### Agent Display
- **Avatar**: 49.76px circle with initials fallback
- **Name**: 20px, medium weight, #BAD3D8 color
- **Creator**: 14px, regular weight, #BAD3D8 color  
- **Status**: Green (#D3F372) or gray (#797E80) dot with text
- **Description**: 16px, 150% line height, truncated
- **Button**: #D3F372 background, "Chat Now" text

## 🌐 Testing

Run locally:
```bash
python3 -m http.server 8000
# Visit: http://localhost:8000
```

## 📱 Responsive Behavior

- **Desktop**: 3 cards per row (1326px)
- **Tablet**: 2 cards per row (874px)  
- **Mobile**: 1 card per row (424px)
- **Small**: Scales with padding (< 468px)

## 🔧 API Integration

Fetches from: `https://backend.developer.chatroom.teneo-protocol.ai/api/public/agents`

Returns agent data including:
- `agent_name`, `creator_name`, `description`
- `is_online`, `is_active` status
- `image_url` (supports IPFS)
- `metadata_uri` for additional details

## 📋 Deployment Steps

1. Upload `teneo-agents-widget.js` to your hosting
2. Add embed code to Webflow
3. Publish and enjoy!

Built with ❤️ for the Teneo community