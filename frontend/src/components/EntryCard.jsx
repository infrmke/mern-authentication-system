const EntryCard = ({ title, description, onSubmit, children, buttonText }) => {
  return (
    <>
      <h1>{title}</h1>
      {description && <p>{description}</p>}

      <form className="form" onSubmit={onSubmit}>
        {children}

        <button type="submit" className="btn btn--warning">
          {buttonText}
        </button>
      </form>
    </>
  )
}

export default EntryCard
