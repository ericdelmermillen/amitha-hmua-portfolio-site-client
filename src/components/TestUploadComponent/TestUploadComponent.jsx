import { useState } from 'react';

const TestUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (!selectedFile) {
      setIsLoading(false);
      setErrorMessage("Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        body: formData,
      });

      console.log(formData)


      if (response.ok) {
        console.log('File uploaded successfully!');
        setSelectedFile(null); // Clear file selection after successful upload
      } else {
        setErrorMessage('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during upload. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Test Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default TestUploadComponent;