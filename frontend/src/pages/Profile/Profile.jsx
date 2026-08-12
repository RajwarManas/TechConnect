import { useState, useEffect } from "react"

import { getMyProfile } from "../../api/profile"

import ProfileForm from "../../components/profile/ProfileForm"
import ProfileDetails from "../../components/profile/ProfileDetails"

import "./Profile.css"

function Profile() {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setEditing] = useState(false)

    useEffect(() => {

        async function loadProfile() {

            try {

                const data = await getMyProfile()
                setProfile(data);

            } catch (error) {

                console.error(error)

            } finally {

                setLoading(false)

            }

        }

        loadProfile()

    }, [])

    function handleSave(updatedProfile) {
        setProfile(updatedProfile)
        setEditing(false)
    }

    function handleCancel() {
        setEditing(false)
    }

    if (loading) {
        return <h2>Loading...</h2>
    }

    if (!profile) {
        return <h2>Unable to load profile.</h2>
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                {isEditing ? (
                    <ProfileForm
                        profile={profile}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ) : (
                    <ProfileDetails
                        profile={profile}
                        onEdit={() => setEditing(true)}
                    />
                )}
            </div>
        </div>
    )
}

export default Profile