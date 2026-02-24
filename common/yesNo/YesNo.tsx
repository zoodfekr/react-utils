import { Button } from '@heroui/react'
import React from 'react'
import MagnetButton from '../../min_components/MagnetButton';
import Image from 'next/image';


interface YesNoProps {
    onSubmit: () => void;
    onReset: () => void;
    submitText?: string;
    resetText?: string;
    className?: string;
    isSubmitting?: boolean;
}

const YesNo = ({ onSubmit, onReset, submitText = 'ثبت', resetText = 'لغو', className, isSubmitting = false }: YesNoProps) => {


    const handleRenderImage = (name) => (<Image src={`/web/${name}.png`} alt='' width='25' height='25' />)

    const renderSubmitButtomIcon = (string) => {
        switch (string) {
            case 'ذخیره':
            case 'تایید':
            case 'ثبت': return handleRenderImage('verified')
            case 'ارسال نامه': return handleRenderImage('send')
            case 'لغو':
            case 'انصراف': return handleRenderImage('cancel')
            case 'استخراج':
            case 'بایگانی': return handleRenderImage('folder')
            case 'حذف': return handleRenderImage('delete')
            case 'جستجو': return handleRenderImage('search')
            case 'بازنشانی': return handleRenderImage('redo')
            case 'خروج': return handleRenderImage('exit')
            default: return null
        }
    }


    return (
        <>
            <div className={`flex gap-2  justify-between ${className} relative`}>
                <MagnetButton   >
                    <Button
                        className='beauty_hover'
                        type="reset"
                        variant="flat"
                        onClick={onReset}
                        disabled={isSubmitting}
                    >
                        {renderSubmitButtomIcon(resetText)}
                        {resetText}
                    </Button>
                </MagnetButton   >

                <MagnetButton   >
                    <Button
                        className='beauty_hover'
                        color="primary"
                        type="submit"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {renderSubmitButtomIcon(submitText)}
                        {submitText}
                    </Button>
                </MagnetButton   >


            </div>
        </>
    )
}

export default YesNo