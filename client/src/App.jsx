import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <ul>
        <li>
          <Link to="/carts/new">Skapa inlägg</Link>
        </li>
        <li>
          <Link to="/">Affär</Link>
        </li>
      </ul>
      <Outlet />
    </>
  );
}

export default App;
