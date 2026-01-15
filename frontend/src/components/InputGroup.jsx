const InputGroup = ({
  label,
  icon: Icon,
  type,
  name,
  id,
  placeholder,
  ...attributes
}) => {
  return (
    <div className="form__group">
      <label htmlFor={id}>{label}</label>

      <div className="form__group form__group--addon">
        <span className="form__icon">
          {Icon && <Icon color="hsl(220, 10%, 46%)" />}
        </span>

        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          required
          {...attributes}
        />
      </div>
    </div>
  )
}

export default InputGroup
