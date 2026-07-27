import { useLocation } from "react-router-dom";

const NewModelErrorPage = () => {
  const { state } = useLocation();

  return (
    <div style={{ padding: "40px", textAlign: "center",   }}>
      <p>{state?.message || "Something went wrong"}</p>
    </div>
  );
};

export default NewModelErrorPage;
