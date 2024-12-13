// FileUpload.js
// Purpose: Provides a drag & drop or browse interface for file selection,
// shows a progress bar during uploading, and lists uploaded files.
// Uses MUI components for styling and layout.

import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// Styled drop area
const DropArea = styled(Box)(({ theme, isDragging }) => ({
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isDragging ? '#f0f0f0' : '#fafafa',
  marginBottom: theme.spacing(2),
  transition: 'background-color 0.3s ease',
}));

function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]); // files waiting to be uploaded
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  // Handle file input changes
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploadQueue(files);
  };

  // Handle drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
    setUploadQueue(files);
  };

  // Trigger file input dialog
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (uploadQueue.length === 0) return;

    // We will upload files one by one for demonstration
    const file = uploadQueue[0];
    setUploadingFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      },
    })
    .then((res) => {
      if (res.data.success) {
        setUploadedFiles([...uploadedFiles, file.name]);
      }
    })
    .catch((err) => {
      console.error('Upload error:', err);
    })
    .finally(() => {
      // Remove the file from the queue and reset progress
      const remainingQueue = uploadQueue.slice(1);
      setUploadQueue(remainingQueue);
      setUploadProgress(0);
      setUploadingFileName(null);
    });
  };

  // If we have files in the queue, start uploading the first one
  React.useEffect(() => {
    if (uploadQueue.length > 0 && !uploadingFileName) {
      handleUpload();
    }
  }, [uploadQueue, uploadingFileName]);

  const handleRemoveUploadedFile = (fileName) => {
    setUploadedFiles(uploadedFiles.filter((f) => f !== fileName));
  };

  return (
    <Card variant="outlined" style={{ padding: '20px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Upload</Typography>
        
        {/* Drop area or browse */}
        <DropArea 
          isDragging={dragging ? 1 : 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <CloudUploadIcon style={{ fontSize: 40, color: '#888' }} />
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Drag & drop files or <span style={{ color: '#5b4eff', cursor: 'pointer', textDecoration: 'underline' }}>Browse</span>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
          </Typography>
        </DropArea>

        <input 
          type="file" 
          multiple 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {/* Show uploading progress if we have a file currently uploading */}
        {uploadingFileName && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading - {uploadQueue.length + 1}/{selectedFiles.length} files
            </Typography>
            <Paper elevation={1} style={{ padding: '10px', marginBottom: '10px' }}>
              <Typography variant="body2" gutterBottom>
                {uploadingFileName}
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Paper>
          </Box>
        )}

        {/* Show uploaded files */}
        {uploadedFiles.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Uploaded
            </Typography>
            <List dense>
              {uploadedFiles.map((file) => (
                <ListItem key={file}>
                  <ListItemText primary={file} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveUploadedFile(file)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {selectedFiles.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpload}
              disabled={uploadQueue.length === 0 || uploadingFileName !== null}
            >
              UPLOAD FILES
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default FileUpload;
