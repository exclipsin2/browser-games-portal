import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AdminPage(){
  const [ok, setOk] = useState(false)
  useEffect(()=>{
    fetch('/api/admin/check')
      .then(r=>r.json())
      .then(d=> setOk(d.ok))
  },[])

  if (!ok) return <div className="p-6">Access denied. Please sign in as an admin.</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Manage games, view logs, and run repository checks.</p>
      <div className="space-y-2">
        <a className="inline-block px-3 py-2 bg-indigo-600 rounded text-white" href="/admin/games">Manage Games</a>
        <a className="inline-block px-3 py-2 bg-gray-700 rounded text-white" href="/admin/repo-checker">Repository Checker</a>
      </div>
    </div>
  )
}
