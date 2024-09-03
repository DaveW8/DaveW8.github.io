import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PointOfInterest = ({open, onClose}) => {
	return (
		<Modal 
			open={open}
			onClose={onClose}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '20px', // Adjust for spacing from edges
			}}
		>
			<Box sx={{
				width: '80vw', // Adjust the width as needed
				height: '80vh', // Adjust the height as needed
				maxWidth: '90vw',
				maxHeight: '90vh',
				bgcolor: 'background.paper',
				borderRadius: 2,
				boxShadow: 24,
				p: 4,
				overflow: 'auto',
				position: 'relative',
				margin: 'auto'
			}}>
				<IconButton
					edge="end"
					color="inherit"
					onClick={onClose}
					aria-label="close"
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
					}}
				>
					<CloseIcon />
				</IconButton>
				<h2>Modal Title</h2>
				<p>This is a larger modal with more content. It covers most of the screen.</p>
			</Box>
		</Modal>
	)
}

export default PointOfInterest;