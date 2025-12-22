import { useRouteError, Link } from 'react-router-dom'

const Error = () => {
  const error = useRouteError()
  console.log(error)

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

export default Error
