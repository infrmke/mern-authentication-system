import toast from 'react-hot-toast'

const useFormSubmit = (submitFunction) => {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      await submitFunction(data)
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something didn't work. Try again."

      toast.error(message)
    }
  }

  return { handleSubmit }
}

export default useFormSubmit
