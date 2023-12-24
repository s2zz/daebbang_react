import React, { useState,useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import style from "../commons/Modal.module.css";

function Buttons(args) {
  //첫번째 일단 모달창
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  //alert
  const [modal3, setModal3] = useState(false);

  const toggle3 = () => setModal3(!modal3);

  
  //모달을 자동으로 닫게 해주려면 이 코드를 추가 하시면 됩니다.(옵션)
  /*useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => {
        setModal(false);
      }, 3000); // 3초 후에 모달이 닫히도록 설정
      return () => clearTimeout(timer);
    }
  }, [modal]);*/

  //이중 모달창
  const [modal1, setModal1] = useState(false);
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);

  const toggle1 = () => setModal1(!modal1);
  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setCloseAll(false);
  };
  const toggleAll = () => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
  };
  
  return (
    <div>
      {/* 첫번째 모달 */}
      <div>
        <Button color="danger" onClick={toggle}>
          모달 열기
        </Button>
        <Modal isOpen={modal} toggle={toggle} {...args} >
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Do Something
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/* alert */}
      {/* import style from "../commons/Modal.module.css";이거 무조건 추가해야합니다 */}
      <div>
        <Button color="danger" onClick={toggle3} >
          alert
        </Button>
        <Modal isOpen={modal3} toggle={toggle3} backdrop={false} className={style.mydiv}>
          <ModalBody style={{paddingTop:'30px',position:'relative',left:'20px'}}>
            제목을 입력해주세요.
            <br></br>
            <Button color="primary" onClick={toggle3} style={{marginTop:'20px',fontSize:'small',position:'relative',left:'380px'}}>
              확인
            </Button>{' '}
          </ModalBody>
        </Modal>
      </div>

      {/* 이중모달 */}
      <div>
        <Button color="danger" onClick={toggle1}>
          이중 모달 열기
        </Button>
        <Modal isOpen={modal1} toggle={toggle1}>
          <ModalHeader toggle={toggle1}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            <br />
            <Button color="success" onClick={toggleNested}>
              Show Nested Modal
            </Button>
            <Modal
              isOpen={nestedModal}
              toggle={toggleNested}
              onClosed={closeAll ? toggle : undefined}
            >
              <ModalHeader>Nested Modal title</ModalHeader>
              <ModalBody>Stuff and things</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={toggleNested}>
                  Done
                </Button>{' '}
                <Button color="secondary" onClick={toggleAll}>
                  All Done
                </Button>
              </ModalFooter>
            </Modal>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle1}>
              Do Something
            </Button>{' '}
            <Button color="secondary" onClick={toggle1}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Buttons;