import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {similarJobObj} = props
  const formatedData = {
    companyLogoUrl: similarJobObj.company_logo_url,
    employmentType: similarJobObj.employment_type,
    jobDescription: similarJobObj.job_description,
    id: similarJobObj.id,
    location: similarJobObj.location,
    rating: similarJobObj.rating,
    title: similarJobObj.title,
  }
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = formatedData
  return (
    <div className="similarJobBgCard">
      <div className="companyLogoCard">
        <img src={companyLogoUrl} alt="similar job company logo" />
        <div className="titleAndRating">
          <h1 className="similarComTitle">{title}</h1>
          <div className="ratingCard">
            <FaStar className="startIcon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <h2 className="jobdescriptionTitle">Description</h2>
      <p className="jobdescription">{jobDescription}</p>
      <div className="locAndEmp">
        <div className="locationCard">
          <IoLocationSharp className="locationIcon" />
          <p>{location}</p>
        </div>
        <div className="employmentTypeCard">
          <BsBriefcaseFill className="caseIcon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </div>
  )
}

export default SimilarJobCard
