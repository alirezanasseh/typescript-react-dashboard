import React, {useMemo, useState} from 'react';
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './styles.scss';
import {Button, Modal} from 'react-bootstrap';
import { getCroppedImg } from './canvasUtils';

const MODAL_WIDTH = 466;

interface IImageCropper {
    handleCroppedImage: (file: Blob) => void;
    field?: string;
    default?: string;
    error?: boolean;
    width?: number;
    height?: number;
}

export default function ImageCropper(props: React.PropsWithChildren<IImageCropper>) {
    const [crop, setCrop] = useState<Crop>({
        aspect: 1,
        width: props.width ?? 250,
        height: props.height ?? 250,
        unit: 'px',
        x: 0,
        y: 0
    });
    const [image, setImage] = useState('');
    const [finalImage, setFinalImage] = useState<Blob>();
    const [modalOpen, setModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [showEditOverlay, setShowEditOverlay] = useState(false);

    const defaultImage = useMemo(() => props.default, [props.default]);

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        let files = e.currentTarget.files;
        if(files && files[0]){
            let reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setModalOpen(true);
            };
            reader.readAsDataURL(files[0]);
            setFileName(files[0].name);
        }else{
            setImage('');
        }
    };

    const handleFinalImage = (Image: Blob) => {
        setFinalImage(Image);
        setModalOpen(false);
        props.handleCroppedImage(Image);
        setImage('');
    };

    const sendFile = async () => {
        try {
            let pic = document.createElement('img');
            pic.src = image;
            if(pic.width > MODAL_WIDTH) {
                let scale = pic.width / MODAL_WIDTH;
                pic.width /= scale;
                pic.height /= scale;
            }
            const croppedImage = await getCroppedImg(pic, crop, fileName);
            handleFinalImage(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    const hideModal = () => {
        setFinalImage(undefined);
        setImage('');
        setModalOpen(false);
        let fileInput = document.getElementById('file');
        if(fileInput) fileInput.setAttribute('value', '');
        setCrop({
            aspect: 1,
            width: 250,
            height: 250,
            unit: 'px',
            x: 0,
            y: 0
        });
    };

    const triggerClickOnFileInput = () => {
        const fileInput = document.getElementById(props.field ?? 'file');
        if(fileInput){
            fileInput.click();
        }
    };

    return (
        <>
            {(finalImage || defaultImage) && !props.error &&
                <div className={'crop-image-container'}>
                    <img
                        className={'crop-image-cropped'}
                        src={finalImage ? URL.createObjectURL(finalImage) : defaultImage}
                        alt={'Cropped Image'}
                        onClick={triggerClickOnFileInput}
                        onMouseEnter={() => setShowEditOverlay(true)}
                    />
                    {showEditOverlay &&
                        <div
                            className={'crop-image-edit-overlay'}
                            onClick={triggerClickOnFileInput}
                            onMouseLeave={() => setShowEditOverlay(false)}
                        >
                            <i className={'bi bi-pencil-square'}/>
                        </div>
                    }
                </div>
            }
            <div className={(finalImage || defaultImage) && !props.error ? 'hidden' : 'crop-image-file-input-container'}>
                <input type={'file'} id={props.field ?? 'file'} className={'pic-upload-input'} onChange={handleFileChange}/>
            </div>
            <Modal show={modalOpen} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crop Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactCrop
                        src={image}
                        crop={crop}
                        onChange={newCrop => setCrop(newCrop)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={'primary'}
                        onClick={sendFile}
                    >
                        Send
                    </Button>
                    <Button
                        variant={'default'}
                        onClick={hideModal}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}