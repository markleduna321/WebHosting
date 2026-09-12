import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const DEPLOYMENT_OPTIONS = [
  { key: 'git', label: 'Git repository' },
  { key: 'upload', label: 'Upload files' },
  { key: 'builder', label: 'Website builder' },
];

export default function CreateWebsiteModal({ open, onCancel, onCreate }) {
  const [websiteName, setWebsiteName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [deploymentSource, setDeploymentSource] = useState('upload');

  const handleCreate = () => {
    onCreate?.({ websiteName, subdomain, deploymentSource });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={480}
      footer={null}
      title="Create new website"
    >
      <p style={{ color: '#6b7280', marginTop: -8, marginBottom: 24 }}>
        Your site goes live on a free asuratechhost.app subdomain.
      </p>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Website name
        </label>
        <Input
          size="large"
          placeholder="Capstone Demo"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Subdomain
        </label>
        <Input
          size="large"
          placeholder="capstone-demo"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
        />
        <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 6 }}>
          your-site.asuratechhost.app
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Deployment source
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          {DEPLOYMENT_OPTIONS.map((opt) => {
            const isActive = deploymentSource === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setDeploymentSource(opt.key)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: isActive ? '1px solid #2563eb' : '1px solid #e5e7eb',
                  background: isActive ? '#eff6ff' : '#fff',
                  color: isActive ? '#2563eb' : '#374151',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button size="large" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="large" type="primary" onClick={handleCreate}>
          Create website
        </Button>
      </div>
    </Modal>
  );
}