// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const uploadArea = document.getElementById('upload-area');
const imagePreview = document.getElementById('image-preview');
const cropBtn = document.getElementById('crop-btn');
const resetBtn = document.getElementById('reset-btn');
const tryAnotherBtn = document.getElementById('try-another-btn');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const notification = document.getElementById('notification');
const userNameInput = document.getElementById('user-name');
const userGreeting = document.getElementById('user-greeting');

const discordPopupAvatar = document.getElementById('discord-popup-avatar');
const discordPopupUsername = document.getElementById('discord-popup-username');
const discordUserTag = document.getElementById('discord-user-tag');
const discordAvatar = document.getElementById('discord-avatar');
const discordUsername = document.getElementById('discord-username');

// Platform Previews
const discordPreview = document.getElementById('discord-preview');
const twitterPreview = document.getElementById('twitter-preview');
const twitchPreview = document.getElementById('twitch-preview');
const githubPreview = document.getElementById('github-preview');

// Variables
let cropper;
let croppedImage;
let userName = '';

// Event Listeners
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
    // Remove this line that changes background color
    // uploadArea.style.backgroundColor = '#e9ecef';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
    // Remove this line that changes background color
    // uploadArea.style.backgroundColor = '#f8f9fa';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    // Remove this line that changes background color
    // uploadArea.style.backgroundColor = '#f8f9fa';
    
    if (e.dataTransfer.files.length) {
        handleFileUpload(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        handleFileUpload(fileInput.files[0]);
    }
});

cropBtn.addEventListener('click', cropImage);
resetBtn.addEventListener('click', resetCropper);
tryAnotherBtn.addEventListener('click', () => {
    step3.classList.add('hidden');
    step1.classList.remove('hidden');
    clearPreviews();
});

// Functions
function handleFileUpload(file) {
    // Save user name
    userName = userNameInput.value.trim();
    
    // Validate file type
    if (!file.type.match('image.*')) {
        showNotification('Please upload an image file (JPEG, PNG, etc.)', 'error');
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size should be less than 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        
        // Initialize cropper after the image is loaded
        imagePreview.onload = () => {
            if (cropper) {
                cropper.destroy();
            }
            
            cropper = new Cropper(imagePreview, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false
            });
            
            showNotification('Image uploaded successfully. Please crop your image.', 'success');
        };
    };
    
    reader.readAsDataURL(file);
}

function cropImage() {
    if (!cropper) return;
    
    // Get the cropped canvas
    const canvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        fillColor: '#fff'
    });
    
    if (!canvas) {
        showNotification('Failed to crop the image. Please try again.', 'error');
        return;
    }
    
    // Convert canvas to data URL
    croppedImage = canvas.toDataURL('image/png');
    
    // Generate platform previews
    generatePreviews(croppedImage);
    
    // Update greeting with user name if provided
    if (userName) {
        userGreeting.textContent = `Hello ${userName}! Below are previews of how your profile picture will appear on various platforms:`;
    }
    
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    
    showNotification('Image cropped successfully. Check out the previews!', 'success');
}

function resetCropper() {
    if (cropper) {
        cropper.reset();
    }
}

function generatePreviews(imageData) {
    // Set the Discord popup avatar
    discordPopupAvatar.src = imageData;
    // Set the Discord message avatar
    discordAvatar.src = imageData;
    
    // Set Twitter previews
    twitterPreview.src = imageData;
    document.getElementById('twitter-notification-preview').src = imageData;
    
    // Set Twitch preview
    document.getElementById('twitch-preview-1').src = imageData;
    
    // Set the Discord username to the user's entered name (or default if empty)
    const displayName = userName || 'User';
    discordUsername.textContent = displayName;
    discordPopupUsername.textContent = displayName;
    
    // Update Twitter display name and handle
    document.getElementById('twitter-display-name').textContent = displayName;
    document.getElementById('twitter-handle').textContent = '@' + displayName.toLowerCase().replace(/\s+/g, '');

    // Update Twitch username
    document.getElementById('twitch-username-1').textContent = displayName;

    // Create a lowercase tag without spaces for the user tag
    const tag = displayName.toLowerCase().replace(/\s+/g, '');
    discordUserTag.textContent = tag;
}
function clearPreviews() {
    // Clear Discord popup avatar
    discordPopupAvatar.src = '';
    // Clear Discord message avatar
    discordAvatar.src = '';
    // Clear Twitter avatar and notification preview
    twitterPreview.src = '';
    // Clear Twitter notification preview
    document.getElementById('twitter-notification-preview').src = '';

    // Clear Twitch preview
    document.getElementById('twitch-preview-1').src = '';
    document.getElementById('twitch-username-1').textContent = 'User';
    
    // Reset Discord username and tag
    discordPopupUsername.textContent = 'User';
    discordUserTag.textContent = 'user';
    // Reset Discord username
    discordUsername.textContent = 'User';
    // Reset Twitter name and handle
    document.getElementById('twitter-display-name').textContent = 'User';
    document.getElementById('twitter-handle').textContent = '@user';
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    imagePreview.src = '';
    fileInput.value = '';
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `alert alert-${type}`;
    notification.classList.remove('hidden');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}




