import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CourseReviewPage = ({ courseId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const api = 'http://localhost:5000/api';


  const fetchReviews = async () => {
    const res = await axios.get(`http://localhost:5000/api/reviews/course/${courseId}`);
    setReviews(res.data);
  };

  
  const fetchAverage = async () => {
    const res = await axios.get(`http://localhost:5000/api/reviews/average/${courseId}`);
    setAvgRating(Number(res.data.average).toFixed(1));
  };

  
  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/reviews`, {
        userId,
        courseId,
        rating,
        comment,
      });
      setMsg('Review submitted successfully!');
      setRating(5);
      setComment('');
      fetchReviews();
      fetchAverage();
    } catch (err) {
      setMsg('Error submitting review.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverage();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Course Reviews</h2>

      {avgRating && (
        <div className="mb-4">
          <strong>Average Rating:</strong> {avgRating} / 5 ⭐
        </div>
      )}

      <form onSubmit={submitReview} className="mb-4 border p-3 rounded shadow-sm bg-light">
        <h5>Leave a Review</h5>

        <div className="mb-3">
          <label className="form-label">Rating (1–5 Stars)</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows="3"
            maxLength="300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
        {msg && <div className="mt-2 alert alert-info">{msg}</div>}
      </form>

      <div>
        <h5>All Reviews</h5>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="border rounded p-3 mb-3 bg-white shadow-sm"
            >
              <strong>{rev.rating} ⭐</strong>
              <p className="mb-1">{rev.comment}</p>
              <small className="text-muted">
                User ID: {rev.userId} | {new Date(rev.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviewPage;
