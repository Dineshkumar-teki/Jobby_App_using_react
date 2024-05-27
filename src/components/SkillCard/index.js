import './index.css'

const SkillCard = props => {
  const {eachSkill} = props
  const formatedData = {
    name: eachSkill.name,
    imageUrl: eachSkill.image_url,
  }
  const {name, imageUrl} = formatedData
  return (
    <div className="skillCard">
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </div>
  )
}

export default SkillCard
