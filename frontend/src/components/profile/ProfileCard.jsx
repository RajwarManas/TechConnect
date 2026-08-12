import { useNavigate } from "react-router-dom";

import "./ProfileCard.css";

function ProfileCard({ profile }) {
    const navigate = useNavigate();

    const truncatedBio =
        profile.bio && profile.bio.length > 120
            ? profile.bio.slice(0, 120) + "..."
            : profile.bio;

    return (
        <div className="profile-card">

            <div className="profile-card-header">
                <div className="profile-avatar">
                    {profile.username.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2>{profile.username}</h2>

                    <p className="profile-college">
                        {profile.college || "No College"}
                    </p>
                </div>
            </div>

            <p className="profile-bio">
                {truncatedBio || "No bio added yet."}
            </p>

            <div className="profile-meta">

                <span>
                    🎓 {profile.branch || "-"}
                </span>

                <span>
                    📅 {profile.graduation_year || "-"}
                </span>

            </div>

            <div className="profile-status">

                <span className="availability-badge">
                    {profile.availability}
                </span>
                
                <span className="lookingfor-badge">
                    {profile.looking_for}
                </span>

            </div>

            <div className="profile-skills">

                {profile.skills.slice(0, 4).map(skill => (
                    <span
                        key={skill.id}
                        className="skill-tag"
                    >
                        {skill.name}
                    </span>
                ))}

                {profile.skills.length > 4 && (
                    <span className="skill-tag">
                        +{profile.skills.length - 4}
                    </span>
                )}

            </div>

            <button
                className="view-profile-btn"
                onClick={() => navigate(`/profiles/${profile.id}`)}
            >
                View Profile
            </button>

        </div>
    );
}

export default ProfileCard;