import { useEffect, useState } from "react";

import { getProfiles } from "../../api/profile";

import TextInput from "../../components/forms/TextInput";
import SelectField from "../../components/forms/SelectField";
import SkillSelector from "../../components/forms/SkillSelector";
import ProfileList from "../../components/ProfileList/ProfileList.jsx";

import { getSkills } from "../../api/skills";
import {
    availabilityOptions,
    lookingForOptions,
} from "../../constants/ProfileOptions";

import "./Profiles.css";

function Profiles() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [availability, setAvailability] = useState("");
    const [lookingFor, setLookingFor] = useState("");
    const [ordering, setOrdering] = useState("graduation_year")

    const [page, setPage] = useState(1);
    const [totalProfiles, setTotalProfiles] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [appliedFilters, setAppliedFilters] = useState({
        search: "",
        availability: "",
        looking_for: "",
        ordering: "graduation_year",
        skill: [],
    });

    async function loadProfiles(filters, pageNumber = 1) {
        setLoading(true)
    
        try {
            const data = await getProfiles({
                ...filters,
                page: pageNumber,
            });
    
            setProfiles(data.results);
            setTotalProfiles(data.count);
            setTotalPages(Math.ceil(data.count / 9));
            setPage(pageNumber);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    function handleSearch() {
        const filters = {
            search,
            availability,
            looking_for: lookingFor,
            ordering,
            skill: selectedSkills,
        }

        setAppliedFilters(filters)
        loadProfiles(filters, 1)
    }
    
    function handleClearFilters() {
        setSearch("");
        setSelectedSkills([]);
        setAvailability("");
        setLookingFor("");
        setOrdering("graduation_year");

        const filters = {
            search: "",
            availability: "",
            looking_for: "",
            ordering: "graduation_year",
            skill: [],
        };

        setAppliedFilters(filters);
        loadProfiles(filters, 1);
    }

    function handlePreviousPage() {
        if (page > 1) {
            loadProfiles(appliedFilters, page - 1);
        }
    }
    
    function handleNextPage() {
        if (page < totalPages) {
            loadProfiles(appliedFilters, page + 1);
        }
    }

    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await getSkills();
                setSkills(data.results);
            } catch (error) {
                console.error(error);
            }
        }

        loadSkills();
    }, []);

    useEffect(() => {
        loadProfiles({
            search: "",
            availability: "",
            looking_for: "",
            ordering: "graduation_year",
            skill: [],
        }, 1);
    }, []);

    if (loading) {
        return <h2>Loading Profiles...</h2>;
    }

    return (
        <div className="profiles-page">

            <div className="profiles-layout">

                <aside className="filters-panel">

                    <TextInput
                        label="Search"
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search developers..."
                    />

                    <SkillSelector
                        label="Skills"
                        skills={skills}
                        selectedSkills={selectedSkills}
                        onChange={setSelectedSkills}
                    />

                    <SelectField
                        label="Availability"
                        name="availability"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="All"
                        disablePlaceholder={false}
                        options={availabilityOptions}
                    />

                    <SelectField
                        label="Looking For"
                        name="looking_for"
                        value={lookingFor}
                        onChange={(e) => setLookingFor(e.target.value)}
                        placeholder="All"
                        disablePlaceholder={false}
                        options={lookingForOptions}
                    />

                    <SelectField
                        label="Sort By"
                        name="ordering"
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                        options={[
                            {
                                value: "graduation_year",
                                label: "Graduation Year ↑",
                            },
                            {
                                value: "-graduation_year",
                                label: "Graduation Year ↓",
                            },
                            {
                                value: "college",
                                label: "College A-Z",
                            },
                            {
                                value: "-college",
                                label: "College Z-A",
                            },
                        ]}
                    />

                    

                    <div className="filter-actions">
                        <button
                            type="button"
                            className="clear-filters-btn"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>

                        <button
                            type="button"
                            className="apply-filters-btn"
                            onClick={handleSearch}
                        >
                            Apply Filters
                        </button>
                    </div>

                </aside>

                <section className="profile-results">

                    <ProfileList profiles={profiles} />

                    <div className="pagination-bar">

                        <div className="results-count">
                            {totalProfiles} developer{totalProfiles !== 1 ? "s" : ""} found
                        </div>

                        <div className="pagination-controls">

                            <button
                                type="button"
                                className="pagination-btn"
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                            >
                                ← Previous
                            </button>

                            <span className="page-info">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                type="button"
                                className="pagination-btn"
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                            >
                                Next →
                            </button>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Profiles;