import Logo from '../../assets/images/logoipsum_full.png'

const PulseLoader = () => {
  return (
    <div className="loader">
      <img src={Logo} alt="Loading..." className="loader__logo" />
    </div>
  )
}

export default PulseLoader
