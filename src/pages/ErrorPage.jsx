import { NavLink } from "react-router-dom";
export default function ErrorPage() {
  return (
    <>
      <nav>
        <NavLink to="" className={({ isActive }) => (isActive ? "active" : "")}>
          Wordl
        </NavLink>
      </nav>
      <h2
        style={{ textAlign: "center", fontSize: "2.2rem", marginTop: "30px" }}
      >
        This page doesn't exist
      </h2>
    </>
  );
}
