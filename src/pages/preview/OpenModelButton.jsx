import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OpenModelButton = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleClick = () => {
    const modelId = "01kbprvn3rv8jf3h1kn8zknvkd";
    const bgColor = "#272727";

    navigate(
      `/render/model/${modelId}` +
      `?token=${token}` +
      `&bg=${encodeURIComponent(bgColor)}` +
      `&ar=1`
    );
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 20px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        margin: "10px auto",
        cursor: "pointer",
      }}
    >
      Open Model
    </button>
  );
};

export default OpenModelButton;
