# Security Policy

## Reporting Vulnerabilities

The Dorisio project takes security very seriously. If you discover a security vulnerability, please report it to us responsibly.

### How to Report

**Do not open public issues for security vulnerabilities.** Instead, please email security concerns directly to the maintainers.

Include the following information in your report:
- Description of the vulnerability
- Affected versions
- Steps to reproduce (if applicable)
- Potential impact
- Any proposed fixes (optional)

## Security Best Practices

When using the Dorisio SDK, please follow these security best practices:

### Wallet Key Management

- **Never share your private keys** with anyone, including Dorisio developers or support staff
- **Store private keys securely** using environment variables or secure key management systems
- **Do not hardcode credentials** in source code or version control
- **Rotate keys regularly** if you suspect any compromise
- **Use hardware wallets** for storing significant amounts of cryptocurrency
- **Test with testnet first** before deploying to mainnet

### Payment Security

- **Validate all payment amounts** before processing
- **Implement rate limiting** on payment endpoints
- **Monitor for suspicious transaction patterns**
- **Use TLS/HTTPS** for all API communications
- **Verify transaction confirmations** before considering payment complete
- **Implement proper authorization checks** for payment operations
- **Log all payment transactions** for audit purposes

### General Security

- **Keep dependencies updated** - regularly run \
pm audit\ and update packages
- **Review SDK changes** in release notes, especially for security-related updates
- **Use strong authentication** for your applications and services
- **Implement proper error handling** to avoid leaking sensitive information
- **Enable security features** like rate limiting and request validation
- **Follow the principle of least privilege** when assigning permissions

## Supported Versions

Security updates are provided for:
- Current major version: All minor and patch versions
- Previous major version: Critical security fixes only

We recommend always using the latest stable version.

## Security Updates

When we release security updates, they will be:
1. Announced via GitHub releases with security tags
2. Documented in the CHANGELOG with security notices
3. Tested thoroughly before release

Subscribe to GitHub security advisories to stay informed.

## Acknowledgments

We appreciate the security research community's efforts to help us keep Dorisio secure. We will acknowledge researchers who responsibly report vulnerabilities (unless they request anonymity).
