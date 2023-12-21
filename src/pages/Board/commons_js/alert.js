import Swal from 'sweetalert2';
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
            title: str==="즐겨찾기" ? `${str}를 정말 삭제하시겠습니까?` : `${str}을 정말 삭제하시겠습니까?`,
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
            title:`${str}에 추가하시겠습니까?`,
            text: "",
            icon: "question",
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