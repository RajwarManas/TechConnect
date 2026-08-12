import "./ProfileDetails.css"

function ProfileDetails({ profile, onEdit }) {
    return (
        <div className="profile-details">

            <div className="profile-header">

                <div>
                    <h1>My Profile</h1>
                    <p className="profile-subtitle">
                        Keep your profile updated so teammates can find you.
                    </p>
                </div>

                <button
                    className="edit-btn"
                    onClick={onEdit}
                >
                    Edit Profile
                </button>

            </div>

            <div className="profile-section">

                <h3>About</h3>

                <div className="profile-grid">

                    <div className="profile-item">
                        <strong>Bio</strong>
                        <p>{profile.bio || "-"}</p>
                    </div>

                    <div className="profile-item">
                        <strong>College</strong>
                        <p>{profile.college || "-"}</p>
                    </div>

                    <div className="profile-item">
                        <strong>Branch</strong>
                        <p>{profile.branch || "-"}</p>
                    </div>

                    <div className="profile-item">
                        <strong>Graduation Year</strong>
                        <p>{profile.graduation_year || "-"}</p>
                    </div>

                </div>

            </div>

            {console.log(profile.skills)}
            <div className="profile-section">

                <h3>Skills</h3>

                <div className="skills-container">
                    {profile.skills.length > 0 ? (
                        profile.skills.map(skill => (
                            <span
                                key={skill.id}
                                className="skill-tag"
                            >
                                {skill.name}
                            </span>
                        ))
                    ) : (
                        <p>No skills added.</p>
                    )}
                </div>

            </div>

            <div className="profile-section">

                <h3>Preferences</h3>

                <div className="profile-grid">
                    <div className="profile-item">
                        <strong>Looking For</strong>
                        <p>{profile.looking_for || "-"}</p>
                    </div>
                    <div className="profile-item">
                        <strong>Availability</strong>
                        <p>{profile.availability || "-"}</p>
                    </div>
                    <div className="profile-item">
                        <strong>Email Visibility</strong>
                        <p>{profile.email_visibility || "-"}</p>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <h3>Links</h3>
                <div className="profile-grid">
                    <div className="profile-item">
                        <strong>GitHub</strong>
                        <p>{profile.github_url || "-"}</p>
                    </div>
                    <div className="profile-item">
                        <strong>LinkedIn</strong>
                        <p>{profile.linkedin_url || "-"}</p>
                    </div>
                    <div className="profile-item">
                        <strong>Portfolio</strong>
                        <p>{profile.portfolio_url || "-"}</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProfileDetails