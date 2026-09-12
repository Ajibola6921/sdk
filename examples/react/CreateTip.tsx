/**
 * Create Tip Component Example
 *
 * React component demonstrating how to send tips using Dorisio SDK hooks.
 */

import React, { useState } from 'react';
import { useCreateTip } from '../../src/react/useCreateTip';
import { Schemas, PaymentError } from '../../src';
import { v4 as uuidv4 } from 'uuid';

interface CreateTipFormProps {
  creatorId: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: Error) => void;
}

export function CreateTipComponent({
  creatorId,
  onSuccess,
  onError,
}: CreateTipFormProps) {
  const { createTip, loading, error, data } = useCreateTip();
  const [amount, setAmount] = useState<number>(10);
  const [message, setMessage] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    try {
      // Validate input using exported schema before sending
      const tipInput = Schemas.Payment.createTip.parse({
        amount,
        currency: 'USD',
        creatorId,
        message: message || undefined,
        idempotencyKey: uuidv4(),
      });

      // Call the hook
      const result = await createTip(tipInput);

      if (result?.transactionId) {
        onSuccess?.(result.transactionId);
        // Reset form
        setAmount(10);
        setMessage('');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create tip';
      setValidationError(errorMsg);
      onError?.(err instanceof Error ? err : new Error(errorMsg));
    }
  };

  return (
    <div className="tip-form">
      <h2>Send a Tip to This Creator</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (USD)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message (optional)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            disabled={loading}
            placeholder="Share your appreciation with this creator"
          />
          <small>{message.length}/500</small>
        </div>

        {validationError && (
          <div className="error-message">⚠️ {validationError}</div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error instanceof PaymentError ? error.message : 'An error occurred'}
          </div>
        )}

        {data && (
          <div className="success-message">
            ✅ Tip sent! Transaction ID: {data.transactionId}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Processing...' : `Send $${amount.toFixed(2)} Tip`}
        </button>
      </form>

      <style jsx>{`
        .tip-form {
          max-width: 400px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }

        input,
        textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .error-message {
          color: #d32f2f;
          padding: 10px;
          background: #ffebee;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .success-message {
          color: #388e3c;
          padding: 10px;
          background: #e8f5e9;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .btn-primary {
          width: 100%;
          padding: 12px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1565c0;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        small {
          display: block;
          color: #999;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
