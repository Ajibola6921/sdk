#!/usr/bin/env node

/**
 * Create Dorisio App - CLI Scaffolding Tool
 *
 * Scaffolds a minimal working Dorisio integration with one command.
 * Usage: npx create-dorisio-app [project-name]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

fileURLToPath(import.meta.url); // Use import.meta.url directly where needed

interface ScaffoldOptions {
  projectName: string;
  template: 'react' | 'vanilla';
  directory: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): ScaffoldOptions {
  const args = process.argv.slice(2);
  const projectName = args[0] || 'dorisio-app';

  return {
    projectName,
    template: 'react',
    directory: path.join(process.cwd(), projectName),
  };
}

/**
 * Create directory
 */
function createDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Write file
 */
function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Generate package.json
 */
function generatePackageJson(projectName: string): string {
  return JSON.stringify(
    {
      name: projectName,
      version: '0.1.0',
      description: 'Dorisio integration',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        type: 'tsc --noEmit',
      },
      dependencies: {
        'dorisio-sdk': '^0.1.0',
        react: '^18.3.0',
        'react-dom': '^18.3.0',
        uuid: '^9.0.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.0.0',
        typescript: '^5.0.0',
        vite: '^5.0.0',
      },
    },
    null,
    2
  );
}

/**
 * Generate .env.example
 */
function generateEnvExample(): string {
  return `# Dorisio Configuration
# Copy this file to .env.local and fill in your values

# API Configuration
VITE_DORISIO_API_URL=http://localhost:3000
VITE_DORISIO_WEBHOOK_SECRET=your-webhook-secret

# Development Mode
VITE_SANDBOX_MODE=true
VITE_SANDBOX_LATENCY=100
VITE_SANDBOX_SEED=42

# Stellar Configuration
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://horizon-testnet.stellar.org
`;
}

/**
 * Generate tsconfig.json
 */
function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,

        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        jsx: 'react-jsx',
      },
      include: ['src'],
    },
    null,
    2
  );
}

/**
 * Generate main App component
 */
function generateAppComponent(): string {
  return `import React, { useState } from 'react';
import { DorisioProvider, useCreateTip, useWallet } from 'dorisio-sdk/react';
import { createSandboxClient } from 'dorisio-sdk';
import { v4 as uuidv4 } from 'uuid';

const client = createSandboxClient({
  latency: parseInt(import.meta.env.VITE_SANDBOX_LATENCY || '100'),
  seed: parseInt(import.meta.env.VITE_SANDBOX_SEED || '42'),
});

function CreateTipForm() {
  const { createTip, loading, error } = useCreateTip();
  const [amount, setAmount] = useState(50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createTip({
      creatorId: '550e8400-e29b-41d4-a716-446655440000',
      amount,
      currency: 'USD',
      message: 'Great content!',
      idempotencyKey: uuidv4(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Send a Tip</h2>

      <div className="form-group">
        <label htmlFor="amount">Amount (USD)</label>
        <input
          id="amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          disabled={loading}
        />
      </div>

      {error && <div className="error">Error: {error.message}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : \`Send $\${amount} Tip\`}
      </button>
    </form>
  );
}

function WalletInfo() {
  const { wallet, loading } = useWallet();

  if (loading) return <div>Loading wallet...</div>;
  if (!wallet) return <div>No wallet connected</div>;

  return (
    <div className="wallet">
      <h2>Your Wallet</h2>
      <p>Balance: {wallet.balance} {wallet.currency}</p>
      <p>Network: {wallet.network}</p>
      <code>{wallet.address}</code>
    </div>
  );
}

export function App() {
  return (
    <DorisioProvider config={{ baseUrl: import.meta.env.VITE_DORISIO_API_URL }}>
      <div className="container">
        <h1>🎵 Dorisio Integration</h1>
        <p>Sandbox mode enabled - all responses are mocked</p>

        <div className="grid">
          <CreateTipForm />
          <WalletInfo />
        </div>

        <footer>
          <p>Built with Dorisio SDK</p>
        </footer>
      </div>
    </DorisioProvider>
  );
}
`;
}

/**
 * Generate main.tsx
 */
function generateMainTsx(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}

/**
 * Generate style.css
 */
function generateStyles(): string {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #1976d2;
}

h2 {
  font-size: 1.5rem;
  margin: 20px 0 15px;
  color: #333;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 15px;
  color: #666;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

input,
button {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

button {
  background: #1976d2;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #1565c0;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid #ef5350;
}

.wallet {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

code {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  display: block;
  margin-top: 10px;
  word-break: break-all;
}

footer {
  text-align: center;
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  color: #999;
}
`;
}

/**
 * Generate index.html
 */
function generateIndexHtml(projectName: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} - Dorisio Integration</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Generate README
 */
function generateReadme(projectName: string): string {
  return `# ${projectName}

Dorisio integration scaffolded with \`create-dorisio-app\`.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:5173](http://localhost:5173)

## What's Included

- ✅ Dorisio SDK fully configured
- ✅ Sandbox mode enabled for testing
- ✅ React + TypeScript setup
- ✅ Working tip form component
- ✅ Wallet display component
- ✅ All env vars pre-configured

## Development

### Build
\`\`\`bash
npm run build
\`\`\`

### Type Check
\`\`\`bash
npm run type
\`\`\`

## SDK Documentation

- [Dorisio SDK Docs](https://github.com/Dorisio/sdk)
- [Sandbox Mode Guide](https://github.com/Dorisio/sdk/tree/main/examples/sandbox)
- [Examples](https://github.com/Dorisio/sdk/tree/main/examples)

## Next Steps

1. Replace the example creator ID in \`App.tsx\`
2. Customize styling in \`style.css\`
3. Add more components as needed
4. When ready for production, update \`VITE_SANDBOX_MODE\` to \`false\` and add API credentials

## License

MIT
`;
}

/**
 * Main scaffold function
 */
async function scaffold(options: ScaffoldOptions): Promise<void> {
  console.log('\n🚀 Creating Dorisio App...\n');
  console.log(`📁 Project: ${options.projectName}`);
  console.log(`📍 Location: ${options.directory}\n`);

  try {
    // Create project directory
    createDirectory(options.directory);

    // Create files
    console.log('📝 Creating files...');

    writeFile(
      path.join(options.directory, 'package.json'),
      generatePackageJson(options.projectName)
    );
    writeFile(path.join(options.directory, '.env.example'), generateEnvExample());
    writeFile(path.join(options.directory, 'tsconfig.json'), generateTsConfig());
    writeFile(path.join(options.directory, 'index.html'), generateIndexHtml(options.projectName));
    writeFile(path.join(options.directory, 'src', 'App.tsx'), generateAppComponent());
    writeFile(path.join(options.directory, 'src', 'main.tsx'), generateMainTsx());
    writeFile(path.join(options.directory, 'src', 'style.css'), generateStyles());
    writeFile(path.join(options.directory, 'README.md'), generateReadme(options.projectName));
    writeFile(
      path.join(options.directory, '.gitignore'),
      'node_modules\n.env.local\ndist\n.DS_Store\n'
    );

    console.log('✅ Files created\n');

    // Success message
    console.log('✨ Project created successfully!\n');
    console.log('📖 Next steps:\n');
    console.log(`   cd ${options.projectName}`);
    console.log('   npm install');
    console.log('   npm run dev\n');
    console.log('🎉 Your Dorisio integration is ready!\n');
  } catch (error) {
    console.error('❌ Error creating project:', error);
    process.exit(1);
  }
}

// Run CLI
const options = parseArgs();
scaffold(options).catch(console.error);
