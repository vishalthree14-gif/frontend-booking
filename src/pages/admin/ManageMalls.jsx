import React, {useEffect, useState } from "react";
import API from "../../api/axiosIntance";
import { useNavigate } from "react-router-dom";

const ManageMalls = () => {
    
    const navigate = useNavigate();

    const [malls, setMalls] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        city: "",
        description: "",
        imageUrl: "",
    });
    
    const [loading, setLoading] = useState(false);

    // fetch all malls
    const fetchMalls = async () => {

        try{
            const res = await API.get("/api/admin/getMalls");
            setMalls(res.data.malls);

        }catch(error){
            console.log(error);
            alert("failed to fetch malls");
        }
    };

    useEffect(() => {
        fetchMalls();
    }, []);


    // create mall

    const handleCreateMall = async (e) =>{
        e.preventDefault();
        setLoading(true);

        try{
            const res = await API.post("/api/admin/add", formData);
            alert("Mall added!");
            setFormData({
                name:"",
                location:"",
                city:"",
                description: "",
                imageUrl: "",
            });

            fetchMalls();
        }
        catch(error){
            console.log(error);
            alert(error.response?.data?.message || "Failed to add mall");
        }
        setLoading(false);
    };

  // -------------------------------
  // Delete Mall
  // -------------------------------
  const deleteMall = async (id) => {
    if (!window.confirm("Delete this mall?")) return;

    try {
      await API.delete(`/api/admin/mall/${id}`);
      alert("Mall deleted!");
      setMalls(malls.filter((m) => m._id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete mall");
    }
  };

    const viewMall = (id) => {
        navigate(`/admin/malls/${id}`);
    };


    return(

        <div style={{ padding: "20px" }}>
            <h2>Manage Malls</h2>

            {/* -------------------------
                Add Mall Form
            -------------------------- */}
            <form onSubmit={handleCreateMall} style={{ marginBottom: "30px" }}>
                <input
                type="text"
                placeholder="Mall Name"
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                required
                />
                <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                }
                required
                />
                <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                }
                required
                />

                <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                required
                ></textarea>

                <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
                />

                <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Mall"}
                </button>
            </form>

            {/* -------------------------
                Display Malls
            -------------------------- */}
            <div>
                <h3>Mall List</h3>
                {malls.length === 0 ? (
                <p>No malls available</p>
                ) : (
                malls.map((mall) => (
                    <div
                    key={mall._id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                    }}
                    >
                    <h4>{mall.name}</h4>
                    <p>
                        <strong>Location:</strong> {mall.location}
                    </p>
                    <p>
                        <strong>City:</strong> {mall.city}
                    </p>
                    <p>{mall.description}</p>

                    {mall.imageUrl && (
                        <img
                        src={mall.imageUrl}
                        alt={mall.name}
                        width="150"
                        style={{ borderRadius: "10px", marginTop: "10px" }}
                        />
                    )}

                    <br />


                <button
                style={{ marginTop: "5px", background: "white", color: "#171515ff" }}
                onClick={() => viewMall(mall._id)}
                >
                View
                </button>

                <button
                style={{ marginTop: "10px", marginLeft:"15px", background: "red", color: "#fff" }}
                onClick={() => deleteMall(mall._id)}
                >
                Delete
                </button>



                    </div>
                ))
                )}
            </div>
            </div>

    )
}

export default ManageMalls;
