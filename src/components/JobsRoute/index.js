import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const locationsList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const statesView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobsRoute extends Component {
  state = {
    userProfile: [],
    employmentTypes: [],
    locations: [],
    salaryRanges: '',
    searchInput: '',
    jobsList: [],
    profileViewStatus: statesView.initial,
    jobsViewStatus: statesView.initial,
  }

  componentDidMount() {
    this.getUserProfileDetails()
    this.getJobsDetailsList()
  }

  // gets job details from api

  getJobsDetailsList = async () => {
    this.setState({jobsViewStatus: statesView.loading})
    const {salaryRanges, searchInput, employmentTypes, locations} = this.state
    const employmentTypesInStr = employmentTypes.join(',')
    const stringifiedLocations = locations.join(',')
    console.log(stringifiedLocations)
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesInStr}&minimum_package=${salaryRanges}&search=${searchInput}&location=${stringifiedLocations}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    if (response.ok) {
      const {jobs} = data
      const formatedData = jobs.map(eachOne => ({
        companyLogoUrl: eachOne.company_logo_url,
        employmentType: eachOne.employment_type,
        jobDescription: eachOne.job_description,
        packagePerAnnum: eachOne.package_per_annum,
        id: eachOne.id,
        location: eachOne.location,
        rating: eachOne.rating,
        title: eachOne.title,
      }))
      this.setState({
        jobsList: formatedData,
        jobsViewStatus: statesView.success,
      })
    } else {
      this.setState({jobsViewStatus: statesView.failure})
    }
  }

  // gets profile details from api

  getUserProfileDetails = async () => {
    this.setState({profileViewStatus: statesView.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    if (response.ok) {
      const formatedData = {
        profileDetails: data.profile_details,
      }
      const {profileDetails} = formatedData
      const userProfileData = {
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
        name: profileDetails.name,
      }
      this.setState({
        userProfile: userProfileData,
        profileViewStatus: statesView.success,
      })
    } else {
      this.setState({profileViewStatus: statesView.failure})
    }
  }

  getEmployeeTypeOption = id => {
    const {employmentTypes} = this.state
    if (employmentTypes.includes(id)) {
      this.setState(
        prevState => ({
          employmentTypes: prevState.employmentTypes.filter(
            eachId => eachId !== id,
          ),
        }),
        this.getJobsDetailsList,
      )
    } else {
      this.setState(
        prevState => ({
          employmentTypes: [...prevState.employmentTypes, id],
        }),
        this.getJobsDetailsList,
      )
    }
  }

  getSelectedLocation = id => {
    const {locations} = this.state
    if (locations.includes(id)) {
      this.setState(
        prevState => ({
          locations: prevState.locations.filter(eachId => eachId !== id),
        }),
        this.getJobsDetailsList,
      )
    } else {
      this.setState(
        prevState => ({locations: [...prevState.locations, id]}),
        this.getJobsDetailsList,
      )
    }
  }

  getSelectedSalaryRange = id => {
    this.setState({salaryRanges: id}, this.getJobsDetailsList)
  }

  userSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getJobsDetailsList)
  }

  reloadProfileUrl = () => {
    this.getUserProfileDetails()
  }

  getProfileStatus = () => {
    const {userProfile, profileViewStatus} = this.state
    const {profileImageUrl, name, shortBio} = userProfile
    switch (profileViewStatus) {
      case statesView.success:
        return (
          <div className="profileCard">
            <img src={profileImageUrl} alt="profile" />
            <h1>{name}</h1>
            <p>{shortBio}</p>
          </div>
        )
      case statesView.failure:
        return (
          <div className="profileloader">
            <button
              type="button"
              className="retryBtn"
              onClick={this.reloadProfileUrl}
            >
              Retry
            </button>
          </div>
        )
      case statesView.loading:
        return (
          <div data-testid="loader" className="profileloader">
            <Loader type="ThreeDots" color="#4f46e5" width={80} height={80} />
          </div>
        )
      default:
        return null
    }
  }

  reloadJobsListUrl = () => {
    this.getJobsDetailsList()
  }

  displayJobsList = () => {
    const {jobsList} = this.state
    // console.log(jobsList)
    if (jobsList.length > 0) {
      return (
        <ul className="jobsListCard">
          {jobsList.map(eachJobItem => (
            <JobItem eachJobItem={eachJobItem} key={eachJobItem.id} />
          ))}
        </ul>
      )
    }
    return (
      <div className="noJobsView">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  getjobsViewStatus = () => {
    const {jobsViewStatus} = this.state
    switch (jobsViewStatus) {
      case statesView.success:
        return <>{this.displayJobsList()}</>
      case statesView.failure:
        return (
          <div className="failureView">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking fro.</p>
            <button
              type="button"
              className="retryBtn"
              onClick={this.reloadJobsListUrl}
            >
              Retry
            </button>
          </div>
        )
      case statesView.loading:
        return (
          <div data-testid="loader" className="loaderjobs">
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
        <div className="jobsRouteContainer">
          <div className="userInputContainserMobile">
            <input
              type="search"
              className="userSerachInput"
              placeholder="Search..."
              onChange={this.userSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="searchButton"
              aria-label="search"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="profileAndFilters">
            {this.getProfileStatus()}
            <hr />
            <div className="employmentTypesListCard">
              <h1>Type of Employment</h1>
              <ul className="checkboxes">
                {employmentTypesList.map(eachItem => {
                  const onChangeEmployeType = () => {
                    this.getEmployeeTypeOption(eachItem.employmentTypeId)
                  }
                  return (
                    <li
                      key={eachItem.employmentTypeId}
                      className="eachcheckbox"
                    >
                      <input
                        type="checkbox"
                        id={eachItem.employmentTypeId}
                        onChange={onChangeEmployeType}
                      />
                      <label htmlFor={eachItem.employmentTypeId}>
                        {eachItem.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <hr />
            <div className="salariesListCard">
              <h1>Salary Range</h1>
              <ul className="checkboxes">
                {salaryRangesList.map(eachItem => {
                  const onChangeSalaryItem = () => {
                    this.getSelectedSalaryRange(eachItem.salaryRangeId)
                  }
                  return (
                    <li key={eachItem.salaryRangeId} className="eachcheckbox">
                      <input
                        type="radio"
                        name="salary"
                        id={eachItem.salaryRangeId}
                        onChange={onChangeSalaryItem}
                      />
                      <label htmlFor={eachItem.salaryRangeId}>
                        {eachItem.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <hr />
            <div className="locationsListCard">
              <h1>Location</h1>
              <ul className="checkboxes">
                {locationsList.map(eachPoint => {
                  const onChangeLocation = () => {
                    this.getSelectedLocation(eachPoint.locationId)
                  }
                  return (
                    <li key={eachPoint.locationId} className="eachcheckbox">
                      <input
                        type="checkbox"
                        id={eachPoint.locationId}
                        onChange={onChangeLocation}
                      />
                      <label htmlFor={eachPoint.locationId}>
                        {eachPoint.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="jobsAndSearch">
            <div className="userInputContainser">
              <input
                type="search"
                className="userSerachInput"
                placeholder="Search..."
                onChange={this.userSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="searchButton"
                aria-label="search"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getjobsViewStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default JobsRoute
