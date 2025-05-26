import requests
import os

def download_s3_file(url, output_path):
    """
    Downloads a file from a public S3 URL to the specified local path.
    
    Args:
        url (str): The public S3 URL of the file
        output_path (str): Local path where the file should be saved
        
    Returns:
        bool: True if download was successful, False otherwise
    """
    try:
        # Send a GET request to the URL
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raises an HTTPError if the status is 4xx, 5xx
        
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Write the file to disk in chunks to handle large files efficiently
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading file: {e}")
        return False


# import uuid

# url = "https://rp-projects-public.s3.amazonaws.com/1736350118327-WhatsApp+Video+2025-01-08+at+19.02.55.mp4"
# output_path = fr"D:\Python\python_projects_docker\recruitment_project\download\{uuid.uuid4()}_sample.mp4"
# success = download_s3_file(url, output_path)