import React, { useState } from 'react'
import { Modal, Input, Button, Select, Tag, message } from 'antd'
import { useGetGithubRepositoriesQuery } from '@/features/github/githubApi'
import { useCreateWebsiteMutation } from '@/features/websites/websitesApi'

export default function DeployModalSection({ open, onCancel, onCreate }) {
  const [websiteName, setWebsiteName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [repositoryFullName, setRepositoryFullName] = useState(undefined)

  // Only hit GitHub while the modal is actually open.
  const {
    data: repositories = [],
    isFetching,
    isError,
    error,
    refetch,
  } = useGetGithubRepositoriesQuery(undefined, { skip: !open })

  const [createWebsite, { isLoading: isCreating, error: createError }] =
    useCreateWebsiteMutation()

  const fieldErrors = createError?.data?.errors ?? {}

  const needsReconnect = error?.status === 403
  const selectedRepository = repositories.find(
    (repo) => repo.full_name === repositoryFullName,
  )
  const canCreate = Boolean(websiteName && subdomain && selectedRepository)

  const resetForm = () => {
    setWebsiteName('')
    setSubdomain('')
    setRepositoryFullName(undefined)
  }

  const handleCreate = async () => {
    try {
      const website = await createWebsite({
        name: websiteName,
        subdomain,
        repository_full_name: selectedRepository.full_name,
        repository_default_branch: selectedRepository.default_branch,
      }).unwrap()

      message.success('Site queued for deployment.', 4)
      resetForm()
      onCreate?.(website?.data ?? website)
    } catch {
      // Field errors render inline; anything else surfaces as a toast.
      message.error('Could not create the site. Check the form and try again.', 4)
    }
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
        Your site goes live on a free caleho.cloud subdomain.
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
          status={fieldErrors.name ? 'error' : undefined}
        />
        {fieldErrors.name && (
          <div style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>
            {fieldErrors.name[0]}
          </div>
        )}
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
          status={fieldErrors.subdomain ? 'error' : undefined}
        />
        {fieldErrors.subdomain ? (
          <div style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>
            {fieldErrors.subdomain[0]}
          </div>
        ) : (
          <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 6 }}>
            {subdomain ? `${subdomain}.caleho.cloud` : 'your-site.caleho.cloud'}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 28 }}>
        <label htmlFor="deploy-repository" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Repository
        </label>

        {isError ? (
          <div
            role="alert"
            style={{
              border: '1px solid #fecaca',
              background: '#fef2f2',
              borderRadius: 8,
              padding: 12,
              fontSize: 13,
              color: '#b91c1c',
            }}
          >
            <p style={{ margin: 0 }}>
              {needsReconnect
                ? 'We could not reach your GitHub account. Reconnect to continue.'
                : 'Could not load your repositories.'}
            </p>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              {needsReconnect ? (
                <Button
                  size="small"
                  onClick={() => {
                    window.location.href = route('github.redirect')
                  }}
                >
                  Reconnect GitHub
                </Button>
              ) : (
                <Button size="small" onClick={refetch}>
                  Try again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Select
            id="deploy-repository"
            size="large"
            style={{ width: '100%' }}
            showSearch
            allowClear
            loading={isFetching}
            disabled={isFetching}
            value={repositoryFullName}
            onChange={setRepositoryFullName}
            placeholder={isFetching ? 'Loading repositories…' : 'Select a repository'}
            optionFilterProp="label"
            notFoundContent={
              isFetching ? 'Loading…' : 'No repositories found on your GitHub account.'
            }
            options={repositories.map((repo) => ({
              value: repo.full_name,
              label: repo.full_name,
            }))}
            optionRender={({ data }) => {
              const repo = repositories.find((r) => r.full_name === data.value)
              return (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{data.label}</span>
                  <Tag color={repo?.private ? 'orange' : 'green'} style={{ marginInlineEnd: 0 }}>
                    {repo?.private ? 'Private' : 'Public'}
                  </Tag>
                </span>
              )
            }}
          />
        )}

        {selectedRepository && (
          <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 6 }}>
            Default branch: {selectedRepository.default_branch}
          </div>
        )}
        {fieldErrors.repository_full_name && (
          <div style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>
            {fieldErrors.repository_full_name[0]}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button size="large" onClick={onCancel} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          size="large"
          type="primary"
          onClick={handleCreate}
          disabled={!canCreate || isCreating}
          loading={isCreating}
        >
          Create website
        </Button>
      </div>
    </Modal>
  )
}