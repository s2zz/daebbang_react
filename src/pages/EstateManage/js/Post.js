import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from '../css/Post.module.css';
import DaumPostcode from "react-daum-postcode";

function Post(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const complete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        props.setcompany({
            ...props.company,
            zipcode: data.zonecode,
            address1: fullAddress,
            address2: data.sigungu + data.bname1 + " " + data.bname2
        })

        handleClose();
    }

    return (
        <>
            <Button className={style.estateBtn} onClick={handleShow}>우편번호 찾기</Button>

            <Modal show={show} onHide={handleClose}>
                <div>
                    <DaumPostcode autoClose onComplete={complete} />
                </div>
            </Modal>
        </>
    )
}
export default Post;