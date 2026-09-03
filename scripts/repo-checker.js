#!/usr/bin/env node
// scripts/repo-checker.js
// Minimal GitHub repository checker that reads license and README via the GitHub API.

const { Octokit } = require('@octokit/rest')
const fs = require('fs')

async function run(repo){
  const token = process.env.GITHUB_API_TOKEN || null
  const octokit = new Octokit({ auth: token })
  const [owner,name] = repo.split('/')
  try{
    const repoRes = await octokit.repos.get({ owner, repo: name })
    const license = await octokit.repos.getLicense({ owner, repo: name }).catch(()=>null)
    const readme = await octokit.repos.getReadme({ owner, repo: name }).catch(()=>null)

    const out = {
      repo: repo,
      description: repoRes.data.description,
      license: license ? { name: license.data.license?.name, spdx_id: license.data.license?.spdx_id, html_url: license.data.html_url } : null,
      readme: readme ? Buffer.from(readme.data.content, 'base64').toString('utf8').slice(0,2000) : null,
      updated_at: repoRes.data.updated_at,
      html_url: repoRes.data.html_url
    }

    console.log(JSON.stringify(out, null, 2))
  }catch(err){
    console.error('error', err.message)
    process.exit(2)
  }
}

if (!process.argv[2]){
  console.error('Usage: node scripts/repo-checker.js owner/repo')
  process.exit(1)
}
run(process.argv[2])
