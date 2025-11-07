# Peculiar Life of Mathematicians

A modern, responsive website exploring the fascinating lives and stories of history's greatest mathematicians.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional design with smooth animations
- **Interactive Navigation**: Smooth scrolling and active link highlighting
- **Contact Form**: Functional contact form with validation
- **Scroll Animations**: Cards and elements animate as you scroll

## File Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## Getting Started

1. Open `index.html` in your web browser
2. Navigate through different sections using the navigation menu
3. Explore the featured mathematicians
4. Use the contact form to send messages

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)

## Customization

### Adding More Mathematicians

Edit the `mathematician-grid` section in `index.html` and add new cards:

```html
<div class="mathematician-card">
    <h3>Mathematician Name</h3>
    <p>Brief description of their life and contributions.</p>
</div>
```

### Changing Colors

Modify the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* ... */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.
