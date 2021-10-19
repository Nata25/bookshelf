import * as React from 'react'
import {Modal, ModalContents, ModalOpenButton} from '../modal'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('can be opened and closed', () => {
	const modalContent = 'Fake text'
	const modalTitle = 'Modal title'
	const modalLabel = 'Modal'
	const openButtonLabel = 'Open modal'
	render(
		<Modal>
			<ModalOpenButton>
				<button>{openButtonLabel}</button>
			</ModalOpenButton>
			<ModalContents
				title={modalTitle}
				aria-label={modalLabel}
			>
				{modalContent}
			</ModalContents>
		</Modal>)
	userEvent.click(screen.getByText(openButtonLabel))
	const modal = screen.getByRole('dialog')
	expect(modal).toBeInTheDocument()
	expect(modal).toHaveAttribute('aria-label', modalLabel)
	expect(modal).toContainElement(screen.getByText(modalContent))
	const inModal = within(modal)
	expect(inModal.getByRole('heading', {name: modalTitle}))
	userEvent.click(inModal.getByRole('button', {name: /close/i}))
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
