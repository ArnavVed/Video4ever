// App.js
// Purpose: Main app that renders the FileUpload component in a clean layout.

import React from 'react';
import { Container, Typography } from '@mui/material';
import FileUpload from './FileUpload';

function App() {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Upload File
      </Typography>
      <FileUpload />
    </Container>
  );
}

export default App;
