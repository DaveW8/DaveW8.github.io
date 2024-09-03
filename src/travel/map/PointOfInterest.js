import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PointOfInterest = ({open, onClose, data}) => {
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
				<h2>{data.label ? data.label : "Placeholder"}</h2>
				<p>{data.details.description ? data.details.description : "Placeholder"}</p>
			</Box>
		</Modal>
	)
}

export default PointOfInterest;