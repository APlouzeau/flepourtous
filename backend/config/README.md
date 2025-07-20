# Configuration Files

## Google API Credentials

To use this application, you need to set up Google API credentials:

### 1. OAuth2 Credentials (`credentials.json`)

-   Copy `credentials.json.example` to `credentials.json`
-   Get your OAuth2 credentials from [Google Cloud Console](https://console.cloud.google.com/)
-   Replace the placeholder values with your actual credentials

### 2. Service Account Key (`service-account-key.json`)

-   Copy `service-account-key.json.example` to `service-account-key.json`
-   Create a service account in Google Cloud Console
-   Download the JSON key file and replace the placeholder values

### 3. PHP Configuration (`config.php`)

-   Already configured for the application
-   Modify database and other settings as needed

**⚠️ Important:** Never commit the actual credential files to Git! Only the `.example` files should be tracked.
