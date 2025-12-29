import { useRouteError, Link } from 'react-router-dom'
import useTitle from '../hooks/useTitle'

const ErrorPage = () => {
  useTitle('Oops!')
  const error = useRouteError()

  return (
    <div>
      <h1>Oops!</h1>
      <p>Looks like something went wrong.</p>
      <p>
        <i>{error.statusText}</i>
      </p>

      <Link to="/">Go back</Link>
    </div>
  )
}

export default ErrorPage
