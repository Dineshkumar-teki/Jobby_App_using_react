import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {eachJobItem} = props
  const {
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
    location,
    rating,
    id,
  } = eachJobItem
  return (
    <li className="jobItem">
      <Link to={`/jobs/${id}`}>
        <div className="jobCard">
          <div className="companyLogoCard">
            <img src={companyLogoUrl} alt="company logo" />
            <div className="titleAndRating">
              <h1>{title}</h1>
              <div className="ratingCard">
                <FaStar className="startIcon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="locationAndPackage">
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
            <p className="packagePerAnnum">{packagePerAnnum}</p>
          </div>
          <hr />
          <h2 className="jobdescriptionTitle">Description</h2>
          <p className="jobdescription">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
