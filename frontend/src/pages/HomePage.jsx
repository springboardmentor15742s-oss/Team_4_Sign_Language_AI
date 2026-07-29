import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <section className="hero">
      <p className="eyebrow">Team 4 · Infosys Springboard</p>
      <h1>Sign Language Learning & Assessment Platform</h1>
      <p className="lede">
        Learn sign language with interactive lessons, real-time gesture recognition, and AI-driven
        feedback. This scaffold wires up the frontend and backend for authentication, roles, and
        learner profiles.
      </p>
      <div className="actions">
        {user ? (
          <Link className="btn primary" to="/dashboard">
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link className="btn primary" to="/register">
              Get started
            </Link>
            <Link className="btn ghost" to="/login">
              Log in
            </Link>
          </>
        )}
      </div>
      <ul className="feature-list">
        <li>JWT authentication & role-based access</li>
        <li>Learner profile management</li>
        <li>Ready for gesture recognition modules</li>
      </ul>
    </section>
  )
}
