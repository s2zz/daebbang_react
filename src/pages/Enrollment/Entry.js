import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
const Entry = (props) => {
    const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);
  
    return (
        <div>
        <Button color="primary" onClick={toggleModal}>
          Open Modal
        </Button>
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Modal Title</ModalHeader>
          <ModalBody>
            This is the content of the modal.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

export default Entry;
