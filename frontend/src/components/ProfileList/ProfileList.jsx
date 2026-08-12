import ProfileCard from "../profile/ProfileCard"

import "./ProfileList.css"

function ProfileList({ profiles }) {

    if (profiles.length === 0) {
        return (
            <div className="empty-state">
                <h2>No developers found</h2>
                <p>Try adjusting your search or filters.</p>
            </div>
        );
    }

    return (
        <div className="profile-list">
            {profiles.map(profile => (
                <ProfileCard
                    key={profile.id}
                    profile={profile}
                />
            ))}
        </div>
    );
}

export default ProfileList