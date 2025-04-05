import * as React from 'react';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import 'animate.css';
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// })

type CustomDialogPropType = {
    open: boolean;
    handleClose: () => void;
    Dialog_fullWidth?: boolean;
    title: string;
    text: string;
    children?: React.ReactNode;
    maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    IconButton_display?: 'none' | 'flex';
    textSize?: string;
    
};


const CustomDialog: React.FC<CustomDialogPropType> = (props) => {

    const {
        open = false,
        handleClose,
        Dialog_fullWidth,
        title,
        text,
        children,
        maxWidth,
        IconButton_display,
        textSize

    } = props;



    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <>
            <Dialog
                fullScreen={isMobile} // فقط در حالت موبایل تمام صفحه باشد
                dir='rtl'
                // maxWidth={maxWidth ? maxWidth : 'sm'}
                maxWidth={maxWidth ? maxWidth : 'sm'}
                fullWidth={Dialog_fullWidth ?? true}
                open={open}
                // TransitionComponent={(props) => <Transition {...props}><div>{props.children}</div></Transition>}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >




                <IconButton
                    aria-label="close"
                    onTouchEnd={handleClose}
                    onClick={(e) => {
                        handleClose();
                        e.currentTarget.blur(); // فوکوس را از دکمه حذف می‌کند
                    }}
                    // className="z-2"
                    sx={{
                        position: 'absolute',
                        display: IconButton_display ? IconButton_display : "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        right: 8,
                        top: 2,
                        // border: "1px solid red",
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon className="IconButton closeIcon" sx={{ borderRadius: "50%" }} />

                </IconButton >


                <DialogTitle
                    sx={{ m: 0, py: 1, px: 2, fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" } }}
                    id="customized-dialog-title"
                    className='bg-gradient-to-l from-purple-600 via-purple-700 to-purple-900 text-white chart_title'>
                    {title}
                </DialogTitle>

                <DialogContent sx={{ zIndex: 10, mt: 2, p: { xs: 1, sm: 1, md: 1 } }}>
                    <Typography gutterBottom className='' sx={{ my: 0, fontSize: textSize ?? "1rem" }}>
                        {text}
                    </Typography>
                    <div className=' h-full relative'>
                        {children}
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
};

export default CustomDialog;