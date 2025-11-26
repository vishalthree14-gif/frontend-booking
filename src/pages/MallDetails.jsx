import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MallDetails = () => {

    const { id } = useParams();
    const [ mall, setMall ] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ loading, setLoading ] = useState(true);


    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;

    const getMallDetails = async () => {

        try{
            const res = await fetch(`${baseURL}/api/malls/${id}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setMall(data.mall);

        }catch(err){
            console.error("error fetching mall details: ", err);
        }
        setLoading(false);
    };


    const getMallReviews = async () => {

        try{
            const res = await fetch(`${baseURL}/api/ratings/mall/${id}/reviews`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            setReviews(data.reviews);

        }catch(err){
            console.log("error fetching reviews: ", err);
        }
    }


    const submitReview = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${baseURL}/api/ratings/mall/${id}/rate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail,
                userName,
                rating: Number(rating),
                comment
            })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (data.success) {
            // alert("Review submitted!");

            // refresh reviews
            getMallReviews();

            // refresh rating total
            getMallDetails();

            // reset inputs
            setUserEmail("");
            setUserName("");
            setRating("");
            setComment("");
            } else {
            alert(data.message || "Failed to submit review");
            }
        } catch (err) {
            console.log("Submit review error:", err);
        }
        };



    useEffect(()=>{
        getMallDetails();
        getMallReviews();
    }, []);


    if(loading) return <h2>Loading...</h2>
    if(!mall) return <h2> Mall not found...</h2>


    return(
        <div>

            <div className="mall-details-page">

                <img
                    src={mall.imageUrl}
                    alt={mall.name}
                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                />

                <h1>{mall.name}</h1>
                <p><strong>City: </strong>{mall.city}</p>
                <p><strong>Location:</strong> {mall.location}</p>
                <p><strong>Description:</strong> {mall.description}</p>
                <p><strong>Rating:</strong> ⭐ {mall.rating?.toFixed(1)}</p>
                <p><strong>Total Ratings:</strong> {mall.ratingCount}</p>

            </div>


            <div style={{backgroundColor: "grey", padding: "10px", borderRadius: "10px"}}>

                <h2 style={{ marginTop: "30px" }}>Mall Reviews</h2>

                <div className="review-list">
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((rev) => (
                    <div className="review-card" key={rev._id}>

                        <div style={{ display: "flex",  }}>
                        <h4 style={{ padding: "5px"}}>{rev.userEmail || "Unknown User"}</h4>
                        <p className="review-date" style={{ padding: "10px"}}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                        </div>


                        <p className="review-rating">
                        ⭐ {rev.rating} / 5
                        </p>

                        <p className="review-comment">
                        {rev.comment || "No comment"}
                        </p>


                    </div>
                    ))
                )}
                </div>


            </div>


            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f1f1f1", borderRadius: "10px" }}>
            <h3>Leave a Review</h3>

            <form onSubmit={submitReview}>
                <div style={{ marginBottom: "10px" }}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    style={{ padding: "8px", width: "300px" }}
                />
                </div>

                <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                </div>

                <div style={{ marginBottom: "10px" }}>
                <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                    style={{ padding: "8px", width: "150px" }}
                >
                    <option value="">Choose rating</option>
                    <option value="5">⭐ 5</option>
                    <option value="4">⭐ 4</option>
                    <option value="3">⭐ 3</option>
                    <option value="2">⭐ 2</option>
                    <option value="1">⭐ 1</option>
                </select>
                </div>

                <div style={{ marginBottom: "10px" }}>
                <textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: "300px", height: "80px", padding: "8px" }}
                />
                </div>

                <button type="submit" style={{ padding: "8px 15px" }}>
                Submit Review
                </button>
            </form>
            </div>


        </div>
    );
};

export default MallDetails;
