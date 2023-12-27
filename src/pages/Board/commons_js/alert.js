import Swal from 'sweetalert2';
import style from '../../commons/Modal.module.css';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

export const alertDeleteSuccess = (str) => {
    Swal.fire({
        title: `${str} 삭제에 성공하였습니다`,
        text: "",
        icon: "success"
    });
};

export const alertDeleteFailure = (str) => {
    Swal.fire({
        title: `${str} 삭제에 실패하였습니다`,
        text: "",
        icon: "error"
    });
};

export const alertDeleteConfirmation = (str) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: str === "즐겨찾기" ? `${str}를 정말 삭제하시겠습니까?` : `${str}을 정말 삭제하시겠습니까?`,
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

export const alertAddSuccess = (str) => {
    Swal.fire({
        title: `${str} 등록에 성공하였습니다`,
        text: "",
        icon: "success"
    });
};

export const alertAddFailure = (str) => {
    Swal.fire({
        title: `${str} 등록에 실패하였습니다`,
        text: "",
        icon: "error"
    });
};

export const alertAddConfirmation = (str) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: `${str}에 추가하시겠습니까?`,
            text: "",
            icon: "",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

export const AlertModal = () => {
    const [alert, setAlert] = useState(false);

    const toggle = () => setAlert(!alert);
    return (
        <div>
            <Button color="danger" onClick={toggle} >
                alert
            </Button>
            <Modal isOpen={alert} toggle={toggle} backdrop={false} className={style.alert}>
                <ModalBody className={style.alertBody}>
                    <p className={style.alertContents} >정말 삭제하시겠습니까?</p>
                    <br></br>
                    <Button color="primary" className={style.alertBtn} onClick={toggle}>
                        확인
                    </Button>{' '}
                </ModalBody>
            </Modal>
        </div>
    )
}