import { useNavigate } from "react-router-dom";

export default function RefreshButton() {
  const navigate = useNavigate();

  return (
    <button aria-label="refresh button" className="btn-refresh" type="button" onClick={() => navigate(0)}>🔁 Try Refresh Route</button>
  );
}
