# TabTimer

A Firefox extension that helps you track how long each tab has been open by replacing the favicon with a dynamic timer icon. The timer changes color based on the tab's age, helping you manage your browsing sessions more effectively.

## Features

- **Visual Tab Timer**: Replaces each tab's favicon with a dynamic timer showing how long the tab has been open
- **Color-Coded Indicators**: 
  - 🟢 Green: Less than 30 minutes
  - 🟡 Orange: Between 30-60 minutes
  - 🔴 Red: Over 60 minutes
- **Automatic Updates**: Timer updates every minute
- **Time Format**: 
  - Shows minutes (e.g., "45m") for the first hour
  - Switches to hours (e.g., "2h") after 60 minutes

## Installation

1. Download the extension from the Firefox Add-ons Store (link coming soon)
2. Click "Add to Firefox"
3. Grant the requested permissions

## Technical Details

The extension is built using the WebExtensions API and includes:
- Background script for tab monitoring and timer management
- Canvas-based dynamic icon generation
- Favicon manipulation using content scripts

### Permissions Required
- `tabs`: To monitor tab creation and updates
- `activeTab`: To modify tab favicons
- `<all_urls>`: To update favicons on any website

## Development

To run this extension locally:

1. Clone the repository:
```bash
git clone https://github.com/Scoaljo/firefox_tabtimer.git
```

2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select any file in the extension's directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Scott Jones

## Acknowledgments

- Icon design inspired by traditional timer interfaces
- Built using Firefox's WebExtensions API
