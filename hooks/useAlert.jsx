import Swal from 'sweetalert2';

const useAlert = () => {

    const showSuccess = ({ title, text = '', timer = 2000 }) => {
        Swal.fire({
            icon: 'success',
            title,
            text,
            timer,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    };

    const showError = ({ title, text = '' }) => {
        Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonText: 'باشه'
        });
    };

    const showWarning = ({ title, text = '' }) => {
        Swal.fire({
            icon: 'warning',
            title,
            text,
            confirmButtonText: 'فهمیدم'
        });
    };

    const showConfirm = async ({ title, text = '', confirmButtonText = 'بله', cancelButtonText = 'خیر' }) => {
        return await Swal.fire({
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
        });
    };


    return {
        showSuccess,
        showError,
        showWarning,
        showConfirm
    };
};

export default useAlert;
