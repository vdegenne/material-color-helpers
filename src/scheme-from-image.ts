import {
	argbFromRgb,
	DynamicScheme,
	Hct,
	hexFromArgb,
	QuantizerCelebi,
	SchemeTonalSpot,
	Score,
} from '@material/material-color-utilities'

export {hexFromArgb} from '@material/material-color-utilities'

/**
 * Convert an HTMLImageElement into ImageData
 */
async function getImageDataFromImage(
	img: HTMLImageElement,
): Promise<ImageData> {
	const canvas = document.createElement('canvas')
	canvas.width = img.naturalWidth
	canvas.height = img.naturalHeight
	const ctx = canvas.getContext('2d')
	if (!ctx) {
		throw new Error('Canvas 2D context not available')
	}
	ctx.drawImage(img, 0, 0)
	return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

/**
 * Extract a Material color scheme from an image
 */
export async function schemeFromImage(
	img: HTMLImageElement,
	isDark = false,
): Promise<DynamicScheme> {
	const imageData = await getImageDataFromImage(img)

	// Convert pixels to ARGB ints
	const pixels: number[] = []
	for (let i = 0; i < imageData.data.length; i += 4) {
		const r = imageData.data[i]
		const g = imageData.data[i + 1]
		const b = imageData.data[i + 2]
		const a = imageData.data[i + 3]
		if (a < 255) continue // skip transparent pixels
		pixels.push(argbFromRgb(r, g, b))
	}

	// Quantize to representative colors
	const quantized = QuantizerCelebi.quantize(pixels, 128)

	// Rank & pick the best seed color
	const ranked = Score.score(quantized)
	const seed = ranked[0]

	// Convert seed to HCT
	const hct = Hct.fromInt(seed)

	// Create a tonal scheme
	const scheme = new SchemeTonalSpot(hct, isDark, 0.0)

	return scheme
}

/**
 * Extract a dominant color out an image in hexadecimal value.
 */
export async function dominantColorFromImage(
	img: HTMLImageElement,
): Promise<string> {
	const imageData = await getImageDataFromImage(img)

	// Convert pixels to ARGB ints
	const pixels: number[] = []
	for (let i = 0; i < imageData.data.length; i += 4) {
		const r = imageData.data[i]
		const g = imageData.data[i + 1]
		const b = imageData.data[i + 2]
		const a = imageData.data[i + 3]
		if (a < 255) continue // skip transparent pixels
		pixels.push(argbFromRgb(r, g, b))
	}

	// Quantize to representative colors
	const quantized = QuantizerCelebi.quantize(pixels, 128)

	// Rank & pick the best seed color
	const ranked = Score.score(quantized)
	const seed = ranked[0]

	return hexFromArgb(seed)
}
