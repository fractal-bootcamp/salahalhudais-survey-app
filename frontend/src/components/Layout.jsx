import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">Survey App</Link>
        </div>
        <div className="flex-none">
          <Link to="/create" className="btn btn-primary">Create Survey</Link>
        </div>
      </nav>
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
}