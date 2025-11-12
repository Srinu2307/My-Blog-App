import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './blog.css';

const API_BASE_URL = `https://my-blog-app-backend-1-8j1a.onrender.com/api/posts`;

// Header Component
const Header = ({ onLogout }) => (
  <div className="header">
    <button onClick={onLogout} className="logout-button">
      Logout
    </button>
    <h1 className="page-title">Blog Module</h1>
  </div>
);

// Post Form Component
const PostForm = ({ formData, editingPostId, fileInputRef, onSubmit, onChange }) => (
  <div className="form-section">
    <h2>{editingPostId ? 'Edit Post' : 'Create a New Post'}</h2>
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Author Name"
        name="author"
        value={formData.author}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Post Title"
        name="title"
        value={formData.title}
        onChange={onChange}
      />
      <textarea
        placeholder="Post Content"
        name="content"
        value={formData.content}
        onChange={onChange}
      ></textarea>
      <div className="file-input-container">
        <label>Upload Image: </label>
        <input 
          type="file"
          name="image"
          ref={fileInputRef}
          onChange={onChange}
          accept="image/png, image/jpg, image/jpeg"
        />
      </div>
      <button type="submit" className="submit-button">
        {editingPostId ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  </div>
);

// Post Card Component
const PostCard = ({ post, onEdit, onDelete }) => (
  <div className="post-card">
    <div className="post-content">
      <h3>{post.title}</h3>
      <p className="post-author">by {post.author}</p>
      {post?.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="post-image"
        />
      )}
      <p>{post.content}</p>
    </div>
    <div className="post-actions">
      <button onClick={() => onEdit(post)}>Edit</button>
      <button onClick={() => onDelete(post._id)}>Delete</button>
    </div>
  </div>
);

// Main Blog Module
function BlogModule() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    image: null
  });
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [token, navigate]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', content: '', image: null });
    setEditingPostId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });

    const url = editingPostId ? `${API_BASE_URL}/${editingPostId}` : API_BASE_URL;
    const method = editingPostId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: submitData
      });

      if (response.ok) {
        resetForm();
        fetchPosts();
        alert(editingPostId ? 'Post updated successfully!' : 'Post created successfully!');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      author: post.author,
      content: post.content,
      image: null
    });
    setEditingPostId(post._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="App-container">
      <Header onLogout={handleLogout} />
      
      <PostForm
        formData={formData}
        editingPostId={editingPostId}
        fileInputRef={fileInputRef}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />

      <div className="posts-section">
        <h2>Latest Posts</h2>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogModule;
