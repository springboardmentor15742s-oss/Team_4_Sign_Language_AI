import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function ProfilePage() {
  const { token, user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    learning_level: 'Beginner',
    learning_goal: '',
    preferred_language: 'ASL',
    daily_target_mins: 15,
    progress_status: 'Not Started',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/profile/me', token)
        setProfile(res.data)
        setForm({
          learning_level: res.data.learning_level,
          learning_goal: res.data.learning_goal || '',
          preferred_language: res.data.preferred_language,
          daily_target_mins: res.data.daily_target_mins,
          progress_status: res.data.progress_status,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const res = await api.put(
        '/profile/me',
        {
          ...form,
          daily_target_mins: Number(form.daily_target_mins),
        },
        token,
      )
      setProfile(res.data)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page-center">Loading profile…</div>

  return (
    <section className="panel">
      <h1>Learner profile</h1>
      <p className="muted">
        {user?.name} · {user?.email}
      </p>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}
      <form className="form form-grid" onSubmit={onSubmit}>
        <label>
          Learning level
          <select
            value={form.learning_level}
            onChange={(e) => update('learning_level', e.target.value)}
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label>
          Preferred language
          <input
            value={form.preferred_language}
            onChange={(e) => update('preferred_language', e.target.value)}
          />
        </label>
        <label className="full">
          Learning goal
          <input
            value={form.learning_goal}
            onChange={(e) => update('learning_goal', e.target.value)}
            placeholder="e.g. Master everyday ASL conversation"
          />
        </label>
        <label>
          Daily target (minutes)
          <input
            type="number"
            min={5}
            max={240}
            value={form.daily_target_mins}
            onChange={(e) => update('daily_target_mins', e.target.value)}
          />
        </label>
        <label>
          Progress status
          <input
            value={form.progress_status}
            onChange={(e) => update('progress_status', e.target.value)}
          />
        </label>
        <div className="full">
          <button className="btn primary" type="submit">
            Save profile
          </button>
        </div>
      </form>
      {profile ? (
        <p className="muted small">
          Profile ID #{profile.learner_id} · last updated{' '}
          {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : '—'}
        </p>
      ) : null}
    </section>
  )
}
