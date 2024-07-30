import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import SkillCard from '../SkillCard'
import SimilarJobCard from '../SimilarJobCard'
import Header from '../Header'
import './index.css'

const statesView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    jobSpecificDetails: {},
    pageView: statesView.initial,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({pageView: statesView.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()
    if (response.ok) {
      const data1 = {
        jobItemDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobItemDetails, similarJobs} = data1
      const formatedData = {
        companyLogoUrl: jobItemDetails.company_logo_url,
        employmentType: jobItemDetails.employment_type,
        jobDescription: jobItemDetails.job_description,
        packagePerAnnum: jobItemDetails.package_per_annum,
        id: jobItemDetails.id,
        location: jobItemDetails.location,
        rating: jobItemDetails.rating,
        title: jobItemDetails.title,
        companyWebsiteUrl: jobItemDetails.company_website_url,
        lifeAtCompany: jobItemDetails.life_at_company,
        skills: jobItemDetails.skills,
      }
      this.setState({
        jobSpecificDetails: formatedData,
        pageView: statesView.success,
        similarJobs,
      })
    } else {
      this.setState({pageView: statesView.failure})
    }
  }

  displaySuccessView = () => {
    const {jobSpecificDetails, similarJobs} = this.state
    const {
      title,
      companyLogoUrl,
      employmentType,
      jobDescription,
      packagePerAnnum,
      location,
      rating,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobSpecificDetails
    const lifeAtCompanyForm = {
      description: lifeAtCompany.description,
      imageUrl: lifeAtCompany.image_url,
    }
    const {description, imageUrl} = lifeAtCompanyForm
    return (
      <div className="jobBgContainer">
        <div className="jobCard jobSpecificCard">
          <div className="companyLogoCard">
            <img src={companyLogoUrl} alt="job details company logo" />
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
          <hr className="hr" />
          <div className="descriptionAndWebsiteUrl">
            <h2 className="jobdescriptionTitle">Description</h2>
            <a
              href={companyWebsiteUrl}
              className="websiteLink"
              target="_blank"
              rel="noreferrer"
            >
              Visit <FaExternalLinkAlt />
            </a>
          </div>
          <p className="jobdescription">{jobDescription}</p>
          <h2 className="jobdescriptionTitle">Skills</h2>
          <ul className="skillsContainer">
            {skills.map(eachSkill => (
              <SkillCard eachSkill={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h2 className="jobdescriptionTitle">Life at Company</h2>
          <div className="companyLifeStyle">
            <p>{description}</p>
            <img src={imageUrl} alt="" />
          </div>
        </div>
        <div className="similarJobsbgContainer">
          <h1 className="similarJobsTitle">Similar Jobs</h1>
          <ul className="similarJobsContainer">
            {similarJobs.map(similarJob => (
              <SimilarJobCard similarJobObj={similarJob} key={similarJob.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  reloadjobDetails = () => {
    this.getJobItemDetails()
  }

  displayPageView = () => {
    const {pageView} = this.state
    switch (pageView) {
      case statesView.success:
        return <>{this.displaySuccessView()}</>
      case statesView.failure:
        return (
          <div className="failureView jobSpecificFailure">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking fro.</p>
            <button
              type="button"
              className="retryBtn"
              onClick={this.reloadjobDetails}
            >
              Retry
            </button>
          </div>
        )
      case statesView.loading:
        return (
          <div data-testid="loader" className="loader">
            <Loader type="ThreeDots" color="#4f46e5" width={80} height={80} />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.displayPageView()}
      </>
    )
  }
}

export default JobItemDetails
