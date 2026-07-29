import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <section className="panel">
      <h1>Learner dashboard</h1>
      <p className="lede">
        Welcome back, <strong>{user?.name}</strong>. Role: <span className="pill">{user?.role}</span>
      </p>
      <div className="grid">
        <article className="stat">
          <h2>Next step</h2>
          <p>Complete your learner profile so lessons and assessments can personalize to you.</p>
          <Link className="btn ghost" to="/profile">
            Edit profile
          </Link>
        </article>
        <article className="stat">
          <h2>Coming modules</h2>
          <ul>
            <li>Gesture recognition engine</li>
            <li>Accuracy assessment</li>
            <li>AI feedback & progress analytics</li>
          </ul>
        </article>
      </div>
    </section>
  )
}
