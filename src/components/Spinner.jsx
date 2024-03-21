import ClipLoader from 'react-spinners/ClipLoader'

const Spinner = (loading) => {
  return (
    <div className='text-center py-20'>
      <ClipLoader color='#4338CA' loading={loading} />
    </div>
  )
}

export default Spinner
