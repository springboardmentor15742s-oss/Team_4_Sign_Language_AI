import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = ['Learner', 'Instructor', 'Accessibility Trainer', 'Administrator']

export default function RegisterPage() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Learner',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Register with a role for RBAC (Learner, Instructor, Trainer, Admin).</p>
      <form onSubmit={onSubmit} className="form">
        <label>
          Full name
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            minLength={2}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
            minLength={8}
            placeholder="Min 8 chars, letter + number"
          />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => update('role', e.target.value)}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="muted">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
