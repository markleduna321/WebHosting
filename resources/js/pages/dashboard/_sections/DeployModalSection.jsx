import React, { useState } from 'react'
import { Modal, Input, Button } from 'antd'

export default function DeployModalSection({ open, onCancel, onCreate }) {
  const [websiteName, setWebsiteName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [repositoryUrl, setRepositoryUrl] = useState('')

  const handleCreate = () => {
    onCreate?.({ websiteName, subdomain, repositoryUrl })
  }

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
          Paste repository
        </label>

        <Input
          size="large"
          placeholder="https://github.com/username/repository.git"
          value={repositoryUrl}
          onChange={(e) => setRepositoryUrl(e.target.value)}
        />
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
  )
}