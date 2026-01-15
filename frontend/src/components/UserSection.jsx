const UserSection = ({ title, subtitle, description, children }) => (
  <>
    <section className="user__heading">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <p>{description}</p>
    </section>

    <section className="user__actions">{children}</section>
  </>
)

export default UserSection
