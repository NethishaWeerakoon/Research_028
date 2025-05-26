from moviepy.editor import VideoFileClip
import os
from PIL import Image
import tempfile

def extract_frames_from_video(video_path, fps=None):
    """
    Extract frames from a video file and save them as images.
    
    Args:
        video_path (str): Path to the video file
        output_dir (str, optional): Directory to save the frames. If None, creates a temp directory
        fps (float, optional): Frames per second to extract. If None, uses video's native fps
        
    Returns:
        list: List of paths to the extracted frame images
    """
    # Create temporary directory if output_dir is not specified
   
    output_dir = r"D:\Python\python_projects_docker\recruitment_project\temp_images"
    os.makedirs(output_dir, exist_ok=True)
    
    # Load the video
    video = VideoFileClip(video_path)
    
    # Use video's native fps if not specified
    if fps is None:
        fps = video.fps
    
    frame_paths = []
    
    # Extract frames
    for i, frame in enumerate(video.iter_frames(fps=fps)):
        # Convert frame to PIL Image
        pil_image = Image.fromarray(frame)
        
        # Generate output path for the frame
        frame_path = os.path.join(output_dir, f"frame_{i:04d}.jpg")
        
        # Save the frame
        pil_image.save(frame_path, quality=95)
        
        # Add path to list
        frame_paths.append(frame_path)
    
    # Close video to free resources
    video.close()
    
    return frame_paths