import { Link } from 'react-router-dom'

const RedirectAction = ({ text, linkText, to }) => {
  return (
    <div className="redirect">
      <p>
        {text}{' '}
        <Link to={to} aria-label={`${linkText} page`}>
          {linkText}
        </Link>
      </p>
    </div>
  )
}

export default RedirectAction
