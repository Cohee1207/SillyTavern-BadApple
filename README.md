# I played Bad Apple on SillyTavern

See on YouTube: <https://www.youtube.com/watch?v=W884cFA5TKE>

Bad Apple video is from <https://archive.org/details/bad-apple-resources>

## How to use

1. Install an extension from the URL: <https://github.com/Cohee1207/SillyTavern-BadApple>
2. Select "Bad Apple" from the "wand" menu.
3. Enjoy. Press Escape (on desktop) or tap the screen (on mobile) to stop.

## How does it work

1. Character avatars are arranged in a shuffled order in a grid, forming a pixel screen. The size of an individual pixel is the widest screen dimension divided by 50.
2. Music video is played in the background to provide audio and a source of image capturing.
3. Every animation frame is drawn onto an offscreen canvas which pulls an average RGB color of the pixel region converted to grayscale.
4. A grayscale value is then clamped to a 0-1 opacity value (black = transparent, white = opaque) of the image pixel.

## License

Code: AGPLv3
Video: idk, don't sue me
