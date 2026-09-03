import { Octokit } from '@octokit/rest'

export async function checkRepo(owner:string, repo:string, token?:string){
  const octokit = new Octokit({ auth: token })
  const r = await octokit.repos.get({ owner, repo })
  let license = null
  try{ const lic = await octokit.repos.getLicense({ owner, repo }); license = lic.data }catch(e){}
  let readme = null
  try{ const rd = await octokit.repos.getReadme({ owner, repo }); readme = Buffer.from(rd.data.content, 'base64').toString('utf8').slice(0,2000)}catch(e){}
  return { repo: `${owner}/${repo}`, description: r.data.description, license, readme, updated_at: r.data.updated_at }
}
