import ResendAction from './ResendAction'

const OtpForm = ({ logic, title, description }) => {
  const {
    otp,
    timer,
    isSubmitting,
    isResending,
    inputRefs,
    handleOtpSubmit,
    handleResend,
    handleChange,
    handleKeyDown,
    handlePaste,
  } = logic

  return (
    <>
      <div className="entry fade-in">
        <h1>{title}</h1>
        <p>{description}</p>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault()
            handleOtpSubmit(otp.join(''))
          }}
        >
          <div className="form__group form__group--otp">
            {otp.map((number, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={number}
                aria-label={`${index + 1}° digit`}
                ref={(element) => (inputRefs.current[index] = element)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined} // apenas recebe ctrl+v no primeiro input
                disabled={isSubmitting}
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn--warning"
            disabled={otp.some((digit) => digit === '') || isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Confirm'}
          </button>
        </form>
      </div>

      <ResendAction onResend={handleResend} timer={timer} isResending={isResending} />
    </>
  )
}

export default OtpForm
