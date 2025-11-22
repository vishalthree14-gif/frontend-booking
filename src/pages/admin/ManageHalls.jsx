import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosIntance";
import { useNavigate } from "react-router-dom";

const ManageHalls = () => {

    const navigate = useNavigate();

  const { id: mallId } = useParams(); // mall id
  const [mall, setMall] = useState(null);
  const [halls, setHalls] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    autoGenerateSeats: true,
  });

  const [loading, setLoading] = useState(false);

  // Fetch mall + halls
  const fetchMallDetails = async () => {
    try {
      const res = await API.get(`/api/admin/${mallId}/halls`);
      setMall(res.data.mall);
      setHalls(res.data.halls || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load mall details");
    }
  };

  useEffect(() => {
    fetchMallDetails();
  }, []);

  // Create hall
  const handleCreateHall = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post(`/api/admin/${mallId}/halls`, formData);
      alert("Hall added!");
      setFormData({ name: "", autoGenerateSeats: true });
      fetchMallDetails();
    } catch (error) {
      console.log(error);
      alert("Failed to add hall");
    }

    setLoading(false);
  };

  // Delete hall
  const deleteHall = async (hallId) => {
    if (!window.confirm("Delete this hall?")) return;

    try {
      await API.delete(`/api/admin/hall/${hallId}`);
      alert("Hall deleted!");
      setHalls(halls.filter((h) => h._id !== hallId));
    } catch (error) {
      console.log(error);
      alert("Failed to delete hall");
    }
  };

  const viewShow = ( hallId ) => {

        navigate(`/admin/halls/${hallId}/shows`);
  }


  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Halls</h2>

      {/* Mall Details */}
      {mall && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{mall.name}</h3>
          <p><strong>Location:</strong> {mall.location}</p>
          <p><strong>City:</strong> {mall.city}</p>
          <p>{mall.description}</p>

          {mall.imageUrl && (
            <img
              src={mall.imageUrl}
              alt={mall.name}
              width="250"
              style={{ borderRadius: "10px", marginTop: "10px" }}
            />
          )}
        </div>
      )}

      {/* Add Hall */}
      <h3>Add Hall</h3>
      <form onSubmit={handleCreateHall} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Hall Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={formData.autoGenerateSeats}
            onChange={(e) =>
              setFormData({
                ...formData,
                autoGenerateSeats: e.target.checked,
              })
            }
          />{" "}
          Auto-generate seats?
        </label>

        <br />
        <button type="submit" style={{ marginTop: "10px" }} disabled={loading}>
          {loading ? "Adding..." : "Add Hall"}
        </button>
      </form>

      {/* Hall List */}
      <h3>Hall List</h3>
      {halls.length === 0 ? (
        <p>No halls added yet.</p>
      ) : (
        halls.map((hall) => (
          <div
            key={hall._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{hall.name}</h4>

            <button
              style={{ background: "white", color: "black", marginRight: "15px" }}
              onClick={() => viewShow(hall._id)}

            >
              View
            </button>

            <button
              style={{ background: "red", color: "white" }}
              onClick={() => deleteHall(hall._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageHalls;
