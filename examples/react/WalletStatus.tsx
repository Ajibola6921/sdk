/**
 * Wallet Status Component Example
 *
 * React component demonstrating how to display wallet balance and status.
 */

import React, { useEffect } from 'react';
import { useWallet } from '../../src/react/useWallet';
import { AuthError } from '../../src';

export function WalletStatus() {
  const { wallet, loading, error, refetch } = useWallet();

  useEffect(() => {
    // Fetch wallet on mount
    refetch?.();
  }, [refetch]);

  if (loading) {
    return (
      <div className="wallet-status loading">
        <p>Loading wallet information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-status error">
        <h3>❌ Wallet Error</h3>
        <p>
          {error instanceof AuthError
            ? 'Please login to view your wallet'
            : error.message}
        </p>
        <button onClick={() => refetch?.()}>Retry</button>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="wallet-status">
        <p>No wallet linked yet</p>
      </div>
    );
  }

  return (
    <div className="wallet-status success">
      <div className="wallet-header">
        <h3>💰 Your Wallet</h3>
        <button className="refresh-btn" onClick={() => refetch?.()}>
          🔄 Refresh
        </button>
      </div>

      <div className="wallet-info">
        <div className="info-row">
          <span className="label">Address:</span>
          <code className="value">{wallet.address}</code>
        </div>

        <div className="info-row">
          <span className="label">Network:</span>
          <span className="value">{wallet.network}</span>
        </div>

        <div className="info-row balance">
          <span className="label">Balance:</span>
          <span className="value amount">
            {wallet.balance.toFixed(2)} {wallet.currency}
          </span>
        </div>
      </div>

      <style jsx>{`
        .wallet-status {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border-radius: 8px;
          background: #f5f5f5;
        }

        .wallet-status.loading {
          text-align: center;
          color: #666;
        }

        .wallet-status.error {
          background: #ffebee;
          border: 1px solid #f48fb1;
        }

        .wallet-status.error h3 {
          color: #c62828;
          margin-top: 0;
        }

        .wallet-status.error button {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .wallet-status.error button:hover {
          background: #c62828;
        }

        .wallet-status.success {
          background: #e8f5e9;
          border: 1px solid #81c784;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .wallet-header h3 {
          margin: 0;
          color: #1b5e20;
        }

        .refresh-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-btn:hover {
          background: #388e3c;
        }

        .wallet-info {
          background: white;
          padding: 15px;
          border-radius: 4px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row.balance {
          background: #f1f8e9;
          padding: 12px;
          margin: 10px 0;
          border-radius: 4px;
          border: none;
        }

        .label {
          font-weight: 600;
          color: #333;
        }

        .value {
          color: #666;
          text-align: right;
          flex: 1;
          margin-left: 10px;
        }

        .value.amount {
          font-weight: 600;
          color: #1b5e20;
          font-size: 18px;
        }

        code.value {
          background: #fafafa;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 12px;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
