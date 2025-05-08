import { useSnackbar } from 'notistack'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'

const useSnack = () => {
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const snack = props => {
    const { text = '', variant = 'info' } = props
    enqueueSnackbar(text, {
      variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'left'
      },
      style: { direction: 'rtl' },
      autoHideDuration: 2000, // مدت زمان نمایش اسنک در میلیثانیه
      action: key => (
        <>
          <div className='absolute left-0 mx-2'>
            <IconButton
              size='small'
              onClick={() => closeSnackbar(key)}
              style={{ color: 'white' }}
            >
              <CancelIcon className='snack-closeIcon text-2xl' />

              {/* <FontAwesomeIcon
                icon='fal fa-times-circle'
                className='snack-closeIcon text-2xl'
              /> */}
            </IconButton>
          </div>
        </>
      )
    })
  }

  return snack
}

export default useSnack
