import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProfileById } from "../../api/profile";

import "./ProfileView.css";

function ProfileView() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getProfileById(id);
                setProfile(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [id]);

    if (loading) {
        return <p className="profile-view-message">Loading profile...</p>;
    }

    if (!profile) {
        return <p className="profile-view-message">Unable to load profile.</p>;
    }

    return (
        <div className="profile-view-page">

            <div className="profile-view-card">

                <div className="profile-view-header">

                    <div className="profile-avatar">
                        {profile.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1>{profile.username}</h1>

                        <p className="profile-bio">
                            {profile.bio || "No bio added yet."}
                        </p>
                    </div>

                </div>

                <div className="profile-section">

                    <h3>About</h3>

                    <div className="profile-info-grid">

                        <div className="profile-info">
                            <span>College</span>
                            <strong>{profile.college || "-"}</strong>
                        </div>

                        <div className="profile-info">
                            <span>Branch</span>
                            <strong>{profile.branch || "-"}</strong>
                        </div>

                        <div className="profile-info">
                            <span>Graduation Year</span>
                            <strong>
                                {profile.graduation_year || "-"}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="profile-section">

                    <h3>Skills & Preferences</h3>

                    <div className="profile-info-grid">

                        <div className="profile-info">
                            <span>Looking For</span>
                            <strong className="profile-badge blue">
                                {profile.looking_for || "-"}
                            </strong>
                        </div>

                        <div className="profile-info">
                            <span>Availability</span>
                            <strong className="profile-badge green">
                                {profile.availability || "-"}
                            </strong>
                        </div>

                    </div>

                    <div className="skills-section">

                        <span className="info-label">Skills</span>

                        <div className="skills-container">

                            {profile.skills?.length > 0 ? (
                                profile.skills.map(skill => (
                                    <span
                                        key={skill.id}
                                        className="skill-tag"
                                    >
                                        {skill.name}
                                    </span>
                                ))
                            ) : (
                                <span className="no-skills">
                                    No skills added.
                                </span>
                            )}

                        </div>

                    </div>

                </div>

                <div className="profile-section">

                    <h3>Links</h3>

                    <div className="profile-links">

                        {profile.github_url && (
                            <a
                                href={profile.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </a>
                        )}

                        {profile.linkedin_url && (
                            <a
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                        )}

                        {profile.portfolio_url && (
                            <a
                                href={profile.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Portfolio
                            </a>
                        )}

                        {!profile.github_url &&
                            !profile.linkedin_url &&
                            !profile.portfolio_url && (
                                <span className="no-links">
                                    No links added.
                                </span>
                            )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProfileView;