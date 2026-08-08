import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          SignLang AI
        </Link>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/datasets">Datasets</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <button type="button" className="linkish" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register" className="cta-nav">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        Team 4 · Sign Language Learning & Assessment Platform · Infosys Springboard
      </footer>
    </div>
  )
}
