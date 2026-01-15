const ResendAction = ({ onResend, timer, isResending }) => {
  return (
    <div className="resend" aria-live="polite">
      <p>Didn't receive the code?</p>

      <button
        type="button"
        className="btn btn--link"
        onClick={onResend}
        aria-disabled={timer > 0 || isResending}
        disabled={timer > 0 || isResending}
      >
        {timer > 0 ? `Resend in ${timer}s` : isResending ? 'Sending...' : 'Resend code'}
      </button>
    </div>
  )
}

export default ResendAction
