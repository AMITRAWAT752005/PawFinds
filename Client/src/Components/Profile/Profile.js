import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/UseAuthContext';

const Profile = () => {
    const { user, dispatch } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [tempValues, setTempValues] = useState({ name: user.userName, email: user.email });
    const [errors, setErrors] = useState([]);
    const [succMessage, setSuccMessage] = useState("");

    const handleChange = (e) => {
        setTempValues({ ...tempValues, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setErrors([]);
        setSuccMessage("");

        const newEmail = tempValues.email.toLowerCase();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: tempValues.name, email: user.email, newEmail })
            });

            const json = await response.json();

            if (!response.ok) {
                setErrors([json.error]);
                setTimeout(() => setErrors([]), 3000);
            } else {
                const updatedUser = { ...user, userName: json.updatedUser.name, email: json.updatedUser.email };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                dispatch({ type: 'LOGIN', payload: updatedUser });
                setTempValues({ name: json.updatedUser.name, email: json.updatedUser.email });
                setSuccMessage("Profile updated successfully!");
                setTimeout(() => setSuccMessage(""), 3000);
                setIsEditing(false);
            }
        } catch (error) {
            setErrors(["Network error. Please try again."]);
            setTimeout(() => setErrors([]), 3000);
        }
    };

    const handleCancel = () => {
        setTempValues({ name: user.userName, email: user.email });
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <div className="profile-field">
                    <label>Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={tempValues.name}
                            onChange={handleChange}
                            className="profile-input"
                        />
                    ) : (
                        <span>{user.userName}</span>
                    )}
                </div>
                <div className="profile-field">
                    <label>Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={tempValues.email}
                            onChange={handleChange}
                            className="profile-input"
                        />
                    ) : (
                        <span>{user.email}</span>
                    )}
                </div>
                <div className="profile-buttons">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="profile-save-btn">Save</button>
                            <button onClick={handleCancel} className="profile-cancel-btn">Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="profile-edit-btn">Edit Profile</button>
                    )}
                </div>
            </div>
            <br />
            <div className="password-reset-info">
                <p>If you want to change your password, please log out and then use the "Forgot Password" feature.</p>
            </div>


            {succMessage.length > 0 && (
                <div className="profile-errors-container">
                    <div className="profile-error profile-Succ-msg">
                        {succMessage}
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className="profile-errors-container">
                    {errors.map((error, index) => (
                        <div key={index} className="profile-error">
                            {error}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;