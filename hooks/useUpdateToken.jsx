
import { useNavigate } from 'react-router-dom';
// import { useUpdate_TokenMutation } from '../../api/apiSlice';
import useSnack from './useSnack';
import { useDispatch } from 'react-redux';
import { timer_value } from '../../feature/slice/timer_slice';
import { getCookie, setcookie } from '../function/cookie';

const useUpdateToken = () => {

    const [update_Token, {
        data: data_token,
        isLoading: isLoading_token,
        isSuccess: isSuccess_token,
        isError: isError_token,
        error: error_token
    }] = useUpdate_TokenMutation();

    const navigate = useNavigate();
    const snack = useSnack();
    const dispatch = useDispatch();





    const handleToken_status = () => {
        let token = getCookie("set_audio_ai_access");
        let refresh = getCookie("set_audio_ai_refresh");

        if (token && refresh) {
            update_Token({ token, refresh })
                .then(response => {
                    if (response.data) {
                        setcookie("set_audio_ai_access", response.data.access, response.data.expire);
                        setcookie("set_audio_ai_refresh", response.data.refresh, response.data.expire);
                        dispatch(timer_value((response.data.expire) + Math.random() * 0.5))
                        //console.log'ثبت توکن جدید در کوکی');
                    } else if (response.error) {
                        if (response.error.data?.code == 'token_not_valid') {
                            snack({ text: 'نشست شما به پایان رسیده است', variant: 'error' })
                            navigate('/');
                        }
                        //console.log"error>>", response.error);
                    }
                })
                .catch(error => {
                    navigate('/');
                });
        } else {
            snack({ text: 'نشست شما به پایان رسیده است', variant: 'error' })
            navigate('/');
        }
    };

    return { handleToken_status, data_token, isLoading_token, isSuccess_token, isError_token, error_token };
};

export default useUpdateToken;
