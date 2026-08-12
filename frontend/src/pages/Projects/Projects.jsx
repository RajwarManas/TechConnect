import { useState, useEffect } from "react"
import { getProjects } from "../../api/projects"

import ProjectList from "../../components/projects/ProjectList"
import TextInput from "../../components/forms/TextInput"
import SelectField from "../../components/forms/SelectField"
import SkillSelector from "../../components/forms/SkillSelector"
import { getSkills } from "../../api/skills"
import "./Projects.css"

function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [ordering, setOrdering] = useState("-created_at")
    const [skills, setSkills] = useState([])
    const [requiredSkills, setRequiredSkills] = useState([])

    async function loadProjects() {
        try {
            const data = await getProjects({
                search: debouncedSearch,
                status,
                ordering,
                requiredSkills,
            })
            setProjects(data.results)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect (() => {
        loadProjects()
    }, [debouncedSearch, status, ordering, requiredSkills])

    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await getSkills()
                setSkills(data.results)
            } catch (error) {
                console.error(error)
            }
        }
    
        loadSkills()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)
    
        return () => clearTimeout(timer)
    }, [search])

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="projects-page">
            <h1> Projects </h1>
            <div className="projects-layout">
                <aside className="filters-panel">
                    <TextInput
                    label="Search"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    />
                    <SelectField
                        label="Status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="All Statuses"
                        disablePlaceholder={false}
                        options={[
                            { value: "RECRUITING", label: "Recruiting" },
                            { value: "FULL", label: "Full" },
                            { value: "COMPLETED", label: "Completed" },
                        ]}
                    />
                    <SelectField
                        label="Sort By"
                        name="ordering"
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                        options={[
                            { value: "-created_at", label: "Newest First" },
                            { value: "created_at", label: "Oldest First" },
                            { value: "-updated_at", label: "Recently Updated" },
                            { value: "updated_at", label: "Least Recently Updated" },
                            { value: "title", label: "Title (A-Z)" },
                            { value: "-title", label: "Title (Z-A)" },
                        ]}
                    />
                    <SkillSelector
                        label="Required Skills"
                        skills={skills}
                        selectedSkills={requiredSkills}
                        onChange={setRequiredSkills}
                    />
                </aside>
                <section className="projects-results">
                    <ProjectList projects={projects} />
                </section>
            </div>
        </div>
    )

}

export default Projects