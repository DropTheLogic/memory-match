import React, { Component } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root')

class ReactModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false
		}

		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}

	afterOpenModal() {
		// bind any refs here maybe
	}

	closeModal() {
		this.setState({ modalIsOpen: false });
	}

	componentDidUpdate(prevProps) {
		if (this.props.openModal && prevProps.openModal !== this.props.openModal) {
			this.openModal();
		}
	}

	render() {
		return (
			<Modal
				isOpen={this.state.modalIsOpen}
				onAfterOpen={this.afterOpenModal}
				onRequestClose={this.closeModal}
				className="modal"
				overlayClassName="modal-overlay">
				{this.props.children}
			</Modal>
		);
	}
}

export default ReactModal;
