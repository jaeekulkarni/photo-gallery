# The Photo Journal

The Photo Journal is a React-based photo gallery that displays images fetched from the [Picsum Photos API](https://picsum.photos/). The project focuses on building a responsive gallery while exploring React concepts such as hooks, API fetching, pagination, and infinite scrolling.

## Features

- **Photo Gallery:** Displays photos in a clean, responsive layout.
- **API Integration:** Fetches images dynamically using the Picsum Photos API.
- **Infinite Scrolling:** Loads more photos as the user scrolls down the page.
- **Like Button:** Allows users to like individual photos with an animated thumbs-up icon.
- **Search:** Search for photos using the author's name.
- **Image Preview:** Opens a larger preview of a selected photo.
- **Loading Skeletons:** Displays placeholders while photos are being loaded.
- **Scroll Progress Bar:** Shows how far the user has scrolled through the gallery.
- **Back to Top:** Provides a quick way to return to the beginning of the page.
- **Error Handling:** Handles failed API requests and provides an option to retry.
- **Duplicate Prevention:** Prevents duplicate photos and overlapping requests.

## Tech Stack

- React.js
- JavaScript
- CSS
- Vite
- Picsum Photos API
- Font Awesome

## Getting Started

To run the project locally:

1. Clone the repository.
2. Open the project folder in VS Code.
3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL displayed in your terminal.

To create a production build:

```bash
npm run build
```

## Technical Implementation

### 1. React Hooks

The project uses React hooks to manage the gallery's state and behaviour.

- `useState` is used to manage data such as photos, loading status, search input, and likes.
- `useEffect` is used for side effects such as fetching photos and setting up scroll-related behaviour.
- `useRef` is used to keep track of values that need to persist between renders without causing unnecessary re-renders.
- `useCallback` is used to memoize functions that are reused by effects and other parts of the component.

### 2. API Fetching

Photos are fetched from the Picsum Photos API using JavaScript's `fetch()` method.

The API provides image information such as the author's name, image ID, and image URL. This information is then used to display each photo in the gallery.

### 3. Pagination

Instead of loading all the photos at once, the application fetches them in smaller batches.

The page number is updated as more photos are requested. This helps reduce the initial loading time and avoids making unnecessary requests.

### 4. Infinite Scrolling

Infinite scrolling is implemented using the browser's `IntersectionObserver` API.

A reference element is placed near the end of the gallery. When this element becomes visible, the application triggers the next API request and loads more photos.

This allows users to continue browsing without having to click a separate load-more button.

### 5. Preventing Duplicate Requests

A reference is used to keep track of whether a request is already in progress. This helps prevent multiple requests from running at the same time.

The application also checks incoming photos to avoid adding duplicate images to the gallery.

### 6. Responsive Design

CSS media queries are used to adjust the gallery layout for different screen sizes. The design aims to keep the photos easy to browse on both desktop and mobile devices.

## Project Structure

```text
photo-gallery/
│
├── public/
├── src/
│   ├── components/
│   │   ├── PhotoCard.jsx
│   │   └── PhotoGallery.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md
```

## What I Learned

While building this project, I got practical experience with:

- Working with an external API and displaying dynamically fetched data.
- Managing component state using React hooks.
- Understanding how `useEffect` and `useCallback` work together.
- Implementing pagination and infinite scrolling.
- Using `IntersectionObserver` to detect when an element enters the viewport.
- Managing loading states and handling API errors.
- Building reusable React components.
- Improving the user experience through responsive styling and small UI interactions.

### How All 5 Concepts Work Together

```text
User Opens Website
       │
       ▼
1. useEffect runs on mount
       │
       ▼
2. API Fetching calls Picsum for page=1
       │
       ▼
3. useState updates 'photos' array with 30 items
       │
       ▼
4. React renders 30 PhotoCard components
   (Each PhotoCard manages its own useState(0) for likes & animKey)
       │
       ▼
5. User scrolls down toward bottom
       │
       ▼
6. Invisible sentinel element touches viewport threshold
       │
       ▼
7. IntersectionObserver detects visibility and triggers fetchPhotos()
       │
       ▼
8. Pagination: pageRef increments to 2, fetches page=2, appends photos
       │
       ▼
9. Cycle continues until Picsum returns [] (hasMore = false, sentinel unmounts)
```

---

##  Testing Verification

You can test all requirements directly on the application:

1. **Initial Load (Page 1)**: Open `http://localhost:3000/`. Notice 30 photos with author names and like counts starting at `0`.
2. **Minimal Like Button & Bounce Animation**:
   - Click the black thumbs-up icon on any photo.
   - The icon performs a playful wiggle/bounce animation and increments by 1.
   - Click repeatedly: each click triggers the animation and increments the count.
   - Check adjacent photos: their counters remain independent.
3. **Infinite Scrolling**: Scroll down. The observer triggers page 2, displays shimmering skeleton cards, and appends the new photos seamlessly without reloading earlier photos.
4. **Search Filter**: Type an author's name into the top search bar. The loaded list filters instantly in real time.
5. **Image Preview Modal**: Click on any photo to open the preview modal with backdrop blur; close it via the `×` button, clicking outside, or pressing `Esc`.
6. **Back to Top**: Scroll down past 400px; click the floating blue arrow in the bottom right corner to smoothly scroll back to the top.

## Future Improvements

Some improvements I would like to explore are:

- Adding the ability to save favourite photos.
- Improving accessibility and keyboard navigation.
- Adding more filtering and sorting options.
- Writing tests for the main gallery features.


## Conclusion

Building The Photo Journal helped me understand how different React concepts work together in an actual application. It was a good opportunity to practise API integration, state management, pagination, and creating a responsive user interface.
---