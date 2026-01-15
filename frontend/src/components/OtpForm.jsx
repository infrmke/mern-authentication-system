import ResendAction from './ResendAction'

const OtpForm = ({ logic, title, description }) => {
  const {
    otp,
    type,
    timer,
    isSubmitting,
    isResending,
    isError,
    inputRefs,
    handleOtpSubmit,
    handleResend,
    handleChange,
    handleKeyDown,
    handlePaste,
  } = logic

  const isOtpComplete = otp.every((digit) => digit !== '')
  const otpType = type === 'VERIFY' ? 'Verification' : 'Password reset'

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
          <div className="form__group form__group--otp" role="group" aria-label={`${otpType} code`}>
            {otp.map((number, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={number}
                ref={(element) => (inputRefs.current[index] = element)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined} // apenas recebe ctrl+v no primeiro input
                disabled={isSubmitting}
                aria-label={`Digit ${index + 1} of ${otp.length}`}
                aria-required="true"
                aria-invalid={isError ? 'true' : 'false'}
              />
            ))}
          </div>

          <div className="sr-only" aria-live="polite">
            {isSubmitting ? 'Verifying code...' : isOtpComplete ? 'Code entered' : ''}
          </div>

          <button
            type="submit"
            className="btn btn--warning"
            disabled={!isOtpComplete || isSubmitting}
            aria-busy={isSubmitting}
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
