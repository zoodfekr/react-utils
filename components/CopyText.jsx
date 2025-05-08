
import React from 'react';
import { Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from "@nextui-org/react";
import { enqueueSnackbar } from "notistack";



const CopyText = ({ children, text }) => {


    const snack = (props) => {
        const { text = "user", variant = "info" } = props;
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(text, {
            variant,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'left'
            },
            style: { direction: 'rtl' }
        });
    }

    // مپی متن در حالت https
    // const handleCopy = async () => {
    //     try {
    //         await navigator.clipboard.writeText(text);
    //         snack({ text: "متن کپی شد", variant: "info" })
    //     } catch (err) {
    //         snack({ text: "متن کپی نشد", variant: "error" })
    //     }
    // };

    // کپی متن در حالت http
    const handleCopy = () => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'متن کپی شد' : 'متن کپی نشد';
            snack({ text: msg, variant: successful ? "info" : "error" });
        } catch (err) {
            snack({ text: "متن کپی نشد", variant: "error" });
        }
        document.body.removeChild(textArea);
    };


    return (
        <Box className="text_box" >
            {children}

            <Box sx={{ minWidth: "8px", minHeight: "10px", position: "relative" }}>
                <Button
                    size="sm"
                    className='text_data'
                    isIconOnly
                    style={{
                        padding: 0,
                        color: "#1B4F72",
                        background: "rgba(0,0,0,0)",
                        position: "absolute",
                        top: -10

                    }}
                    onClick={handleCopy}>
                    <ContentCopyIcon sx={{ fontSize: "14px" }}></ContentCopyIcon>
                </Button>
            </Box>

        </Box>
    );
};

export default CopyText;
